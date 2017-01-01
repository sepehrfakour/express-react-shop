const React = require('react');

import {Link} from 'react-router';

var Header = React.createClass({
  render: function () {
    let date          = new Date,
        year          = date.getFullYear(),
        copyrightYear = '\u00A9 ' + year
    return(
      <div id="footer" data-copyright={copyrightYear}>
        <ul>
          <li><Link to="/">Home</Link></li>
        </ul>
      </div>
    );
  }
})

export default Header;
