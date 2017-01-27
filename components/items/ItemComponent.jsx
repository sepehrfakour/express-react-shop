const React = require('react');

import { Link } from 'react-router';

const Item = React.createClass({
  render: function () {
    let itemPageLink = '/item/' + this.props.item.item_group,
        inlineStyles = {
          background:'url('+this.props.item.imageurl+')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
    return(
      <div className="col-xl-4 item-col">
        <div data-id={this.props.item.item_group} className="item">
          <Link to={itemPageLink} className="image-overlay">
            <div style={inlineStyles} className="item-image"/>
          </Link>
          <Link to={itemPageLink} className="item-info">
            <div name="name">{this.props.item.name}</div>
            <span name="price">{this.props.item.price}</span>
            <div name="colors">Available in {this.props.colors.join(', ')}</div>
          </Link>
        </div>
      </div>
    );
  }
})

export default Item;
