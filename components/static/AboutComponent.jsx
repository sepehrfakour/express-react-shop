const React = require('react');

var NotFound = React.createClass({
  getInitialState: function () {
      return {};
  },
  componentDidMount: function () {},
  render: function () {
    return(
      <div id="about-page">
        <div className="banner">
          <h1>About</h1>
        </div>
      </div>
    );
  }
})

export default NotFound;
