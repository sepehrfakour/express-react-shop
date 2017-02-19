import dispatcher from '../dispatcher.js';

export function setOverlay(data) {
  dispatcher.dispatch({
    type: "SET_OVERLAY",
    data: data
  })
}
