const React = require('react');

var NotFound = React.createClass({
  getInitialState: function () {
      return {};
  },
  componentDidMount: function () {},
  render: function () {
    return(
      <div id="login-page" className="container-fluid content">
        <div className="row">
          <div id="login-form" className="offset-xs-1 col-xs-10 offset-sm-2 col-sm-8 offset-md-4 col-md-4 offset-xl-5 col-xl-2">
            <form method="POST" action="/login">
              <h1>Login</h1>
              <p>
                <input type="text" name="username" placeholder="Username" autoFocus="autofocus" tabIndex="1" />
              </p>
              <p>
                <input type="password" name="password" placeholder="Password" tabIndex="2" />
              </p>
              <p>
                <input type="submit" name="submit" tabIndex="3" />
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
})

export default NotFound;
