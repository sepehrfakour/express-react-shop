
/***************************/
/******** 1. Config ********/
/***************************/

global.rootRequire = function (name) {
  return require(__dirname + '/' + name);
}

var env = process.env.NODE_ENV || 'development'
  , express         = require('express')
  , sassMiddleware  = require('node-sass-middleware')
  , app             = express()
  , helmet          = require('helmet')
  , session         = require('express-session')
  , bodyParser      = require('body-parser');

app.set('port', (process.env.PORT || 5000) );
app.set('view engine', 'ejs');

require('express-helpers')(app);

app.use(
  sassMiddleware({
    src: __dirname + '/sass',
    dest: __dirname + '/public/css',
    prefix:  '/css',
    debug: true,
  })
);

// Session config
const expiry = new Date( Date.now() + 60 * 60 * 1000 );
const sess = {
  secret: 'meow8waka_Zerg',
  name: 'arbitrarySessionName07856809875671798376',
  // TODO update resave and saveUninitialized
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: expiry
  }
}

// Configuration specific to production env
if (env == 'production') {
  // Force SSL on heroku by checking the 'x-forwarded-proto' header
  const forceSSL = require('express-force-ssl');
  app.set('forceSSLOptions', {trustXFPHeader: true});
  app.use(forceSSL);
  // Use secure cookies in production
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

// Static assets path
app.use(express.static(__dirname + '/public'));
// Use helmet
app.use(helmet());
// Use sessions
app.use(session(sess));

// Support JSON-encoded bodies
app.use(bodyParser.json({
  limit: '5mb'
}));
// Support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '5mb'
}));

// Parse request params like in Express 3.0
app.use( require('request-param')() );

var renderIndex = function (req, res) {
  res.render('index', {
    page: 'index',
    userParam: req.param('user')
  });
}

var renderLogin = function (req, res) {
  res.render('login', {
    page: 'login'
  });
}

var authenticate = function (req, res, next) {
  if (req.session && req.session.authenticated) {
    next();
  } else {
    res.redirect("/login");
  }
}

var login = function (req, res, next) {
  if (req.body.username && req.body.username === 'user' && req.body.password && req.body.password === 'pass') {
    req.session.authenticated = true;
    res.redirect('/admin');
  } else {
    res.status(403).send('Error: Incorrect Username and/or Password');
    // res.status(403).redirect('/login');
  }
}

var logout = function (req, res, next) {
  delete req.session.authenticated;
  res.redirect('/');
}








/****************************/
/******** 2. Routing ********/
/****************************/

// Root route
app.route('/')
  .all()
  .get(renderIndex)
  .post(renderIndex);
// Log in
app.route('/login')
  .all()
  .get(renderLogin)
  .post(login)
// Log out
app.route('/logout')
  .all()
  .get(logout)

// Public API Endpoints
const base_url = '/api/v1/';
// Items Controller
var itemsController = require(__dirname + base_url + 'controllers/itemsController.js');
// Fetch all items, or by category
app.route(base_url + 'items')
  .all()
  .get(itemsController.getItems)
  .post(itemsController.getItems)
// Fetch item by id
app.route(base_url + 'item')
  .all()
  .get(itemsController.getItem)
  .post(itemsController.getItem)

// Protected API Endpoints
// Admin dashboard
app.route('/admin')
  .all(authenticate)
  .get(itemsController.getItems)
  .post(itemsController.getItems)
// Insert item
// Update item
// Delete item










/***************************/
/******** 3. Server ********/
/***************************/

// Set up the express application server
var server = app.listen( (process.env.PORT || 5000), function () {
  var server_url = server.address()
    , host = server_url.address
    , port = server_url.port || 5000;
  console.log('React App listening at http://%s:%s', host, port);
});
