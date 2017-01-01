const aws = require('aws-sdk'),
      S3_BUCKET = process.env.S3_BUCKET;

class S3Controller {
  constructor() {
    // super();
  }
  signS3(req,res) {
    const s3 = new aws.S3(),
          fileName = req.query['file-name'],
          fileType = req.query['file-type'],
          s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      res.write(JSON.stringify(returnData));
      res.end();
    });
  }
}

const s3Controller = new S3Controller;

module.exports = s3Controller;
