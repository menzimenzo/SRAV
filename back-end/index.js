const express = require('express');
const app = express();
const session = require('express-session');
var cors = require('cors')
const sessionstore = require('sessionstore');
const connexion = require('./routes/connexion');
const interventions = require('./routes/interventions');
const listecommune = require('./routes/listecommune');
const attestations = require('./routes/attestations');
const structures = require('./routes/structures');
const pdf = require('./routes/pdf');
const user = require('./routes/user');
const documents = require('./routes/documents');

var config = require('./config');
var bodyParser = require('body-parser');
app.use(cors({
    credentials: true,
    origin: config.franceConnect.FS_URL
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
    store : sessionstore.createSessionStore(),
    secret: config.sessionSecret,
    cookie: {
        maxAge  : 2 * 24 * 60 * 60 * 1000,
        domain  : config.FRONT_DOMAIN,
        secure  : false,
        httpOnly: false
    },
    saveUninitialized: false,
    resave           : true,
    proxy            : true
}));

app.locals.FCUrl = config.franceConnect.fcURL
// Route vers la page de connexion
app.use('/connexion', connexion);

app.use('/interventions', interventions);

app.use('/listecommune', listecommune);

app.use('/attestations', attestations);

app.use('/structures', structures);

app.use('/documents', documents);

app.use('/pdf', pdf);

app.use('/user', user);

app.get('/', function (req, res) {
    res.send('Bienvenue sur le backend de Savoir Rouler à vélo');
});

app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
})