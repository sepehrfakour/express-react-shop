const db      = require(__dirname + '/../../../config/db.js'),
      pg      = db.pg,
      config  = db.config;

class OrdersModel {
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
  getOrders(callback) {
    let queryString = "SELECT * FROM orders ORDER BY id DESC";
    this.executeQuery(queryString, callback);
  }
  getOrdersByEmail(email, callback) {
    let queryString = "SELECT * FROM orders WHERE customer_email = ($1) ORDER BY name ASC",
        values = [];
    values.push(email);
    this.executeQuery(queryString, callback, values);
  }
  getOrder(id, callback) {
    let queryString = "SELECT * FROM orders WHERE id = ($1) LIMIT 1",
        values = [];
    values.push(id);
    this.executeQuery(queryString, callback, values);
  }
  addOrder(data, callback) {
    let queryString = "INSERT into orders (status, customer_email, customer_phone, currency, subtotal_price_amount, total_price_amount, tax_price_amount, shipping_method, shipping_price_amount, shipping_street_1, shipping_street_2, shipping_city, shipping_state, shipping_country, shipping_postal_code, shipping_special_instructions) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *",
        values = [];
    values.push(data.status, data.customer_email, data.customer_phone, data.currency, data.subtotal_price_amount, data.total_price_amount, data.tax_price_amount, data.shipping_method, data.shipping_price_amount, data.shipping_street_1, data.shipping_street_2, data.shipping_city, data.shipping_state, data.shipping_country, data.shipping_postal_code, data.shipping_special_instructions);
    this.executeQuery(queryString, callback, values);
  }
  updateOrder(data, callback) {
    let queryString = "UPDATE orders SET (status, customer_email, customer_phone, currency, subtotal_price_amount, total_price_amount, tax_price_amount, shipping_method, shipping_price_amount, shipping_street_1, shipping_street_2, shipping_city, shipping_state, shipping_country, shipping_postal_code, shipping_special_instructions) = ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) WHERE id = ($17)",
        values = [];
    values.push(data.status, data.customer_email, data.customer_phone, data.currency, data.subtotal_price_amount, data.total_price_amount, data.tax_price_amount, data.shipping_method, data.shipping_price_amount, data.shipping_street_1, data.shipping_street_2, data.shipping_city, data.shipping_state, data.shipping_country, data.shipping_postal_code, data.shipping_special_instructions, data.id);
    this.executeQuery(queryString, callback, values);
  }
  deleteOrder(id, callback) {
    let queryString = "DELETE FROM orders WHERE id = $1",
        values = [];
    values.push(id);
    this.executeQuery(queryString, callback, values);
  }
}

const ordersModel = new OrdersModel;

module.exports = ordersModel;
