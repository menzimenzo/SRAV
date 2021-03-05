const express = require('express');
const app     = express();
var   cors    = require('cors')


const session   = require('express-session');
const pgSession = require('connect-pg-simple')(session)
const pgPool    = require('./pgpool').getPool();

var config     = require('./config');
app.locals.FCUrl = config.franceConnect.fcURL
var bodyParser = require('body-parser');
app.use(cors({
    credentials: true,
    origin: new RegExp(config.FRONT_DOMAIN.replace('.', '\\.') + "$") 
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/**
 * Session config
 * About the warning on connect.session()
 * @see {@link https://github.com/expressjs/session/issues/556}
 * @see {@link https://github.com/expressjs/session/blob/master/README.md#compatible-session-stores}
 */
app.use(session({
    store : new pgSession({
        pool     : pgPool,          // Connection pool
        tableName: 'user_sessions'  // Use another table-name than the default "session" one
    }),
    secret: config.sessionSecret,
    cookie: {
        // Session est valide 2 jours
        //maxAge  : 2 * 24 * 60 * 60 * 1000,
        // Session maintenue pour 10 heures
        maxAge  : 8 * 60 * 60 * 1000,
        domain  : config.FRONT_DOMAIN,
        secure  : false,
        httpOnly: false
    },
    saveUninitialized: false,
    resave           : true,
    proxy            : true
}));

const connexion     = require('./routes/connexion');
const interventions = require('./routes/interventions');
const listecommune  = require('./routes/listecommune');
const listedepartement  = require('./routes/listedepartement');
const listepci  = require('./routes/listepci');
const attestations  = require('./routes/attestations');
const structures    = require('./routes/structures');
const pdf           = require('./routes/pdf');
const user          = require('./routes/user');
const documents     = require('./routes/documents');
const batch         = require('./routes/batch');

// Route vers la page de connexion
app.use(config.URL_PREFIX + '/connexion', connexion);

app.use(config.URL_PREFIX + '/interventions', interventions);

app.use(config.URL_PREFIX + '/listecommune', listecommune);

app.use(config.URL_PREFIX + '/listedepartement', listedepartement);

app.use(config.URL_PREFIX + '/listepci', listepci);

app.use(config.URL_PREFIX + '/attestations', attestations);

app.use(config.URL_PREFIX + '/structures', structures);

app.use(config.URL_PREFIX + '/documents', documents);

app.use(config.URL_PREFIX + '/pdf', pdf);

app.use(config.URL_PREFIX + '/user', user);

app.get(config.URL_PREFIX + '', function (req, res) {
    res.send('Bienvenue sur le backend de Savoir Rouler à vélo');
});

app.use(config.URL_PREFIX + '/batch', batch);

app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
})