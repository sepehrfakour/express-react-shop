const React = require('react');

var NotFound = React.createClass({
  getInitialState: function () {
      return {};
  },
  componentDidMount: function () {},
  render: function () {
    return(
      <div id="about-page" className="container-fluid content">
        <div className="banner">
          <h1>About</h1>
        </div>
      </div>
    );
  }
})

export default NotFound;
