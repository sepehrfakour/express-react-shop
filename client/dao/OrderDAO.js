import { browserHistory } from 'react-router';

class OrderDAO {
  constructor () {
    // super();
  }
  getOrders (callback) {
    // Get items from DB then run provided callback
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/v1/orders`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // Valid response with an array of order objects
          let response = JSON.parse(xhr.responseText);
          callback(response);
        } else if (xhr.status === 403) {
          // Client needs to authenticate
          window.location.href = '/login';
        }
        else{
          // Error
          alert('Oops! Something went wrong. Could not get orders.');
        }
      }
    };
    xhr.send();
  }
}

const orderDAO = new OrderDAO;

export default orderDAO;
