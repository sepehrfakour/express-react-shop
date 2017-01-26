const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const OrdersModel     = require('../models/OrdersModel.js'),
      ItemsModel      = require('../models/ItemsModel.js'),
      OrderItemsModel = require('../models/OrderItemsModel.js');;

class StripeController {

  constructor() {
    // super();
    this.preCharge        = this.preCharge.bind(this);
    this.charge           = this.charge.bind(this);
    this.postCharge       = this.postCharge.bind(this);
    this.insertOrderItems = this.insertOrderItems.bind(this);
    this.currentReq;
  }
  preCharge(req,res) {
    /*
    * Set instance variables and retreive items from DB in preparation for making a charge
    * ------------------------------------------------------------------------------------
    */
    console.log("----------\nCharge request receieved");
    // TODO: closely double check this user input
    this.currentReq = {
      token: req.body.stripeToken,
      cart: req.body.cart,
      shipping: req.body.shipping,
      payment: {},
      req: req,
      res: res
    };
    // Set additional variables
    this.currentReq.payment.status = 'uncharged';
    this.currentReq.payment.currency = 'usd';
    this.currentReq.shipping.shipping_method = 'standard';
    this.currentReq.shipping.shipping_amount = 0.00;
    this.currentReq.shipping.shipping_country = 'usa';
    this.currentReq.shipping.tax_rate = 0.08;
    this.currentReq.shipping.shipping_special_instructions = '';
    // Map cart to new array of IDs for querying
    let itemIds = this.currentReq.cart.map(function(item) { return item.id });
    ItemsModel.getItemsForOrder(itemIds,this.charge);
  }
  charge(result) {
    /*
    * Calculate amounts and create a new charge via Stripe API
    * --------------------------------------------------------
    */
    // First, get each queried item, find associated cart item by id, append order_quantity from cart item onto queried item
    let items = [];
    let that = this;
    // Ensure result is an array
    if (!Array.isArray(result)) {
      // In the case that preCharge db query returned single object, push it into an empty array
      // As long as queried item id matches cart item id, add order_quantity property
      // Otherwise return a 400/error response
      if (result.id === that.currentReq.cart[0].id) {
        result.order_quantity = parseInt(that.currentReq.cart[0].quantity,10);
        items.push(result);
      } else { that.currentReq.res.status(400).end(); }
    } else {
      // In the case that preCharge db query returned array of objects, map cart quantities into items array with NESTED LOOP
      // Consider revisiting this nested loop algo
      items = result.map( function (item) {
        // Initialize new order_quantity property on each queried item object
        item.order_quantity = 0;
        that.currentReq.cart.map( function (cart_item) {
          if (item.id === cart_item.id) {
            // Update item order_quantity
            item.order_quantity = parseInt(cart_item.quantity,10);
          }
        })
        return item;
      })
    }
    // Initialize amount variables
    let subtotal = 0,
        tax = 0,
        total = 0,
        amount = 0;
    // Calculate subtotal
    items.map( function (item) {
      subtotal += (item.price * item.order_quantity);
    });
    // Calculate tax
    tax = subtotal * that.currentReq.shipping.tax_rate;
    // Calculate total
    total = (subtotal + tax).toFixed(2);
    // Calculate amount in pennies (must be INTEGER not float)
    // Make sure to use parseInt here to remove possible trailing digits as a result of binary addition
    amount = parseInt((total * 100),10);
    // Set payment amount instance variables
    that.currentReq.payment.subtotal_amount = subtotal.toFixed(2);
    that.currentReq.payment.total_amount = total;
    that.currentReq.payment.tax_amount = tax.toFixed(2);
    console.log("Payment Total_Amount:",that.currentReq.payment.total_amount);
    // Create Stripe charge
    let charge = stripe.charges.create({
      amount: amount,
      currency: that.currentReq.payment.currency,
      description: "Completed charge",
      source: that.currentReq.token,
    }, function(err, charge) {
      // asynchronously called
      if(err){
        console.log("Stripe charge error:",err);
        that.currentReq.res.status(402).write(err.message);
        return that.currentReq.res.end();
      }
      console.log("Stripe charge successful - CHARGE ID:",charge.id);
      that.currentReq.payment.status = 'charged';
      that.postCharge(charge);
    });
  }

  postCharge(charge) {
    /*
    * Create and insert a new order, then update the Stripe charge metadata with the order_id
    * ---------------------------------------------------------------------------------------
    */
    let that = this;
    let data = {
      status: that.currentReq.payment.status,
      customer_first_name: that.currentReq.shipping.customer_first_name,
      customer_last_name: that.currentReq.shipping.customer_last_name,
      customer_email: that.currentReq.shipping.customer_email,
      customer_phone: that.currentReq.shipping.customer_phone,
      currency: that.currentReq.payment.currency,
      subtotal_amount: that.currentReq.payment.subtotal_amount,
      total_amount: that.currentReq.payment.total_amount,
      tax_amount: that.currentReq.payment.tax_amount,
      shipping_method: that.currentReq.shipping.shipping_method,
      shipping_amount: that.currentReq.shipping.shipping_amount,
      shipping_street_1: that.currentReq.shipping.shipping_street_1,
      shipping_street_2: that.currentReq.shipping.shipping_street_2,
      shipping_city: that.currentReq.shipping.shipping_city,
      shipping_state: that.currentReq.shipping.shipping_state,
      shipping_country: that.currentReq.shipping.shipping_country,
      shipping_postal_code: that.currentReq.shipping.shipping_postal_code,
      shipping_special_instructions: that.currentReq.shipping.shipping_special_instructions
    };
    OrdersModel.addOrder(data, function (order) {
      console.log("Order insert successful - ORDER ID:",order.id);
      // Update the stripe charge with the new order ID
      stripe.charges.update(
        // TODO: Consider adding a description of the order here
        charge.id,
        {
          metadata: { "order_id": order.id }
        },
        function (err, charge) {
          // asynchronously called
          if (err) {
            console.log("Stripe update_charge error:",err);
            that.currentReq.res.status(402).write(err.message);
            return that.currentReq.res.end();
          }
          console.log("Stripe update_charge successful");
          that.insertOrderItems(order);
        }
      );
    });
  }

  insertOrderItems(order) {
    /*
    * Create and insert new order_items for every item in the cart, then send 200/Success response to client
    * ------------------------------------------------------------------------------------------------------
    */
    // Insert item_ids into order_items table, associating them with the order_id
    let that = this;
    let data = {
      order_id: order.id,
      cart: that.currentReq.cart
    }
    console.log("insertOrderItems DATA:",data);
    OrderItemsModel.addOrderItems(data, function (result) {
      console.log("Order_Items insert successful\n----------");
      that.currentReq.res.status(200);
      that.currentReq.res.end();
    })
  }



}

const stripeController = new StripeController;

module.exports = stripeController;
