const React = require('react');

import {Link} from 'react-router';

var Header = React.createClass({
  render: function () {
    return(
      <div id="footer">
        <ul>
          <li><Link to="/">Home</Link></li>
        </ul>
      </div>
    );
  }
})

export default Header;
