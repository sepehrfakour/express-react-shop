const React = require('react');

const ItemActions = require('../../../actions/ItemActions.js');

const AdminItemsNav = React.createClass({
  getInitialState: function () {
      return {}
  },
  componentDidMount: function () {},
  render: function () {
    // TODO: Add validation to form
    return(
      <div id="items-nav">
        <span>Manage Items:</span>
        <ul>
          <li>
            <a href="#" id="open-add-item-modal" onClick={this.props.clickHandler}>+ Add Item</a>
          </li>
        </ul>
      </div>
    );
  },
})

export default AdminItemsNav;
