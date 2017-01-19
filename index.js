
/***************************/
/******** 1. Config ********/
/***************************/

global.rootRequire = function (name) {
  return require(__dirname + '/' + name);
}

const env = process.env.NODE_ENV || 'development'
  , express         = require('express')
  , sassMiddleware  = require('node-sass-middleware')
  , app             = express()
  , helmet          = require('helmet')
  , session         = require('express-session')
  , bodyParser      = require('body-parser')
  , rateLimit       = require('express-rate-limit');

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
const expiry = new Date( Date.now() + 60 * 60 * 1000 ),
      oneHourOfMilliseconds = 60 * 60 * 1000;
const sess = {
  secret: 'meow8waka_Zerg',
  name: 'arbitrarySessionName07856809875671798376',
  // TODO update resave and saveUninitialized
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: oneHourOfMilliseconds
    // expires: expiry
  }
}

// TODO: extract this hard-coded admin config
const username = 'a',
      password = 'a';

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

// Rate limiting
const apiLimiter = new rateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 100,
  delayMs: 0 // disabled
});
const loginAttemptLimiter = new rateLimit({
  windowMs: 60*60*1000, // 1 hour window
  delayAfter: 20, // begin slowing down responses after the 20th request
  delayMs: 3*1000, // slow down subsequent responses by 3 seconds per request
  max: 60, // start blocking after 60 requests
  message: "Too many login attempts from this IP, please try again after an hour"
});
// only apply to requests that begin with /api/
app.use('/api/', apiLimiter);
app.use('/login', loginAttemptLimiter);


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










// Route helper methods
const renderIndex = function (req, res) {
  res.render('index', {
    loggedIn: (req.session.authenticated || false)
  });
}

const renderLogin = function (req, res) {
  res.render('login', {
    loggedIn: (req.session.authenticated || false)
  });
}

const authenticate = function (req, res, next) {
  if (req.session && req.session.authenticated) {
    next();
  } else {
    res.redirect("/login");
  }
}

const login = function (req, res, next) {
  if (req.body.username && req.body.username === username && req.body.password && req.body.password === password) {
    req.session.authenticated = true;
    res.redirect('/admin');
  } else {
    res.status(403).send('Error: Incorrect Username and/or Password');
    // res.status(403).redirect('/login');
  }
}

const logout = function (req, res, next) {
  delete req.session.authenticated;
  res.redirect('/');
}








/****************************/
/******** 2. Routing ********/
/****************************/

// API
const api_base_url = '/api/v1/';
// Items Controller
const itemsController = require(__dirname + api_base_url + 'controllers/ItemsController.js'),
      ordersController = require(__dirname + api_base_url + 'controllers/OrdersController.js'),
      s3Controller = require(__dirname + api_base_url + 'controllers/S3Controller.js');
// - Public API Endpoints
// Fetch all items, or by category
app.route(api_base_url + 'items')
  .get(itemsController.getItems)
// Fetch item by id
app.route(api_base_url + 'item')
  .get(itemsController.getItem)
// - Protected API Endpoints
// Insert item
app.route(api_base_url + 'item/create')
  .all(authenticate)
  .post(itemsController.addItem)
// Update item
app.route(api_base_url + 'item/update')
  .all(authenticate)
  .post(itemsController.updateItem)
// Delete item
app.route(api_base_url + 'item/delete')
  .all(authenticate)
  .post(itemsController.deleteItem)
// Sign S3
app.route(api_base_url + 'sign-s3')
  .all(authenticate)
  .get(s3Controller.signS3)
// Fetch all orders, or by email
app.route(api_base_url + 'orders')
  .all(authenticate)
  .get(ordersController.getOrders)
// Fetch order by id
app.route(api_base_url + 'order')
  .all(authenticate)
  .get(ordersController.getOrder)
// Insert order
app.route(api_base_url + 'order/create')
  .post(ordersController.addOrder)

// Web App
// Protected Web App Endpoints
// Admin dashboard
app.route('/admin')
  .all(authenticate)
// Public Web App Endpoints
// Log in
app.route('/login')
  .post(login)
// Log out
app.route('/logout')
  .get(logout)
// Root route
app.route('*')
  .all()
  .get(renderIndex)
  .post(renderIndex);










/***************************/
/******** 3. Server ********/
/***************************/

// Set up the express application server
const server = app.listen( (process.env.PORT || 5000), function () {
  const server_url = server.address()
    , host = server_url.address
    , port = server_url.port || 5000;
  console.log('React App listening at http://%s:%s', host, port);
});
