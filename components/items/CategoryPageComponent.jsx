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
  buildItems: function (item) {
    return (
      <Item key={item.id} item={item} />
    )
  },
  render: function () {
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

