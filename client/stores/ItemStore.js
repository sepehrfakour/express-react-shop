import { EventEmitter } from "events";

import dispatcher from "../dispatcher.js";

const ItemDAO = require('../dao/ItemDAO.js').default;

class ItemStore extends EventEmitter {
  constructor() {
    super();
    this.items = [];

    // Async retreive items from server. See this.setItemsCallback for behavior on successful API fetch
    ItemDAO.getItems(this.setItemsCallback.bind(this));

    // this.items = [
    //   {
    //     id: 'ny768uvu2',
    //     name: 'Milagoose Hat',
    //     item_group: 'milagoose_hat',
    //     category: 'hats',
    //     price: '180.18',
    //     size: 'S',
    //     color: 'blue',
    //     description: 'a really cool hat',
    //     sku: '578098765',
    //     quantity: 10,
    //     status: 'active',
    //   },
    // ];
  }
  setItemsCallback (json) {
      this.items = json;
      this.emit("change");
  }
  getItems() {
    return this.items;
  }
  getValidItems() {
    return this.items.filter( function (item) {
      return (item.status === 'active' && item.quantity > 0);
    });
  }
  getItemsByCategory(category) {
    return this.items.filter( function (item) {
      return (item.category === category);
    });
  }
  getValidItemsByCategory(category) {
    return this.items.filter( function (item) {
      return (item.category === category && item.status === 'active' && item.quantity > 0);
    });
  }
  getItemsByItemGroup(item_group) {
    return this.items.filter( function (item) {
      return (item.item_group === item_group);
    });
  }
  getValidItemsByItemGroup(item_group) {
    return this.items.filter( function (item) {
      return (item.item_group === item_group && item.status === 'active' && item.quantity > 0);
    });
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
      id:          data.tempid,
      name:        data.name,
      item_group:  data.item_group,
      category:    data.category,
      price:       data.price,
      size:        data.size,
      color:       data.color,
      description: data.description,
      sku:         data.sku,
      quantity:    data.quantity,
      imageurl:    data.imageurl,
      status:      data.status
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

export default itemStore;
