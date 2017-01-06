
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
      Home          = require('./components/HomeComponent.jsx').default,
      NotFound      = require('./components/static/NotFoundComponent.jsx').default,
      Login         = require('./components/static/LoginComponent.jsx').default,
      About         = require('./components/static/AboutComponent.jsx').default,
      AllItemsPage  = require('./components/items/AllItemsPageComponent.jsx').default,
      CategoryPage  = require('./components/items/CategoryPageComponent.jsx').default,
      ItemPage      = require('./components/items/ItemPageComponent.jsx').default,
      CartPage      = require('./components/cart/CartPageComponent.jsx').default,
      Admin         = require('./components/admin/DashboardComponent.jsx').default;

// Local Storage Handler
// const store = require('store');

/************************************/
/*********** 2. Configure ***********/
/************************************/

// Handle localStorage user data
// window.sessionDataObject = store.get('exampleStoredObject');
// if (sessionDataObject)
//     // Apply retrieved localStorage user data
//     Data.user = sessionDataObject;
// else {
//     // Set localStorage user data to defaults
//     store.set('exampleStoredObject', Data.user)
//     window.sessionDataObject = Data.user;
// }

// Set loggedIn status (retrieve from index view)
let Data = {
  loggedIn: (window.loggedIn === undefined) ? false : window.loggedIn
}

/************************************/
/********** 3. Render View **********/
/************************************/

// Render with props
ReactDOM.render(
  <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
    <Route path="/" loggedIn={Data.loggedIn} component={MainWindow}>
      <IndexRoute component={Home}/>
      <Route path="all" component={AllItemsPage}/>
      <Route path="shop/:category" component={CategoryPage}/>
      <Route path="item/:id" component={ItemPage}/>
      <Route path="cart" component={CartPage}/>
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
