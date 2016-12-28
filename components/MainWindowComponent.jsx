const React = require('react');

const Header = require('./nav/HeaderComponent.jsx').default;

var MainWindow = React.createClass({
  getInitialState: function () {
      return {};
  },
  componentDidMount: function () {
    // TODO: abstact fetch to actions + stores
    fetch('/api/v1/items')
      .then( function (res) {
        return res.json();
      })
      .then( function(json) {
        console.log(json);
      })
  },
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
