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
        <div className="item-name">
          <h2>{this.state.item.name}</h2>
        </div>
        <div className="container item-container">
          <div className="row">
            <div className="offset-xs-1 col-xs-10 offset-md-0 col-md-6 border-box">
              <div className="item-image">
                <img src={this.state.item.imageurl}/>
              </div>
            </div>
            <div className="offset-xs-1 col-xs-10 offset-md-0 col-md-6 border-box">
              <div className="item-info">
                <h4>{this.state.item.name}</h4>
                <div>${this.state.item.price}</div>
                <p>
                  <label>Color</label>
                  <input type="radio" name="color-radio"/>
                  <input type="radio" name="color-radio"/>
                  <input type="radio" name="color-radio"/>
                </p>
                <p>
                  <label>Size</label>
                  <select>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                  </select>
                </p>
                <button>Add to bag</button>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  _onChange: function () {
    this.setState({ item: getItemState(parseInt(this.props.params.id,10))});
  }
})

export default ItemPage;
