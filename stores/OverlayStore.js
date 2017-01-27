import { EventEmitter } from "events";

import dispatcher from "../dispatcher.js";

class OverlayStore extends EventEmitter {
  constructor() {
    super();
    this.overlay = false;
  }
  getOverlay() {
    return this.overlay;
  }
  setOverlay(data) {
    this.overlay = data;
    this.emit("change");
  }
  handleActions(action) {
    console.log("OverlayStore received an action:", action);
    switch(action.type) {
      case "SET_OVERLAY": {
        this.setOverlay(action.data);
        break;
      }
      default: {
        break;
      }
    }
  }
}

const overlayStore = new OverlayStore;
dispatcher.register(overlayStore.handleActions.bind(overlayStore));

export default overlayStore;
