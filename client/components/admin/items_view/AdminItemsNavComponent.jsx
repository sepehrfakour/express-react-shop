const React = require('react');

const ItemActions = require('../../../actions/ItemActions.js');

const AdminItemsNav = React.createClass({
  getInitialState: function () {
      return {}
  },
  componentDidMount: function () {},
  render: function () {
    let viewInactiveClassName = (this.props.toggled) ? 'toggled' : 'not-toggled';
    return(
      <div id="items-nav">
        <span>Manage Items:</span>
        <ul>
          <li>
            <a href="#" id="open-add-item-modal" onClick={this.props.addClickHandler}>+ Add Item</a>
          </li>
          <li>
            <a href="#" id="view-inactive-items" className={viewInactiveClassName} onClick={this.props.toggleInactiveHandler}>View Inactive Items</a>
          </li>
        </ul>
      </div>
    );
  },
})

export default AdminItemsNav;
