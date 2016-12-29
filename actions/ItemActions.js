import dispatcher from '../dispatcher.js';

export function getItems() {
  dispatcher.dispatch({
    type: "GET_ITEMS"
  })
}

export function addItem(data) {
  dispatcher.dispatch({
    type: "ADD_ITEM",
    character: {
      id:       data.id,
      name:     data.name,
      category: data.category,
      price:    data.price,
      sku:      data.sku,
      quantity: data.quantity
    }
  })
}

export function updateItem(id,data) {
  dispatcher.dispatch({
    type: "UPDATE_ITEM",
    id: id,
    data: data
  })
}

export function deleteItem(id) {
  dispatcher.dispatch({
    type: "DELETE_ITEM",
    id: id
  })
}
