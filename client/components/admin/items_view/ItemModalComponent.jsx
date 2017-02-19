const React = require('react');

const S3DAO = require('../../../dao/S3DAO.js').default;

const ItemModal = React.createClass({
  getInitialState: function () {
      return {
        loadingImage: false,
        filename: "Choose a file"
      };
  },
  componentWillMount: function () {
    window.addEventListener('keydown', this._keyPressHandler);
  },
  componentDidMount: function () {
    document.getElementById("file-input").addEventListener('change', this._fileInputChangeHandler);
  },
  componentWillUnmount: function () {
    window.removeEventListener('keydown', this._keyPressHandler);
    document.getElementById("file-input").removeEventListener('change', this._fileInputChangeHandler);
  },
  render: function () {
    let item = this.props.item,
        id          = null,
        name        = '',
        category    = '',
        price       = '',
        size        = '',
        color       = '',
        description = '',
        quantity    = '',
        imageurl    = '/img/shoppingCartIcon.png',
        status      = '',
        previewClassName = 'hidden',
        spinnerClassName = 'spinner';
    if (item) {
      id = item.id,
      name = item.name,
      category = item.category,
      price = item.price,
      size = item.size,
      color = item.color,
      description = item.description,
      quantity = item.quantity,
      imageurl = item.imageurl,
      status = item.status,
      previewClassName = 'visible';
    }
    if (this.state.loadingImage) {
      spinnerClassName = 'spinner visible';
    }
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
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="dresses">Dresses</option>
              <option value="accessories">Accessories</option>
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
            <label>Size:</label>
            <input type="text" name="size" placeholder="Size" defaultValue={size}/>
          </p>
          <p>
            <label>Color:</label>
            <input type="text" name="color" placeholder="Color" defaultValue={color}/>
          </p>
          <p>
            <label>Description:</label>
            <textarea name="description" placeholder="Description" defaultValue={description}/>
          </p>
          <p>
            <label>Quantity:</label>
            <input type="number" name="quantity" placeholder="Quantity" defaultValue={quantity}/>
          </p>
          <p>
            <label>Status:</label>
            <select name="status" placeholder="Status" defaultValue={status}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
    let files = document.getElementById('file-input').files,
        file = files[0];
    if(file == null){
      return alert('No file selected.');
    } else {
      // Set upload pseudo button innerHTML to filename
      // Inject loading spinner
      this.setState({
        loadingImage: true,
        filename: file.name
      })
    }
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
