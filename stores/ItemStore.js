import { EventEmitter } from "events";

import dispatcher from "../dispatcher.js";

class ItemStore extends EventEmitter {
  constructor() {
    super();
    this.items = [];
    var that = this;
    // Async read items from server, then emit change event so components update
    fetch('/api/v1/items')
      .then( function (res) {
        return res.json();
      })
      .then( function(json) {
        that.items = json;
        that.emit("change");
        console.log(json);
      })

    // this.items = [
    //   {
    //     id: 'ny768uvu2',
    //     name: 'Milagoose Hat',
    //     category: 'hats',
    //     price: '180.18',
    //     sku: '578098765',
    //     quantity: 10
    //   },
    // ];

  }
  getItems() {
    console.log("Items:", this.items);
    return this.items;
  }
  addItem(data) {
    let item = {
      id:       data.id,
      name:     data.name,
      category: data.category,
      price:    data.price,
      sku:      data.sku,
      quantity: data.quantity
    }
    this.items.push(item);
    this.emit("change");
  }
  deleteItem(id) {
    let items = this.items;
    // If character exists, delete it
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items.splice(i,1);
      }
    }
    this.items = items;
    this.emit("change");
  }
  updateItem(id,data) {
    // If character exists, update its location
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
        this.items[i].data = data;
      }
    }
    this.emit("change");
  }
  handleActions(action) {
    console.log("ItemStore received an action:", action);
    switch(action.type) {
      case "GET_ITEMS": {
        this.getItems();
        break;
      }
      case "ADD_ITEM": {
        this.addItem(action.item);
        break;
      }
      case "DELETE_ITEM": {
        this.deleteItem(action.id);
        break;
      }
      case "UPDATE_ITEM": {
        this.updateItem(action.id,action.data);
        break;
      }
      default: {
        break;
      }
    }
  }
}

const itemStore = new ItemStore;
dispatcher.register(itemStore.handleActions.bind(itemStore));
window.itemStore = itemStore;

export default itemStore;
