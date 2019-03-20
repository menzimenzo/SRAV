var pg = require('pg');
var config = require('./config')
var pool

var config = {
    user: config.postgres.user,
    host: config.postgres.host,
    database: config.postgres.database,
    password: config.postgres.password,
    port: config.postgres.port,
    max: 15,
    idleTimeoutMillis: 30000
}

module.exports = {
    // Retourne la pool Postgres, la crée si nécessaire
    getPool: function () {
      if (pool) return pool
      pool = new pg.Pool(config)
      return pool
    }
}
