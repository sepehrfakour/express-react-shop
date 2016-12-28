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
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="all">Items</Link></li>
          <li><Link to="about">About</Link></li>
          <li>{this.getLoginLink(this.props.loggedIn)}</li>
        </ul>
      </div>
    );
  }
})

export default Header;
