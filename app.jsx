
/************************************/
/******** 1. Require Modules ********/
/************************************/

// React
const React = require('react');
const ReactDOM = require('react-dom');

// Router
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

// Components
const MainWindow    = require('./components/MainWindowComponent.jsx').default,
      NotFound      = require('./components/NotFoundComponent.jsx').default,
      Home          = require('./components/HomeComponent.jsx').default,
      About         = require('./components/static/AboutComponent.jsx').default,
      Login         = require('./components/static/LoginComponent.jsx').default,
      AllItems      = require('./components/items/AllItemsComponent.jsx').default,
      CategoryItems = require('./components/items/CategoryItemsComponent.jsx').default,
      Item          = require('./components/items/ItemComponent.jsx').default,
      Admin         = require('./components/admin/DashboardComponent.jsx').default;

// LocalStorage Data
// const LocalStorageHandler = require('./public/js/localStorageHandler.js');

/************************************/
/*********** 2. Configure ***********/
/************************************/

// Handle localStorage user data
// window.sessionDataObject = localStorageHandler.get('exampleStoredObject');
// if (sessionDataObject)
//     // Apply retrieved localStorage user data
//     Data.user = sessionDataObject;
// else {
//     // Set localStorage user data to defaults
//     localStorageHandler.set('exampleStoredObject', Data.user)
//     window.sessionDataObject = Data.user;
// }

// Set loggedIn status (retrieve from index view)
let Data = {
  loggedIn: (loggedIn === undefined) ? false : loggedIn
}

/************************************/
/********** 3. Render View **********/
/************************************/

// Render with props
ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" loggedIn={Data.loggedIn} component={MainWindow}>
      <IndexRoute component={Home}/>
      <Route path="all" component={AllItems}/>
      <Route path="category" component={CategoryItems}/>
      <Route path="item/:id" component={Item}/>
      <Route path="about" component={About}/>
      <Route path="login" component={Login}/>
      <Route path="admin" component={Admin}/>
    </Route>
    <Route path="*" component={NotFound} />
  </Router>,
  document.getElementById('react-container')
);

/************************************/
/********** 4. Post-render **********/
/************************************/

// Require Mixpanel
// const Mixpanel = require('./lib/helpers/mixpanel.js');
// mixpanel.track('App Instance Loaded');
