import { EventEmitter } from "events";

import dispatcher from "../dispatcher.js";

class AlertStore extends EventEmitter {
  constructor() {
    super();
    this.alerts = [];
    // Example Alert
    // {
    //   id: '1qv31h15yy',
    //   message: 'Bill is starving.',
    //   tone: 'neutral' // Options are 'positive', 'neutral', and 'negative'
    // }
  }
  getAlerts() {
    return this.alerts;
  }
  addAlert(message, tone) {
    let id    = 'alert-ts-' + Math.random()*100 + '-' + Date.now(),
        alert = {
      id: id,
      message: message,
      tone: tone
    }
    // By clearing alerts each time we add one, we are effectively disabling multiple simultaneous alerts
    this.clearAlerts();
    this.alerts.push(alert);
    this.emit("change");
  }
  removeAlert(id) {
    // If an alert exists, removes it
    let alerts = this.alerts;
    for (var i = 0; i < alerts.length; i++) {
      if (alerts[i].id === id) {
        alerts.splice(i,1);
      }
    }
    this.alerts = alerts;
    this.emit("change");
  }
  clearAlerts() {
    this.alerts = [];
    this.emit("change");
  }
  handleActions(action) {
    console.log("AlertStore received an action:", action);
    switch(action.type) {
      case "GET_ALERTS": {
        this.getAlerts();
        break;
      }
      case "ADD_ALERT": {
        this.addAlert(action.message, action.tone);
        break;
      }
      case "REMOVE_ALERT": {
        this.removeAlert(action.id);
        break;
      }
      default: {
        break;
      }
    }
  }
}

const alertStore = new AlertStore;
dispatcher.register(alertStore.handleActions.bind(alertStore));

export default alertStore;
