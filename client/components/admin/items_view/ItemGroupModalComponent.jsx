const React = require('react');

const ItemGroupModal = React.createClass({
  getInitialState: function () {
      return {}
  },
  componentWillMount: function () {
    window.addEventListener('keydown', this._keyPressHandler);
  },
  componentWillUnmount: function () {
    window.removeEventListener('keydown', this._keyPressHandler);
  },
  buildItems: function (item) {
    return (
      <tr key={item.id} data-id={item.id} onClick={this.props.editClickHandler}>
        <td name="image"><img src={item.imageurl}></img></td>
        <td name="category">{item.category}</td>
        <td name="price">{item.price}</td>
        <td name="size">{item.size}</td>
        <td name="color">{item.color}</td>
        <td name="quantity">{item.quantity}</td>
        <td name="status">{item.status}</td>
      </tr>
    )
  },
  render: function () {
    let items      = this.props.items,
        item_group = items[0].name;
    return(
      <div id="item-group-modal">
        <div className="inner-modal">
          <h2>{item_group}</h2>
          <button id="close-panel" onClick={this.props.closeModal}>X</button>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Category</th>
                <th>Price</th>
                <th>Size</th>
                <th>Color</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {this.props.items.map(this.buildItems)}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
  _keyPressHandler: function (event) {
    if ((event.which && event.which == 27) || (event.keyCode && event.keyCode == 27)) {
      // Handle escape key
      event.stopPropagation();
      this.props.closeModal(event);
    }
  }
})

export default ItemGroupModal;
