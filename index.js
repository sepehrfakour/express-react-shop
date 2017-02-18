
/***************************/
/******** 1. Config ********/
/***************************/

// Set environment
const env = process.env.NODE_ENV || 'development'

// Use New Relic (must be defined before any other require calls)
if (env === 'production') { require('newrelic'); };

// Define global variables
global.rootRequire = function (name) {
  return require(__dirname + '/' + name);
}

// Initialize
const express        = require('express'),
      app            = express(),
      sassMiddleware = require('node-sass-middleware'),
      helmet         = require('helmet'),
      session        = require('express-session'),
      bodyParser     = require('body-parser'),
      cookieParser   = require('cookie-parser'),
      csrf           = require('csurf'),
      rateLimit      = require('express-rate-limit');

// Configure
app.set('port', (process.env.PORT || 5000) );
app.set('views', (__dirname + '/views'));
app.set('view engine', 'ejs');
require('express-helpers')(app);
app.use(
  sassMiddleware({
    src: __dirname + '/client/sass',
    dest: __dirname + '/public/css',
    prefix:  '/css',
    debug: true,
  })
);

// Session config
const ONEHOURINMILLISECONDS = 60 * 60 * 1000;
const sess = {
  secret: process.env.SESSION_SECRET,
  name: process.env.SESSION_NAME,
  resave: false, // Re-examine this option if/when altering user session setup
  saveUninitialized: false, // Re-examine this option if/when altering user session setup
  cookie: {
    httpOnly: true,
    maxAge: ONEHOURINMILLISECONDS
  }
}

// Configuration specific to production env
if (env == 'production') {
  // Force SSL on heroku
  const forceSSL = require('express-force-ssl');
  app.set('forceSSLOptions', {trustXFPHeader: true});
  app.use(forceSSL);
  // Use secure cookies
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
// Parse cookies
app.use(cookieParser());
// Use CSRF protection
app.use(csrf({ cookie: true }))
// Parse request params like in Express 3.0
app.use( require('request-param')() );

/****************************/
/******** 2. Routing ********/
/****************************/

const initializeRoutes = require('./lib/routes/routes.js').init;
initializeRoutes(app);

// Use Rollbar (must define error-handling middleware last, after other app.use() and routes calls)
if (env === 'production') {
  const rollbar         = require('rollbar'),
        rollbar_options = { exitOnUncaughtException: true };
  app.use(rollbar.errorHandler(process.env.ROLLBAR_ACCESS_TOKEN, {
    environment: env
  }));
  rollbar.handleUncaughtExceptionsAndRejections(process.env.ROLLBAR_ACCESS_TOKEN, rollbar_options);
}

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
