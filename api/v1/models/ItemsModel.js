const db      = require(__dirname + '/../../../config/db.js'),
      pg      = db.pg,
      connect = db.connect;

class ItemsModel {
  constructor() {
    // super();
  }
  executeQuery(queryString, callback, values) {
    let client = new pg.Client(connect),
        query  = (values) ? client.query(queryString, values) : client.query(queryString),
        results = [];
    client.connect( function (error) {
      if (error) { console.log('Client connection error: ', error); }
    });
    query.on('error', function(error) {
      if (error) { console.log('Query error: ', error); }
    });
    query.on('row', function(row) {
        results.push(row);
    });
    query.on('end', function() {
        client.end();
        if (results.length > 1) {
          callback(results);
        } else {
          callback(results[0]);
        }
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
    let queryString = "INSERT into items (category, name, price, sku, quantity) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        values = [];
    values.push(data.category, data.name, data.price, data.sku, data.quantity);
    this.executeQuery(queryString, callback, values);
  }
  updateItem(data, callback) {
    let queryString = "UPDATE items SET (category, name, price, sku, quantity) = ($1,$2,$3,$4,$5) WHERE id = ($6)",
        values = [];
    values.push(data.category, data.name, data.price, data.sku, data.quantity, data.id);
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
