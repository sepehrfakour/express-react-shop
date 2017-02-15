import dispatcher from '../dispatcher.js';

export function setOverlay(data, tone) {
  dispatcher.dispatch({
    type: "SET_OVERLAY",
    data: data
  })
}
