const ItemActions = require('../actions/ItemActions.js');

class S3DAO {
  constructor() {}
  getSignedRequest(file, callback) {
    const xhr = new XMLHttpRequest(),
          filename = encodeURIComponent(file.name),
          filetype = encodeURIComponent(file.type);
    xhr.open('GET', `/api/v1/sign-s3?file-name=${filename}&file-type=${filetype}`);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          console.log(xhr.responseText);
          const response = JSON.parse(xhr.responseText);
          this.uploadFile(file, response.signedRequest, response.url, callback);
        }
        else{
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  }
  uploadFile(file, signedRequest, url, callback){
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          // Callback modifys DOM inside ItemModal, updating the preview image URL
          callback(url);
        }
        else{
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }

}

const s3DAO = new S3DAO;

export default s3DAO;
