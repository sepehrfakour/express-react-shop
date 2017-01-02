const React = require('react');

const ItemStore   = require('../../stores/ItemStore.js').default,
      ItemActions = require('../../actions/ItemActions.js');

function getItemState (id) {
  return ItemStore.getItem(id);
}

var ItemPage = React.createClass({
  getInitialState: function () {
    return {
      item: getItemState(parseInt(this.props.params.id,10))
    };
  },
  componentWillMount: function () {
    ItemStore.on("change", this._onChange);
  },
  componentWillUnmount: function () {
    ItemStore.removeListener("change", this._onChange);
  },
  render: function () {
    return(
      <div id="item-page" className="container-fluid content">
        <div className="banner">
          <h1>Item Page</h1>
        </div>
        <div>{this.state.item.name}</div>
        <div>${this.state.item.price}</div>
      </div>
    );
  },
  _onChange: function () {
    this.setState({ item: getItemState(parseInt(this.props.params.id,10))});
  }
})

export default ItemPage;
