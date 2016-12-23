var pg      = require('pg'),
    connect = process.env.PG_URL || "postgres://S:@localhost:5432/plocal";

module.exports = {
  pg,
  connect
};
