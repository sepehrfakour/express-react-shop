const React = require('react');

const Home = React.createClass({
  getInitialState: function () {
      return {};
  },
  componentDidMount: function () {},
  render: function () {
    return(
      <div id="landing-page" className="container-fluid content">
        <div className="banner landing-page-banner">
          <h1>Welcome</h1>
        </div>
      </div>
    );
  }
})

export default Home;
