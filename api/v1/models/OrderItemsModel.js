const db      = require(__dirname + '/../../../config/db.js'),
      pg      = db.pg,
      config  = db.config;

class OrderItemsModel {
  constructor() {
    // super();
  }
  executeQuery(queryString, callback, values) {
    let pool = new pg.Pool(config),
        results = [];
    pool.connect( function (error, client, done) {
      if (error) { console.log('Error fetching client from pool: ', error); }
      let query  = (values) ? client.query(queryString, values) : client.query(queryString);
      done(); // Release client back into pool
      query.on('error', function(error) {
        if (error) { console.log('Query error: ', error); }
      });
      query.on('row', function(row) {
          results.push(row);
      });
      query.on('end', function() {
          if (results.length > 1) {
            callback(results);
          } else {
            callback(results[0]);
          }
      });
    });
    pool.on('error', function (err, client) {
      console.error('idle client error', err.message, err.stack);
    });
  }
  addOrderItems(data, callback) {
    let variableString = '',
        values = [data.order_id];
    for (var i = 0; i < data.cart.length; i++) {
      // Example values array: [order_id, item_id, quantity, item_id, quantity, item_id, quantity]
      values.push(data.cart[i].id);
      values.push(data.cart[i].quantity);
      // Example variableString: ($1,$2,$3), ($1,$4,$5), ($1,$6,$7),
      let varNum = (2 + (i*2));
      variableString += ( '($1, $' + (varNum) + ', $' + (varNum+1) + '),' );
    }
    variableString = variableString.slice(0,variableString.length-1); // Remove trailing comma
    let queryString = "INSERT into order_items (order_id, item_id, quantity) VALUES " + variableString + " RETURNING *";
    this.executeQuery(queryString, callback, values);
  }
  addOrderItem(data, callback) {
    let queryString = "INSERT into order_items (order_id, item_id) VALUES ($1,$2) RETURNING *",
        values = [];
    values.push(data.order_id, data.item_id);
    this.executeQuery(queryString, callback, values);
  }
}

const orderItemsModel = new OrderItemsModel;

module.exports = orderItemsModel;
