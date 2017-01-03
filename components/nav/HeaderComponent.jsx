const React = require('react');

import {Link} from 'react-router';

var Header = React.createClass({
  getLoginLink: function (loggedIn) {
    if (loggedIn) {
      return (<a href="/logout">Logout</a>);
    } else {
      return (<a href="/login">Login</a>);
    }
  },
  render: function () {
    return(
      <div id="header">
        <div id="header-logo">
          <Link to="/">Shopname</Link>
        </div>
        <ul>
          <li className="dropdown-container">
            <Link to="/all">Shop</Link>
            <div className="items-dropdown-menu">
              <ul>
                <li><Link to="/shop/hats">Hats</Link></li>
                <li><Link to="/shop/shirts">Shirts</Link></li>
                <li><Link to="/shop/pants">Pants</Link></li>
                <li><Link to="/shop/dresses">Dresses</Link></li>
                <li><Link to="/shop/other">Other</Link></li>
              </ul>
            </div>
          </li>
          <li><Link to="/about">About</Link></li>
          <li id="login-link">{this.getLoginLink(this.props.loggedIn)}</li>
          <li id="shopping-cart-button">
            <Link to="/cart"></Link>
          </li>
        </ul>
      </div>
    );
  }
})

export default Header;
