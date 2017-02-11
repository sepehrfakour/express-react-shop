const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY),
      adminEmail = process.env.ADMIN_EMAIL;

const OrdersModel     = require('../models/OrdersModel.js'),
      ItemsModel      = require('../models/ItemsModel.js'),
      OrderItemsModel = require('../models/OrderItemsModel.js'),
      MailController  = require('./MailController.js');

class StripeController {

  constructor() {
    this.preCharge         = this.preCharge.bind(this);
    this.charge            = this.charge.bind(this);
    this.postCharge        = this.postCharge.bind(this);
    this.insertOrderItems  = this.insertOrderItems.bind(this);
    this.sendNotifications = this.sendNotifications.bind(this);
  }

  preCharge(req,res) {
    console.log("----------\nCharge request receieved");
    if (!req.body || !req.body.stripeToken || !req.body.cart || !req.body.shipping) {
      console.log('Bad order/charge request');
      return res.status(400).end();
    }
    // Add some default options to request.body object
    req.body.payment = {
      status: 'uncharged',
      currency: 'usd'
    };
    req.body.items = [];
    req.body.shipping.shipping_method = 'standard';
    req.body.shipping.shipping_amount = 0.00;
    req.body.shipping.shipping_country = 'usa';
    req.body.shipping.tax_rate = 0.08;
    req.body.shipping.shipping_special_instructions = '';
    // Retrieve cart items by ID
    let that    = this,
        cart    = req.body.cart,
        itemIds = cart.map(function(item) { return item.id });
    ItemsModel.getItemsForOrder(itemIds, function (items) {
      that.charge(req,res,items);
    });
  }

  charge(req,res,items) {
    let temp = [],
        that = this;
    // Append order_quantity to each queried item
    if (!Array.isArray(items)) { // Only one item was retrieved
      items.order_quantity = parseInt(req.body.cart[0].quantity,10); // Add order_quantity property
      temp.push(items);
    } else { // Multiple items were retrieved
      // Nested loop OK here for code clarity. Items array max possible size limited to # of 'active' items
      temp = items.map( function (item) {
        item.order_quantity = 0;
        req.body.cart.map( function (cart_item) {
          if (item.id === cart_item.id) {
            item.order_quantity = parseInt(cart_item.quantity,10); // Add order_quantity property
          }
        });
        return item;
      });
    }
    // Save temp array for later use
    req.body.items = temp;
    // CALCULATE AMOUNTS
    let subtotal=0, tax=0, total=0, amount=0; // Initialize amount variables
    temp.map( function (item) { // Calculate subtotal
      subtotal += (item.price * item.order_quantity);
    });
    tax    = subtotal * req.body.shipping.tax_rate; // Calculate tax
    total  = (subtotal + tax).toFixed(2); // Calculate total
    amount = parseInt((total * 100),10); // Calculate INTEGER amount in pennies (binary addition can yield floats)
    // Save payment amounts
    req.body.payment.subtotal_amount = subtotal.toFixed(2);
    req.body.payment.tax_amount      = tax.toFixed(2);
    req.body.payment.total_amount    = total;
    console.log("Payment Total_Amount:",req.body.payment.total_amount);

    // CREATE STRIPE CHARGE
    let charge = stripe.charges.create({
      amount: amount,
      currency: req.body.payment.currency,
      description: "Completed charge",
      source: req.body.stripeToken,
    }, function (err, charge) {
      if (err) { // Handle error
        console.log("Stripe charge error:",err);
        res.status(402).write(err.message);
        return res.end();
      }
      // Handle success
      console.log("Stripe charge successful - CHARGE ID:",charge.id);
      req.body.payment.status = 'charged';
      that.postCharge(req,res,charge);
    });
  }

  postCharge(req,res,charge) {
    // Create new order
    let that = this,
        data = {
      status: req.body.payment.status,
      customer_first_name: req.body.shipping.customer_first_name,
      customer_last_name: req.body.shipping.customer_last_name,
      customer_email: req.body.shipping.customer_email,
      customer_phone: req.body.shipping.customer_phone,
      currency: req.body.payment.currency,
      subtotal_amount: req.body.payment.subtotal_amount,
      total_amount: req.body.payment.total_amount,
      tax_amount: req.body.payment.tax_amount,
      shipping_method: req.body.shipping.shipping_method,
      shipping_amount: req.body.shipping.shipping_amount,
      shipping_street_1: req.body.shipping.shipping_street_1,
      shipping_street_2: req.body.shipping.shipping_street_2,
      shipping_city: req.body.shipping.shipping_city,
      shipping_state: req.body.shipping.shipping_state,
      shipping_country: req.body.shipping.shipping_country,
      shipping_postal_code: req.body.shipping.shipping_postal_code,
      shipping_special_instructions: req.body.shipping.shipping_special_instructions
    };
    // Insert new order
    OrdersModel.addOrder(data, function (order) {
      console.log("Order insert successful - ORDER ID:",order.id);
      // Update the stripe charge metadata with the new order ID
      stripe.charges.update(
        charge.id,
        { metadata: { "order_id": order.id } },
        function (err, charge) {
          if (err) { // Handle error
            console.log("Stripe update_charge error:",err);
            res.status(402).write(err.message);
            return res.end();
          }
          // Handle success
          console.log("Stripe update_charge successful");
          that.insertOrderItems(req,res,order);
        }
      );
    });
  }

  insertOrderItems(req,res,order) {
    // Insert item_ids into order_items table, associating them with the order_id
    let that = this,
        data = {
      order_id: order.id,
      cart: req.body.cart
    }
    console.log("insertOrderItems DATA:",data);
    OrderItemsModel.addOrderItems(data, function (result) {
      // Handle success
      console.log("Order_Items insert successful\n----------");
      res.status(200);
      res.end();
      that.sendNotifications(req,res,order);
    })
  }

  sendNotifications(req,res,order) {
    // Create customer notification email
    let that = this,
        from_string    = 'no-reply@example.com',
        to_string      = order.customer_email,
        subject_string = 'Your order has been placed!',
        item_string    = '';
    // Build item string
    req.body.items.map( function (item) {
      item_string += '(x' + item.order_quantity + ') ' + item.name + ' (size: ' + item.size + ', color: ' + item.color + ')' + '\n\n';
    })
    // Build content string, injecting item string
    let content_string = '\
          Dear ' + order.customer_first_name + ',\n\n\n\
          You have successfully placed an order for the following item(s):\n\n\
          ----------\n\n\
          ' + item_string + '\n\n\
          ----------\n\n\
          Total amount: $' + order.total_amount + '\n\n\
          Your order should arrive in 3-5 business days.\n\n\
          Thanks, and have a great day!\n';
    // Send customer notification email
    MailController.sendMail(from_string,to_string,subject_string,content_string);

    // Create admin notification email
    let admin_subject_string = 'New order placed',
        admin_content_string = '\
          Customer: ' + order.customer_first_name + ' ' + order.customer_last_name+ '\n\n\
          Customer email: ' + order.customer_email + '\n\n\
          Order ID: ' + order.id + '\n\n\
          ----------\n\n\
          Customer Address:' + '\n\n\
          ----------\n\n\
          ' + req.body.shipping.shipping_street_1 + '\n\n\
          ' + req.body.shipping.shipping_street_2 + '\n\n\
          ' + req.body.shipping.shipping_city + '\n\n\
          ' + req.body.shipping.shipping_state + '\n\n\
          ' + req.body.shipping.shipping_postal_code + '\n\n\
          ' + req.body.shipping.shipping_country + '\n\n\
          ----------\n\n\
          Item(s):\n\n\
          ----------\n\n\
          ' + item_string + '\
          ----------\n\n\
          Subtotal amount: $' + order.subtotal_amount + '\n\n\
          Tax amount: $' + order.tax_amount + '\n\n\
          Total amount: $' + order.total_amount + '\n\n';
    // Send admin notification email
    MailController.sendMail(from_string,adminEmail,admin_subject_string,admin_content_string);
    console.log("Email notifications sent to customer and admin\n----------");
  }

}

const stripeController = new StripeController;

module.exports = stripeController;
