const React = require('react');

import { Link } from 'react-router';

// const AnotherComponent = require('./AnotherComponent.jsx').default;
// In render method use the following JSX:
// <AnotherComponent someprop={this.props.someprop} />

var NotFound = React.createClass({
  getInitialState: function () {
      return {};
  },
  componentDidMount: function () {},
  render: function () {
    return(
      <div id="not-found" className="container-fluid content">
        <h1>404</h1>
        <h2>Oops, there's nothing here...</h2>
        <Link to="/">Go home</Link>
      </div>
    );
  }
})

export default NotFound;
