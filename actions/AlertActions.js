import dispatcher from '../dispatcher.js';

export function getAlerts() {
  dispatcher.dispatch({
    type: "GET_ALERTS"
  })
}

export function addAlert(message, tone) {
  dispatcher.dispatch({
    type: "ADD_ALERT",
    message: message,
    tone: tone
  })
}

export function removeAlert(id) {
  dispatcher.dispatch({
    type: "REMOVE_ALERT",
    id: id
  })
}
