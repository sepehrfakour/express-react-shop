const React = require('react');

import { Link } from 'react-router';

const ItemStore   = require('../../stores/ItemStore.js').default,
      ItemActions = require('../../actions/ItemActions.js');

function getItemState (category) {
  console.log('Get state...category:',category);
  return ItemStore.getItemsByCategory(category);
}

var Category = React.createClass({
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
  buildItems: function (item) {
    console.log('Building items')
    let itemPageLink = '/item/' + item.id;
    return (
      <div key={item.id} data-id={item.id}>
        <div name="name">
          <Link to={itemPageLink}>{item.name}</Link>
        </div>
        <div name="price">${item.price}</div>
      </div>
    )
  },
  render: function () {
    // debugger;
    return(
      <div id="category-page">
        <h1>Category Page</h1>
        <h2>{this.props.params.category}</h2>
        <div>{this.state.items.map(this.buildItems)}</div>
      </div>
    );
  },
  _onChange: function () {
    this.setState({ items: getItemState(this.props.params.category) });
  }
})

export default Category;

