const username = process.env.ADMIN_USERNAME,
      password = process.env.ADMIN_PASSWORD;

class RouteHelper {
  constructor () {}

  renderIndex (req, res) {
    res.render('index', {
      loggedIn: (req.session.authenticated || false),
      s_pk: process.env.STRIPE_PUBLISHABLE_KEY,
      mixpanel_token: process.env.MIXPANEL_TOKEN
    });
  }

  renderLogin (req, res) {
    res.render('login', {
      loggedIn: (req.session.authenticated || false)
    });
  }

  authenticate (req, res, next) {
    if (req.session && req.session.authenticated) {
      next();
    } else {
      res.redirect("/login");
    }
  }

  authenticateJSON (req, res, next) {
    if (req.session && req.session.authenticated) {
      next();
    } else {
      res.status(403).send('Unauthorized');
    }
  }

  login (req, res, next) {
    if (req.body.username && req.body.username === username && req.body.password && req.body.password === password) {
      req.session.authenticated = true;
      res.redirect('/admin');
    } else {
      res.status(403).send('Login Error: Invalid Username/Password');
    }
  }

  logout (req, res, next) {
    delete req.session.authenticated;
    res.redirect('/');
  }
}

const routeHelper = new RouteHelper

module.exports = routeHelper
