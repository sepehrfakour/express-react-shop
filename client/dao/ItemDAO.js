const HelperActions = require('../actions/HelperActions.js');

const AlertActions = require('../actions/AlertActions.js');

class ItemDAO {
  constructor() {}
  executeWriteRequest (endpoint,data) {
    let that = this;
    let request = new Request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-CSRF-Token': window.csrf_token
      }),
      credentials: 'same-origin'
    });
    fetch(request)
      .then( function (res) {
        return res.text().then(text => {
          return {
            message: text,
            status: res.status
          }
        });
      })
      .then( function(response) {
        (response.status === 200)
          ? that._handleWriteSuccess(response,endpoint,data)
          : that._handleWriteError(response,endpoint);
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
  getItem(id) {}
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
  _handleWriteSuccess (response,endpoint,data) {
    /* If the response here is from a new item write, capture the new item ID (created by DB server-side).
    Then, use the new (real) ID to update the DOM item element's temporary ID in the Store */
    if (endpoint === '/api/v1/item/create') { HelperActions.setRealId(data.tempid, JSON.parse(response.message).id) };
    AlertActions.addAlert('Item saved','positive');
  }
  _handleWriteError (response,endpoint) {
    let msg = 'Error:\n\n' + 'Status: ' + response.status + '\n\n' + 'Message: ' + response.message;
    AlertActions.addAlert(msg,'negative');
  }
}

const itemDAO = new ItemDAO;

export default itemDAO;
