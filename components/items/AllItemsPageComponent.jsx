const React = require('react');

import { Link } from 'react-router';

const Item        = require('./ItemComponent.jsx').default;
const ItemStore   = require('../../stores/ItemStore.js').default,
      ItemActions = require('../../actions/ItemActions.js');

function getItemState() {
  return ItemStore.getItems();
}

const AllItemsPage = React.createClass({
  getInitialState: function () {
      return {
        items: getItemState(),
      };
  },
  componentWillMount: function () {
    ItemStore.on("change", this._onChange);
  },
  componentWillUnmount: function () {
    ItemStore.removeListener("change", this._onChange);
  },
  addToItemGroups: function (item) {
    if (!this.itemGroups[item.item_group]) {
      this.itemGroups[item.item_group] = {
        colors: []
      };
    }
    if (this.itemGroups[item.item_group].colors.indexOf(item.color) === -1) {
      this.itemGroups[item.item_group].colors.push(item.color);
    }
  },
  buildItems: function (item) {
    // Only render one item from each itemGroup, and only render active items
    if (!this.rendered[item.item_group] && item.status === 'active') {
      this.rendered[item.item_group] = true;
      return (
        <Item
          key={item.id}
          item={item}
          colors={this.itemGroups[item.item_group].colors}
        />
      )
    }
  },
  render: function () {
    this.rendered = {};
    // Find all available colors for each item_group
    this.itemGroups = {};
    this.state.items.map(this.addToItemGroups);
    return(
      <div id="all-items" className="container-fluid content">
        <div className="banner">
          <h1>All Items</h1>
        </div>
        <div className="container items-container">
          <div className="row">
            {this.state.items.map(this.buildItems)}
          </div>
        </div>
      </div>
    );
  },
  _onChange: function () {
    this.setState({ items: getItemState()});
  }
})

export default AllItemsPage;
