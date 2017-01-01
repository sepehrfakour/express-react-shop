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
    return this.items;
  }
  getItemsByCategory(category) {
    let output = [];
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].category === category) {
        output.push(this.items[i]);
      }
    }
    return output;
  }
  getItem(id) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
        return this.items[i];
      }
    }
    return -1;
  }
  addItem(data) {
    let item = {
      id:        data.tempid,
      name:      data.name,
      category:  data.category,
      price:     data.price,
      sku:       data.sku,
      quantity:  data.quantity,
      imageurl:  data.imageurl
    }
    this.items.push(item);
    this.emit("change");
  }
  updateItem(data) {
    // If item exists, update it
    let items = this.items,
        id = data.id;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items[i] = data;
      }
    }
    this.items = items;
    this.emit("change");
  }
  deleteItem(data) {
    // If item exists, delete it
    let items = this.items,
        id = data.id;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items.splice(i,1);
      }
    }
    this.items = items;
    this.emit("change");
  }
  setRealId(tempid, realid) {
    /* New items have their authoritative ID's created upon their insertion in the DB. Thus, when we create
    a new item element client-side in React, and add it to the item store, it will first have a temporary randomly
    genereated ID. Because that ID will be used client-side by edit/delete click handlers, we will strive to
    update the DOM elements' temporary ID ASAP, to the real ID from DB (which are returned in the response when
    DAO AJAX promise is resolved). Thus, upon DAO AJAX prmoise resolution, an Action trigger this method */
    let items = this.items;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === tempid) {
        items[i].id = realid;
      }
    }
    this.items = items;
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
        this.addItem(action.data);
        break;
      }
      case "UPDATE_ITEM": {
        this.updateItem(action.data);
        break;
      }
      case "DELETE_ITEM": {
        this.deleteItem(action.data);
        break;
      }
      case "SET_REAL_ID": {
        this.setRealId(action.tempid, action.realid);
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
