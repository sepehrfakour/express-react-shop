const OrdersModel = require(__dirname + '/../models/OrdersModel.js');

class OrdersController {
  constructor() {
    // super();
  }
  getOrders(req,res) {
    if (req.param('email')) {
      // Fetch orders by category
      OrdersModel.getOrdersByEmail(req.param('email'), function (results) {
        res.status(200).json(results);
      });
    }
    else {
      // Fetch all orders
      OrdersModel.getOrders(function (results) {
        res.status(200).json(results);
      });
    }
  }
  getOrder(req,res) {
    if (req.param('id')) {
      // Fetch an order by ID
      OrdersModel.getOrder(req.param('id'), function (result) {
        res.status(200).json(result);
      });
    }
  }
  addOrder(req,res) {
    if (req.body) {
      let data = {
        status: req.body.status,
        customer_first_name: req.body.customer_first_name,
        customer_last_name: req.body.customer_last_name,
        customer_email: req.body.customer_email,
        customer_phone: req.body.customer_phone,
        currency: req.body.currency,
        subtotal_amount: req.body.subtotal_amount,
        total_amount: req.body.total_amount,
        tax_amount: req.body.tax_amount,
        shipping_method: req.body.shipping_method,
        shipping_amount: req.body.shipping_amount,
        shipping_street_1: req.body.shipping_street_1,
        shipping_street_2: req.body.shipping_street_2,
        shipping_city: req.body.shipping_city,
        shipping_state: req.body.shipping_state,
        shipping_country: req.body.shipping_country,
        shipping_postal_code: req.body.shipping_postal_code,
        shipping_special_instructions: req.body.shipping_special_instructions
      };
      OrdersModel.addOrder(data, function (result) {
        res.status(200).json(result);
      });
    }
  }
  updateOrder(req,res) {
    if (req.body) {
      let data = {
        id: req.body.id,
        status: req.body.status,
        customer_email: req.body.customer_email,
        customer_phone: req.body.customer_phone,
        currency: req.body.currency,
        subtotal_amount: req.body.subtotal_amount,
        total_amount: req.body.total_amount,
        tax_amount: req.body.tax_amount,
        shipping_method: req.body.shipping_method,
        shipping_amount: req.body.shipping_amount,
        shipping_street_1: req.body.shipping_street_1,
        shipping_street_2: req.body.shipping_street_2,
        shipping_city: req.body.shipping_city,
        shipping_state: req.body.shipping_state,
        shipping_country: req.body.shipping_country,
        shipping_postal_code: req.body.shipping_postal_code,
        shipping_special_instructions: req.body.shipping_special_instructions
      };
      OrdersModel.updateOrder(data, function (result) {
        res.status(200).json(result);
      });
    }
  }
  deleteOrder(req,res) {
    if (req.body) {
      let id = req.body.id;
      OrdersModel.deleteOrder(id, function (result) {
        res.status(200).json(result);
      });
    }
  }
}

const ordersController = new OrdersController;

module.exports = ordersController;
