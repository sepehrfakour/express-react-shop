// Route helper methods
const RouteHelper = require('./_route_helper.js');

exports.init = function (app) {

  // API paths
  const api_base_url = '/api/v1/',
        api_fs_path  = '/../..' + api_base_url;

  // Items Controller
  const itemsController  = require(__dirname + api_fs_path + 'controllers/ItemsController.js'),
        ordersController = require(__dirname + api_fs_path + 'controllers/OrdersController.js'),
        stripeController = require(__dirname + api_fs_path + 'controllers/StripeController.js'),
        s3Controller     = require(__dirname + api_fs_path + 'controllers/S3Controller.js');

  /*
  * Protected API Endpoints
  * -----------------------
  */

  // Insert item
  app.route(api_base_url + 'item/create')
    .all(RouteHelper.authenticateJSON)
    .post(itemsController.addItem)
  // Update item
  app.route(api_base_url + 'item/update')
    .all(RouteHelper.authenticateJSON)
    .post(itemsController.updateItem)
  // Delete item
  // app.route(api_base_url + 'item/delete')
    // .all(RouteHelper.authenticateJSON)
    // .post(itemsController.deleteItem)

  // Sign S3
  app.route(api_base_url + 'sign-s3')
    .all(RouteHelper.authenticate)
    .get(s3Controller.signS3)

  // Fetch all orders, or by email
  app.route(api_base_url + 'orders')
    .all(RouteHelper.authenticateJSON)
    .get(ordersController.getOrders)
  // Fetch order by id
  app.route(api_base_url + 'order')
    .all(RouteHelper.authenticateJSON)
    .get(ordersController.getOrder)

  /*
  * Public API Endpoints
  * --------------------
  */

  // Fetch all items, or by category
  app.route(api_base_url + 'items')
    .get(itemsController.getItems)
  // Fetch item by id
  app.route(api_base_url + 'item')
    .get(itemsController.getItem)

  // Create charge and insert order
  app.route(api_base_url + 'charge')
    .post(stripeController.preCharge)

  /*
  * Protected Web App Endpoints
  * ---------------------------
  */

  // Admin dashboard
  app.route('/admin')
    .all(RouteHelper.authenticate)

  /*
  * Public Web App Endpoints
  * ------------------------
  */

  // Log in
  app.route('/login')
    .post(RouteHelper.login)
  // Log out
  app.route('/logout')
    .get(RouteHelper.logout)

  // Root route
  app.route('*')
    .all()
    .get(RouteHelper.renderIndex)
    .post(RouteHelper.renderIndex);

}
