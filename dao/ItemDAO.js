const HelperActions = require('../actions/HelperActions.js');

class ItemDAO {
  constructor() {}
  // get () {
  //   if (!this.promises[id]) {
  //     this.promises[id] = new Promise((resolve, reject) => {
  //       // ajax handling here...
  //       // fetch()
  //     });
  //   }
  //   return this.promises[id];
  // }
  executeWriteRequest (endpoint,data) {
    // Async write items to server
    let request = new Request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      credentials: 'include'
    });
    fetch(request).then( function (res) {
      return res.text();
    }).then( function(responseText) {
      /* If the response here is from a new item write, capture the new item ID (created by DB server-side).
      Then, use the new (real) ID to update the DOM item element's temporary ID in the Store */
      if (endpoint === '/api/v1/item/create') { HelperActions.setRealId(data.tempid, JSON.parse(responseText).id) };
      console.log("Request executed. Response:",responseText);
    });

  }
  getItems(callback) {
    // Fetch items from DB then run provided callback
    fetch('/api/v1/items')
      .then( function (res) {
        return res.json();
      })
      .then( function(json) {
        callback(json);
      });
  }
  getItem(id) {
    // TODO: Create method here
  }
  addItem(data) {
    let endpoint = '/api/v1/item/create';
    this.executeWriteRequest(endpoint,data);
  }
  updateItem(data) {
    let endpoint = '/api/v1/item/update';
    this.executeWriteRequest(endpoint,data);
  }
  deleteItem(data) {
    let endpoint = '/api/v1/item/delete';
    this.executeWriteRequest(endpoint,data);
  }
}

const itemDAO = new ItemDAO;

export default itemDAO;
