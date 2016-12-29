const db      = require(__dirname + '/../../../config/db.js'),
      pg      = db.pg,
      connect = db.connect;

class ItemsModel {
  constructor() {
    // super();
  }
  executeQuery(queryString, callback) {
    let client = new pg.Client(connect),
        query  = client.query(queryString),
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
    let queryString = "SELECT * FROM items";
    this.executeQuery(queryString, callback);
  }
  getItemsByCategory(category, callback) {
    let queryString = "SELECT * FROM items WHERE category = '" + category + "' ORDER BY name ASC";
    this.executeQuery(queryString, callback);
  }
  getItem(id, callback) {
    let queryString = "SELECT * FROM items WHERE id = " + id + " LIMIT 1";
    this.executeQuery(queryString, callback);
  }
  addItem(data, callback) {
    // let values = "'" + [data.category, data.name, data.price, data.sku, data.quantity].join("' , '") + "'";
    let values = "'" + data.category + "' , '"
                     + data.name + "' , " // price is numeric, so no single quote here
                     + data.price + " , '"
                     + data.sku + "' , " // quantity is numeric, so no single quote here
                     + data.quantity;
    let queryString = "INSERT into items (category, name, price, sku, quantity) VALUES (" + values + ") RETURNING *";
    this.executeQuery(queryString, callback);
  }
  updateItem(data, callback) {
    let values = "'" + data.category + "' , '"
                     + data.name + "' , " // price is numeric, so no single quote here
                     + data.price + " , '"
                     + data.sku + "' , " // quantity is numeric, so no single quote here
                     + data.quantity;
    let queryString = "UPDATE items SET (category, name, price, sku, quantity) = (" + values + ") WHERE id = " + data.id;
    this.executeQuery(queryString, callback);
  }
  deleteItem(id, callback) {
    let queryString = "DELETE FROM items WHERE id = " + id;
    this.executeQuery(queryString, callback);
  }
}

const itemsModel = new ItemsModel;

module.exports = itemsModel;
