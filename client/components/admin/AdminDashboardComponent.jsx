const React = require('react');

const AdminNav        = require('./AdminNavComponent.jsx').default,
      AdminItemsView  = require('./items_view/AdminItemsViewComponent.jsx').default,
      AdminOrdersView = require('./orders_view/AdminOrdersViewComponent.jsx').default,
      AdminImagesView = require('./images_view/AdminImagesViewComponent.jsx').default;

const AdminDashboard = React.createClass({
  getInitialState: function () {
    return {
      currentView: 'items'
    }
  },
  updateState: function (view) {
    this.setState({
      currentView: view
    })
  },
  getCurrentView: function () {
    let view = this.state.currentView;
     if      (view === 'items') { return <AdminItemsView />; }
     else if (view === 'orders') { return <AdminOrdersView />; }
     else if (view === 'images') { return <AdminImagesView />; }
  },
  render: function () {
    return(
      <div id="admin-dashboard" className="container-fluid content">
        <AdminNav
          currentView={this.state.currentView}
          itemsCallback={this._itemsClickHandler}
          ordersCallback={this._ordersClickHandler}
          imagesCallback={this._imagesClickHandler}
        />
        {this.getCurrentView()}
      </div>
    );
  },
  _itemsClickHandler: function () {
    this.updateState('items');
  },
  _ordersClickHandler: function () {
    this.updateState('orders');
  },
  _imagesClickHandler: function () {
    this.updateState('images');
  }
})

export default AdminDashboard;
