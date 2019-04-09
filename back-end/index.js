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
    origin     : config.franceConnect.FS_URL
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
        maxAge  : 2 * 24 * 60 * 60 * 1000,
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
const attestations  = require('./routes/attestations');
const structures    = require('./routes/structures');
const pdf           = require('./routes/pdf');
const user          = require('./routes/user');
const documents     = require('./routes/documents');

// Route vers la page de connexion
app.use('/api/connexion', connexion);

app.use('/api/interventions', interventions);

app.use('/api/listecommune', listecommune);

app.use('/api/attestations', attestations);

app.use('/api/structures', structures);

app.use('/api/documents', documents);

app.use('/api/pdf', pdf);

app.use('/api/user', user);

app.get('/api', function (req, res) {
    res.send('Bienvenue sur le backend de Savoir Rouler à vélo');
});

app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
})