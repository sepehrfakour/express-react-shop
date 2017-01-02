const React = require('react');

import { Link } from 'react-router';

var Item = React.createClass({
  render: function () {
    let itemPageLink = '/item/' + this.props.item.id,
        inlineStyles = {
          background:'url('+this.props.item.imageurl+')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
    return(
      <div className="col-xs-4 item-col">
        <div data-id={this.props.item.id} className="item">
          <Link to={itemPageLink} className="image-overlay">
            <div style={inlineStyles} className="item-image"/>
          </Link>
          <Link to={itemPageLink} className="item-info">
            <div name="name">{this.props.item.name}</div>
            <span name="price">{this.props.item.price}</span>
          </Link>
        </div>
      </div>
    );
  }
})

export default Item;
