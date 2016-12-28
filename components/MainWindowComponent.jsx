const React = require('react');

// const AnotherComponent = require('./AnotherComponent.jsx').default;
// In render method use the following JSX:
// <AnotherComponent someprop={this.props.someprop} />

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
    var page = this.props.page;
    return(
      <div id="main-window">
        <h1>Patina Hello World</h1>
        <h2>Page: {page} </h2>
      </div>
    );
  }
})

export default MainWindow;
