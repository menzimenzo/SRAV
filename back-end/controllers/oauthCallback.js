/**
 * Helper to get an access token from France Connect.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
const axios =  require('axios')
const querystring =  require('querystring')
const config =  require( '../config')
const pgPool = require('../pgpool').getPool();
const {formatUtilisateur} = require('../utils/utils')

/**
 * Init FranceConnect authentication login process.
 * Make every http call to the different API endpoints.
 */
const oauthCallback = async (req, res, next) => {
  // check if the mandatory Authorization code is there.
  if (!req.query.code) {
    return res.sendStatus(400);
  }

  // Set request params.
  const body = {
    grant_type: 'authorization_code',
    redirect_uri: `${config.franceConnect.FS_URL}${config.franceConnect.CALLBACK_FS_PATH}`,
    client_id: config.franceConnect.CLIENT_ID,
    client_secret: config.franceConnect.CLIENT_SECRET,
    code: req.query.code,
  };

  try {
    // Request access token.
    const { data: { access_token: accessToken, id_token: idToken } } = await axios({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: querystring.stringify(body),
      url: `${config.franceConnect.FC_URL}${config.franceConnect.TOKEN_FC_PATH}`,
    }).catch(error => {
      console.log(error)
      throw(error)
    });

    // Make a call to the France Connect API endpoint to get user data.
    if (!accessToken) {
      return res.sendStatus(401);
    }

    req.accessToken = accessToken;
    req.session.accessToken = accessToken;
    req.session.idToken = idToken;

    const { data: userInfo } = await axios({
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      url: `${config.franceConnect.FC_URL}${config.franceConnect.USERINFO_FC_PATH}`,
    });

    if(!userInfo.email){userInfo.email = ''}

    var utilisateur, url,nom
    await pgPool.query('SELECT * from utilisateur where uti_tockenfranceconnect = $1', [$1 = userInfo.sub],
      async (err, result) => {
          if(err){
            console.log(err)
            throw(err)
          }
          //console.log('Nom d\'usage :' + userInfo.preferred_username);
          //console.log('Nom de naissance :' + userInfo.family_name);

          // recuperation du nom d'usage plutot que du nom de naissance
          if (userInfo.preferred_username != undefined && userInfo.preferred_username != '') { 
            console.log('utilisation préférentielle du nom d\'usage plutot que de naissance')
            nom = userInfo.preferred_username
          }
          else
          {
            //console.log('utilisation préférentielle du nom de naissance')
            nom = userInfo.family_name
          }

          // If user was never created we insert it in our database
          if (result.rows.length === 0) {
            console.log("L'utilisateur n'existe pas");
            url = "/connexion/inscription"
            
            const { rows } = await pgPool.query(
              'INSERT INTO utilisateur(pro_id, stu_id, uti_mail, uti_nom, uti_prenom,\
                uti_tockenfranceconnect) VALUES($1, $2, $3, upper($4), $5, $6) RETURNING *'
              , [3, 1, userInfo.email, nom, userInfo.given_name, userInfo.sub]
            ).catch(err => {
              console.log(err)
              throw err
            })
            utilisateur = rows[0]

          // User is logging in
          } else {
            
            utilisateur = result.rows[0]
            // Mantis 68472 - sauvegarde systématique du nom
            const { rows } = await pgPool.query(
              'UPDATE utilisateur SET uti_nom = $1 where uti_id = $2 RETURNING *'
              , [nom,utilisateur.uti_id]
            ).catch(err => {
              console.log('erreur lors de la sauvegarde du nom:'+err)
              throw err
            })
            utilisateur.uti_nom = nom
            // -- fin 68472

            // Account was never validated so is considered as new user
            if(!utilisateur.validated){
              url = "/connexion/inscription"
            // User access the app
            } else {
              if(utilisateur.pro_id == 1){
                url = "/admin"
              } else if(utilisateur.pro_id == 2) {
                url = "/partenaire"
              } else {
                url = "/interventions"
              }
            }
          }

          //console.log(err.message)
          req.session.user = utilisateur
          return res.send({user: formatUtilisateur(utilisateur), url});
      })
  } catch (error) {
    console.log(error)
    return next(error);
  }
};

module.exports =  {oauthCallback};
