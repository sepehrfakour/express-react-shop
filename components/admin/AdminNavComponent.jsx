const React = require('react');

const AdminNav = React.createClass({
  getInitialState: function () {
    return {}
  },
  render: function () {
    let currentView = this.props.currentView,
        itemsButtonclassName = (currentView === 'items') ? 'selected' : '',
        ordersButtonclassName = (currentView === 'orders') ? 'selected' : '',
        imagesButtonclassName = (currentView === 'images') ? 'selected' : '';
    return(
      <div id="admin-nav">
        <span>Admin dashboard:</span>
        <ul>
          <li className={itemsButtonclassName}>
            <a href="#" onClick={this.props.itemsCallback}>Items</a>
          </li>
          <li className={ordersButtonclassName}>
            <a href="#" onClick={this.props.ordersCallback}>Orders</a>
          </li>
          <li className={imagesButtonclassName}>
            <a href="#" onClick={this.props.imagesCallback}>Images</a>
          </li>
        </ul>
      </div>
    );
  }
})

export default AdminNav;
