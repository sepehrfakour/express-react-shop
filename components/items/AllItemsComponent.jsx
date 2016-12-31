const React = require('react');

const ItemStore   = require('../../stores/ItemStore.js').default,
      ItemActions = require('../../actions/ItemActions.js');

function getItemState() {
  return ItemStore.getItems();
}

var AllItems = React.createClass({
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
      <div key={item.id} data-id={item.id}>
        <div name="name">{item.name}</div>
        <div name="category">{item.category}</div>
        <div name="price">{item.price}</div>
      </div>
    )
  },
  render: function () {
    return(
      <div id="all-items">
        <h1>All Items</h1>
        {this.state.items.map(this.buildItems)}
      </div>
    );
  },
  _onChange: function () {
    this.setState({ items: getItemState()});
  }
})

export default AllItems;
