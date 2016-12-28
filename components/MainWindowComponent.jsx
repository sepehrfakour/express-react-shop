const React = require('react');

const Header = require('./nav/HeaderComponent.jsx').default;

var MainWindow = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentDidMount: function () {},
  render: function () {
    return(
      <div id="main-window">
        <Header loggedIn={this.props.route.loggedIn} />
        {this.props.children}
      </div>
    );
  }
})

export default MainWindow;
