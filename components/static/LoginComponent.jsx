const React = require('react');

var NotFound = React.createClass({
  getInitialState: function () {
      return {};
  },
  componentDidMount: function () {},
  render: function () {
    return(
      <div id="login-form">
        <form method="post">
          <h1>Login</h1>
          <p>
            <input type="text" name="username" placeholder="Username" />
          </p>
          <p>
            <input type="password" name="password" placeholder="Password" />
          </p>
          <p>
            <input type="submit" name="submit" />
          </p>
        </form>
      </div>
    );
  }
})

export default NotFound;
