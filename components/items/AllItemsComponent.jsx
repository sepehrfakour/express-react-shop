const React = require('react');

import { Link } from 'react-router';

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
    let itemPageLink = '/item/' + item.id,
        inlineStyles = {
          background:'url('+item.imageurl+')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
    return (
      <div className="col-xs-3 item-col">
        <div key={item.id} data-id={item.id} className="item">
          <Link to={itemPageLink} className="image-overlay">
            <div style={inlineStyles} className="item-image"/>
          </Link>
          <Link to={itemPageLink} className="item-info">
            <div name="name">{item.name}</div>
            <span name="price">{item.price}</span>
          </Link>
        </div>
      </div>
    )
  },
  render: function () {
    return(
      <div id="all-items" className="container-fluid">
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

export default AllItems;
