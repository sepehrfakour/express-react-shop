const db      = require(__dirname + '/../../../config/db.js'),
      pg      = db.pg,
      config  = db.config;

class ItemsModel {
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
  getItems(callback) {
    let queryString = "SELECT * FROM items ORDER BY id DESC";
    this.executeQuery(queryString, callback);
  }
  getItemsByCategory(category, callback) {
    let queryString = "SELECT * FROM items WHERE category = ($1) ORDER BY name ASC",
        values = [];
    values.push(category);
    this.executeQuery(queryString, callback, values);
  }
  getItem(id, callback) {
    let queryString = "SELECT * FROM items WHERE id = ($1) LIMIT 1",
        values = [];
    values.push(id);
    this.executeQuery(queryString, callback, values);
  }
  addItem(data, callback) {
    let queryString = "INSERT into items (category, name, item_group, price, size, color, description, sku, quantity, imageurl, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",
        values = [];
    values.push(data.category, data.name, data.item_group, data.price, data.size, data.color, data.description, data.sku, data.quantity, data.imageurl, data.status);
    this.executeQuery(queryString, callback, values);
  }
  updateItem(data, callback) {
    let queryString = "UPDATE items SET (category, name, item_group, price, size, color, description, sku, quantity, imageurl, status) = ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) WHERE id = ($12)",
        values = [];
    values.push(data.category, data.name, data.item_group, data.price, data.size, data.color, data.description, data.sku, data.quantity, data.imageurl, data.status, data.id);
    this.executeQuery(queryString, callback, values);
  }
  deleteItem(id, callback) {
    let queryString = "DELETE FROM items WHERE id = $1",
        values = [];
    values.push(id);
    this.executeQuery(queryString, callback, values);
  }
}

const itemsModel = new ItemsModel;

module.exports = itemsModel;
