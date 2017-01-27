const React = require('react');

import { Link } from 'react-router';

const Item        = require('./ItemComponent.jsx').default;
const ItemStore   = require('../../stores/ItemStore.js').default,
      ItemActions = require('../../actions/ItemActions.js');

function getItemState (category) {
  return ItemStore.getItemsByCategory(category);
}

const CategoryPage = React.createClass({
  getInitialState: function () {
    return {
      items: getItemState(this.props.params.category)
    };
  },
  componentWillMount: function () {
    ItemStore.on("change", this._onChange);
  },
  componentWillUnmount: function () {
    ItemStore.removeListener("change", this._onChange);
  },
  componentWillReceiveProps: function (newProps) {
    this.updateCategory(newProps.params.category);
  },
  updateCategory: function (category) {
    this.setState({ items: getItemState(category) });
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
    // Capitalize category name in banner
    let categoryName = this.props.params.category.charAt(0).toUpperCase() + this.props.params.category.slice(1);
    return(
      <div id="category-page" className="container-fluid content">
        <div className="banner">
          <h1>{categoryName}</h1>
        </div>
        <div className="container items-container">
          <div className="row">
            <div>{this.state.items.map(this.buildItems)}</div>
          </div>
        </div>
      </div>
    );
  },
  _onChange: function () {
    this.setState({ items: getItemState(this.props.params.category) });
  }
})

export default CategoryPage;

