const React = require('react');

const ItemActions = require('../../actions/ItemActions.js');

const ControlPanel = React.createClass({
  getInitialState: function () {
      return {}
  },
  componentDidMount: function () {},
  render: function () {
    // TODO: Add validation to form
    return(
      <div id="control-panel">
        <button id="open-panel-button" onClick={this.props.clickHandler}>+ Add Item</button>
      </div>
    );
  },
})

export default ControlPanel;
