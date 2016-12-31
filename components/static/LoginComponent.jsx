const React = require('react');

var NotFound = React.createClass({
  getInitialState: function () {
      return {};
  },
  componentDidMount: function () {},
  render: function () {
    return(
      <div id="login-form">
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
    );
  }
})

export default NotFound;
