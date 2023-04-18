const AWS = require('aws-sdk');
const fs = require('fs');// Set the region

AWS.config.update({
    region: '',
    accessKeyId: '',
    secretAccessKey: ''
});// Create an S3 client

const s3 = new AWS.S3();
const bucketName = 'cpi-warehouse-tools';
const fileKey = 'uploads/edit-page-template-v3.xlsx';

// Set the parameters for the download
const params = {
    Bucket: bucketName,
    Key: fileKey
};

const readFileFromS3 = () => {
    const s3Data = s3.getObject(params).createReadStream().on('data', function(data) {
        console.log(data.toString())
        return data;
    });

    return s3Data;
};

readFileFromS3();
