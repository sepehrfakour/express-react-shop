
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

// Configuration specific to production env
if (env == 'production') {
  // Force SSL on heroku by checking the 'x-forwarded-proto' header
  const forceSSL = require('express-force-ssl');
  app.set('forceSSLOptions', {trustXFPHeader: true});
  app.use(forceSSL);
}

app.use(express.static(__dirname + '/public'));

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
    items: null,
    userParam: req.param('user')
  });
}










/****************************/
/******** 2. Routing ********/
/****************************/

// Root route
app.route('/')
  .all()
  .get(renderIndex)
  .post(renderIndex);

// Public API Endpoints
var base_url = '/api/v1/';
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
