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

export function deleteCharacter(id) {
  dispatcher.dispatch({
    type: "DELETE_ITEM",
    id: id
  })
}

export function updateCharacterLocation(id,data) {
  dispatcher.dispatch({
    type: "UPDATE_ITEM",
    id: id,
    data: data
  })
}
