module.exports = {
  postgres: {
    user: process.env.POSTGRES_URL || "u_srv_dev",
    host: process.env.POSTGRES_HOST || "pg",
    database: process.env.POSTGRES_DB || "srv_dev",
    password: process.env.POSTGRES_PWD ||"Sr4v3l0!",
    port: process.env.POSTGRES_PORT ||5432
    /* Config Laurent
    user: process.env.POSTGRES_URL || "io_integ",
    host: process.env.POSTGRES_HOST || "ac000941",
    database: process.env.POSTGRES_DB || "postgres",
    password: process.env.POSTGRES_PWD ||"SIAO@paris75",
    port: process.env.POSTGRES_PORT ||52002
    */
  },
  // les watchers ("normal" et nuxt) ne semblent pas fonctionner sous windows
  watch: true,
  watchers: {
    webpack: {
      poll: true
    }
  },
  sessionSecret: "vB2P+i@/Uz>+yK%@LK@g9Vb93gZ^c<",
  pathAttestation: process.env.PATH_PDF_ATTESTATION || "../../tmp/",
  PATH_SUPERVISION_BATCH: process.env.PATH_SUPERVISION_BATCH || "/var/tmp/",
  MAIL_URL: process.env.MAIL_URL,
  URL_PREFIX: process.env.URL_PREFIX || '/api',
  SENDER_EMAIL: process.env.SENDER_EMAIL || 'nepasrepondresrav@sports.gouv.fr',
  FRONT_DOMAIN: process.env.FRONT_DOMAIN || 'localhost', 
  // FRANCE CONNECT
  franceConnect: {
    "FC_URL": process.env.FC_URL || "https://fcp.integ01.dev-franceconnect.fr",
    "FS_URL": process.env.FS_URL || "http://localhost",
    //"FRANCE_CONNECT_KIT_PATH":process.env.FRANCE_CONNECT_KIT_PATH ||  "/js/franceconnect.js",

    "CLIENT_ID": process.env.CLIENT_ID || "14a5bbbc66fd6ea4a525e5faadb38afec6bd07375d12dba2a42ffb7cab9ef49d",
    "CLIENT_SECRET": process.env.CLIENT_SECRET || "9154ebbc9f9243cc34899ee7fecbf17f55a4d8208f51f0317df414586b010132",
    
    "CALLBACK_FS_PATH": process.env.CALLBACK_FS_PATH || "/connexion/login",
    "LOGOUT_FS_PATH": process.env.LOGOUT_FS_PATH || "/connexion/logout",
    
    "AUTHORIZATION_FC_PATH": process.env.AUTHORIZATION_FC_PATH || "/api/v1/authorize",
    "TOKEN_FC_PATH": process.env.TOKEN_FC_PATH || "/api/v1/token",
    "USERINFO_FC_PATH": process.env.USERINFO_FC_PATH || "/api/v1/userinfo",
    "LOGOUT_FC_PATH": process.env.LOGOUT_FC_PATH || "/api/v1/logout",

    "SCOPES": "openid profile birth",

    // Random values for security purpose
    "state": "02XZ4MjSE0OAZ3JS",
    "nonce": new Date().toISOString()
    
  }
}