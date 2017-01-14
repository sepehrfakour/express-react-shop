import dispatcher from '../dispatcher.js';

const ItemDAO = require('../dao/ItemDAO.js').default;

export function getItems() {
  dispatcher.dispatch({
    type: "GET_ITEMS"
  })
}

export function addItem(data) {
  dispatcher.dispatch({
    type: "ADD_ITEM",
    data: data
  });
  ItemDAO.addItem(data);
}

export function updateItem(data) {
  dispatcher.dispatch({
    type: "UPDATE_ITEM",
    data: data
  })
  ItemDAO.updateItem(data);
}

export function deleteItem(data) {
  dispatcher.dispatch({
    type: "DELETE_ITEM",
    data: data
  })
  ItemDAO.deleteItem(data);
}

