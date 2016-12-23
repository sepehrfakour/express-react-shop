const ItemsModel = require(__dirname + '/../models/ItemsModel.js');

class ItemsController {
  constructor() {
    // super();
  }
  getItems(req,res) {
    if (req.param('cat')) {
      ItemsModel.getItemsByCategory(req.param('cat'), function (results) {
        res.status(200).json(results);
      });
    }
    else {
      ItemsModel.getItems(function (results) {
        res.status(200).json(results);
      });
    }
  }
  getItem(req,res) {
    if (req.param('id')) {
      ItemsModel.getItem(req.param('id'), function (result) {
        res.status(200).json(result);
      });
    }
  }
  getItemsByCategory (req, res) {
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
