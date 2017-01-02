const React = require('react');

var Home = React.createClass({
  getInitialState: function () {
      return {};
  },
  componentDidMount: function () {},
  render: function () {
    return(
      <div id="landing-page">
        <div className="banner landing-page-banner">
          <h1>Welcome</h1>
        </div>
      </div>
    );
  }
})

export default Home;
