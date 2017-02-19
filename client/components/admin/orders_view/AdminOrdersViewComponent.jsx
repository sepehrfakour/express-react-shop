const React = require('react');

const OrderDAO = require('../../../dao/OrderDAO.js').default;

function getOrders (callback) {
  return OrderDAO.getOrders(callback);
}

const AdminOrdersView = React.createClass({
  getInitialState: function () {
    return {
      orders: null
    }
  },
  componentWillMount: function () {
    getOrders(this.updateState);
  },
  updateState: function (ordersJSON) {
    this.setState({
      orders: ordersJSON
    })
  },
  buildOrders: function (order) {
    let key            = 'order-' + order.id,
        id             = order.id,
        name           = order.customer_first_name + ' ' + order.customer_last_name,
        email          = order.customer_email,
        phone          = order.customer_phone,
        address        = order.shipping_street_1 + ' ' + [order.shipping_street_2, order.shipping_city, order.shipping_state, order.shipping_country].join(', '),
        total          = order.total_amount,
        timestamp      = Date.parse(order.date_created),
        date           = new Date(timestamp),
        dateString     = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear(),
        dateTimeString = dateString + ' @ ' + date.getHours() + ':' + date.getMinutes() + ' (utc)';
    return (
      <tr key={key} className="order" onClick={this._orderRowClickHandler}>
        <td className="order-id">{id}</td>
        <td className="order-name">{name}</td>
        <td className="order-email">{email}</td>
        <td className="order-phone">{phone}</td>
        <td className="order-address">{address}</td>
        <td className="order-total">{total}</td>
        <td className="order-date" title={dateTimeString}>{dateString}</td>
        <td className="order-actions"><button>View</button></td>
      </tr>
    )
  },
  render: function () {
    let orders = this.state.orders;
    return(
      <div id="admin-orders-view">
        <table id="orders-list">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { (orders) ? orders.map(this.buildOrders) : <tr><td colSpan="8">Unable to access orders</td></tr> }
          </tbody>
        </table>
      </div>
    );
  },
  _orderRowClickHandler: function () {
    console.log("This will display the order details, including items");
  }
})

export default AdminOrdersView;
