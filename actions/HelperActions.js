import dispatcher from '../dispatcher.js';

export function setRealId(tempid,realid) {
  dispatcher.dispatch({
    type: "SET_REAL_ID",
    tempid,
    realid
  })
}
