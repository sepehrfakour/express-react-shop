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
  }
  updateItem(req,res) {
  }
  deleteItem(req,res) {
  }
}

const itemsController = new ItemsController;

module.exports = itemsController;
