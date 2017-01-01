const pg      = require('pg'),
      URL     = require('url'),
      connect = process.env.PG_URL || "postgres://S:@localhost:5432/plocal",
      params  = URL.parse(connect),
      auth    = params.auth.split(':'),
      config  = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split('/')[1],
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
        ssl: (process.env.NODE_ENV === 'production') ? true : false
      };

module.exports = {
  pg,
  config
};
