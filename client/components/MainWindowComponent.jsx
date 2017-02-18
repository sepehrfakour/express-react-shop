const React = require('react');

const Header       = require('./nav/HeaderComponent.jsx').default,
      Footer       = require('./nav/FooterComponent.jsx').default,
      AlertDisplay = require('./alert/AlertsDisplayComponent.jsx').default,
      Overlay      = require('./overlay/OverlayComponent.jsx').default;

const MainWindow = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentDidMount: function () {},
  render: function () {
    // Fire event on URL update
    mixpanel.track(this.props.location.pathname);
    return(
      <div id="main-window">
        <Header loggedIn={this.props.route.loggedIn} />
        <AlertDisplay />
        <Overlay />
        {this.props.children}
        <Footer />
      </div>
    );
  }
})

export default MainWindow;
