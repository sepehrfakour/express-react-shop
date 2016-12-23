const db      = require(__dirname + '/../../../config/db.js'),
      pg      = db.pg,
      connect = db.connect;

class ItemsModel {
  constructor() {
    // super();
  }
  getItems(callback) {
    let client = new pg.Client(connect);
    let query = client.query('SELECT * FROM items');
    let results = [];
    client.connect();
    query.on('row', function(row) {
        results.push(row);
    });
    query.on('end', function() {
        client.end();
        callback(results);
    });
  }
  getItemsByCategory(category, callback) {
    let client = new pg.Client(connect);
    let query = client.query("SELECT * FROM items WHERE category = '" + category + "' ORDER BY name ASC");
    let results = [];
    client.connect();
    query.on('row', function(row) {
        results.push(row);
    });
    query.on('end', function() {
        client.end();
        callback(results);
    });
  }
  getItem(id, callback) {
    let client = new pg.Client(connect);
    let query = client.query('SELECT * FROM items WHERE id = ' + id + ' LIMIT 1');
    let results = [];
    client.connect();
    query.on('row', function(row) {
        results.push(row);
    });
    query.on('end', function() {
        client.end();
        callback(results[0]);
    });
  }
  addItem(data) {
  }
  updateItem(id, data) {
  }
  deleteItem(id) {
  }
}

const itemsModel = new ItemsModel;

module.exports = itemsModel;
