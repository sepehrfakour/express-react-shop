const React = require('react');

const About = React.createClass({
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

export default About;
