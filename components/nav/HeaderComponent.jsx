const React = require('react');

import {Link} from 'react-router';

var Header = React.createClass({
  getInitialState: function () {
    return {
      open: false
    }
  },
  hasClass: function (element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  },
  getLoginLink: function (loggedIn) {
    if (loggedIn) {
      return (<a href="/logout">Logout</a>);
    } else {
      return (<a href="/login">Login</a>);
    }
  },
  render: function () {
    let dropdownClickable = "dropdown-clickable",
        openClassName = dropdownClickable;
    openClassName += (this.state.open) ? ' open' : ' closed';
    return(
      <div id="header">
        <div id="header-logo">
          <Link to="/">Shopname</Link>
        </div>
        <ul>
          <li id="dropdown-container" className={openClassName}>
            <a id="dropdown-toggle" className={dropdownClickable} href="#" onClick={this._dropdownToggleHandler}>Shop</a>
            <div id="items-dropdown-menu" className={openClassName}>
              <ul className={dropdownClickable}>
                <li className={dropdownClickable}><Link to="/all">All</Link></li>
                <li className={dropdownClickable}><Link to="/shop/hats">Hats</Link></li>
                <li className={dropdownClickable}><Link to="/shop/shirts">Shirts</Link></li>
                <li className={dropdownClickable}><Link to="/shop/pants">Pants</Link></li>
                <li className={dropdownClickable}><Link to="/shop/dresses">Dresses</Link></li>
                <li className={dropdownClickable}><Link to="/shop/other">Other</Link></li>
              </ul>
            </div>
          </li>
          <li id="about-link"><Link to="/about">About</Link></li>
          <li id="login-link">{this.getLoginLink(this.props.loggedIn)}</li>
          <li id="shopping-cart-button">
            <Link to="/cart"></Link>
          </li>
        </ul>
      </div>
    );
  },
  _dropdownToggleHandler: function () {
    if (this.state.open) {
      // Menu is open; close it, and remove bound event listener
      this.setState({ open: false });
      window.removeEventListener("click", this._onDOMClick);
    } else {
      // Menu is closed; open it, and remove bound event listener
      this.setState({ open: true });
      window.addEventListener("click", this._onDOMClick);
    }
  },
  _onDOMClick: function (event) {
    if (this.hasClass(event.target,'dropdown-clickable')) {
      // Do nothing
    } else {
      // Close mmenu, remove bound event listener
      this.setState({ open: false });
      window.removeEventListener("click", this._onDOMClick);
    }
  }
})

export default Header;
