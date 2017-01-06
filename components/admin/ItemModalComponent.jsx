const React = require('react');

const S3DAO = require('../../dao/S3DAO.js').default;

const ItemModal = React.createClass({
  getInitialState: function () {
      return {
        loadingImage: false,
        filename: "Choose a file"
      };
  },
  componentWillMount: function () {
    window.addEventListener('keydown', this._keyPressHandler)
  },
  componentDidMount: function () {
    document.getElementById("file-input").addEventListener('change', this._fileInputChangeHandler);
  },
  componentWillUnmount: function () {
    window.removeEventListener('keydown', this._keyPressHandler)
    document.getElementById("file-input").removeEventListener('change', this._fileInputChangeHandler);
  },
  render: function () {
    var id = null,
        name = '',
        category = '',
        price = '',
        sku = '',
        quantity = '',
        imageurl = '/images/default.png',
        previewClassName = 'hidden',
        spinnerClassName = 'spinner';
    if (this.props.item) {
      id = this.props.item.id,
      name = this.props.item.name,
      category = this.props.item.category,
      price = this.props.item.price,
      sku = this.props.item.sku,
      quantity = this.props.item.quantity,
      imageurl = this.props.item.imageurl,
      previewClassName = 'visible';
    }
    if (this.state.loadingImage) {
      spinnerClassName = 'spinner visible';
    }
    // TODO: Add validation to form
    // TODO: Consider moving file input elements out of form
    return(
        <form id={this.props.type} data-id={id} onSubmit={this.props.submitCallback}>
          <h2>{this.props.submitButtonText + " Form"}</h2>
          <button id="close-panel" onClick={this.props.closeCallback}>X</button>
          <p>
            <label id="img-label">Image:</label>
            <input type="file" name="file" id="file-input" />
            <label htmlFor="file-input" id="file-button">{this.state.filename}</label>
            <span id="loading-spinner" className={spinnerClassName}></span>
            <img id="preview" className={previewClassName} src={imageurl} />
            <input type="hidden" id="imageurl" name="imageurl" value={imageurl}/>
          </p>
          <p>
            <label>Category:</label>
            <select name="category" placeholder="Category" defaultValue={category}>
              <option value="hats">Hats</option>
              <option value="shirts">Shirts</option>
              <option value="pants">Pants</option>
              <option value="dresses">Dresses</option>
              <option value="other">Other</option>
            </select>
          </p>
          <p>
            <label>Name:</label>
            <input type="text" name="name" placeholder="Name" defaultValue={name}/>
          </p>
          <p>
            <label>Price:</label>
            <input type="number" step="any" name="price" placeholder="Price" defaultValue={price}/>
          </p>
          <p>
            <label>SKU:</label>
            <input type="text" name="sku" placeholder="Sku" defaultValue={sku}/>
          </p>
          <p>
            <label>Quantity:</label>
            <input type="number" name="quantity" placeholder="Quantity" defaultValue={quantity}/>
          </p>
          <p>
            <input type="submit" name="add-item-form-submit" value={this.props.submitButtonText} onClick={this.props.submitCallback} />
          </p>
        </form>
    );
  },
  _keyPressHandler: function (event) {
    if ((event.which && event.which == 13) || (event.keyCode && event.keyCode == 13)) {
      // Handle enter key
      event.stopPropagation();
      this.props.submitCallback(event);
    }
    if ((event.which && event.which == 27) || (event.keyCode && event.keyCode == 27)) {
      // Handle escape key
      event.stopPropagation();
      this.props.closeCallback(event);
    }
  },
  _fileInputChangeHandler: function () {
    const files = document.getElementById('file-input').files;
    const file = files[0];
    if(file == null){
      return alert('No file selected.');
    } else {
      // Set upload pseudo button innerHTML to filename &
      // Inject loading spinner
      this.setState({
        loadingImage: true,
        filename: file.name
      })
    }
    // debugger;
    S3DAO.getSignedRequest(file, this._updateImagePreviewCallback);
  },
  _updateImagePreviewCallback: function (url) {
    // Fires when S3DAO's AJAX PUT to S3 responds with S3 image url
    // Hide loading spinner
      this.setState({
        loadingImage: false
      })
    // Update the Image preview
    document.getElementById('preview').src = url;
    document.getElementById('preview').className = "visible";
    document.getElementById('imageurl').value = url;
  }
})

export default ItemModal;
