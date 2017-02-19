import { browserHistory } from 'react-router';

const AlertActions = require('../actions/AlertActions.js');

class OrderDAO {
  getOrders (callback) {
    let that = this;
    // Get items from DB then run provided callback
    let request = new Request('/api/v1/orders', {
      method: 'GET',
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
        (response.status === 200) ? callback(JSON.parse(response.message)) : that._handleError(response);
      });
  }
  _handleError (response) {
    if (response.status === 403) {
      window.location.href = '/login'; // Client needs to authenticate
    }
    let msg = 'Error:\n\n' + 'Status: ' + response.status + '\n\n' + 'Message: ' + response.message;
    AlertActions.addAlert(msg,'negative');
  }
}

const orderDAO = new OrderDAO;

export default orderDAO;
