const ItemsModel = require(__dirname + '/../models/ItemsModel.js');

class ItemsController {
  constructor() {
    // super();
  }
  getItems(req,res) {
    if (req.param('cat')) {
      // Fetch items by category
      ItemsModel.getItemsByCategory(req.param('cat'), function (results) {
        res.status(200).json(results);
      });
    }
    else {
      // Fetch all items
      ItemsModel.getItems(function (results) {
        res.status(200).json(results);
      });
    }
  }
  getItem(req,res) {
    if (req.param('id')) {
      // Fetch an item by ID
      ItemsModel.getItem(req.param('id'), function (result) {
        res.status(200).json(result);
      });
    }
  }
  addItem(req,res) {
    if (req.body) {
      let data = {
        category: req.body.category,
        name: req.body.name,
        price: req.body.price,
        sku: req.body.sku,
        quantity: req.body.quantity
      };
      ItemsModel.addItem(data, function (result) {
        res.status(200).json(result);
      });
    }
  }
  updateItem(req,res) {
    if (req.body) {
      let data = {
        id: req.body.id,
        category: req.body.category,
        name: req.body.name,
        price: req.body.price,
        sku: req.body.sku,
        quantity: req.body.quantity
      };
      ItemsModel.updateItem(data, function (result) {
        res.status(200).json(result);
      });
    }
  }
  deleteItem(req,res) {
    if (req.body) {
      let id = req.body.id;
      ItemsModel.deleteItem(id, function (result) {
        res.status(200).json(result);
      });
    }
  }
}

const itemsController = new ItemsController;

module.exports = itemsController;
