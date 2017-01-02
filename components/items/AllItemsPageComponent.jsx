const React = require('react');

import { Link } from 'react-router';

const Item        = require('./ItemComponent.jsx').default;
const ItemStore   = require('../../stores/ItemStore.js').default,
      ItemActions = require('../../actions/ItemActions.js');

function getItemState() {
  return ItemStore.getItems();
}

var AllItemsPage = React.createClass({
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
  buildItems: function (item) {
    return (
      <Item key={item.id} item={item} />
    )
  },
  render: function () {
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
