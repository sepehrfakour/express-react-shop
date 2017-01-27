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
    } else {
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
    } else {
      res.status(400).end();
    }
  }
  addItem(req,res) {
    if (req.body) {
      let data = {
        category: req.body.category,
        name: req.body.name,
        item_group: req.body.item_group,
        price: req.body.price,
        size: req.body.size,
        color: req.body.color,
        description: req.body.description,
        sku: req.body.sku,
        quantity: req.body.quantity,
        imageurl: req.body.imageurl,
        status: req.body.status
      };
      ItemsModel.addItem(data, function (result) {
        res.status(200).json(result);
      });
    } else {
      res.status(400).end();
    }
  }
  updateItem(req,res) {
    if (req.body) {
      let data = {
        id: req.body.id,
        category: req.body.category,
        name: req.body.name,
        item_group: req.body.item_group,
        price: req.body.price,
        size: req.body.size,
        color: req.body.color,
        description: req.body.description,
        sku: req.body.sku,
        quantity: req.body.quantity,
        imageurl: req.body.imageurl,
        status: req.body.status
      };
      ItemsModel.updateItem(data, function (result) {
        res.status(200).json(result);
      });
    } else {
      res.status(400).end();
    }
  }
  deleteItem(req,res) {
    if (req.body) {
      let id = req.body.id;
      ItemsModel.deleteItem(id, function (result) {
        res.status(200).json(result);
      });
    } else {
      res.status(400).end();
    }
  }
}

const itemsController = new ItemsController;

module.exports = itemsController;
