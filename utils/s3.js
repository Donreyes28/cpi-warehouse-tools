// const { AWS } = require('aws-sdk');
// const fileSaver = require('file-saver');

// AWS.config.update({
//   accessKeyId: 'AKIAXGGJDX5IK3Z6DIF7',
//   secretAccessKey: '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',
// });

// const BUCKET = 'cpi-warehouse-tools';
// const REGION = 'us-east-1';

// exports.readFileFromS3 = (fileName) => {
//     const s3 = new AWS.S3();
    // new Promise(async (resolve, reject) => {
    //     try {
    //         const params = {
    //             Bucket: BUCKET,
    //             Key: `${fileName}`
    //         };
    //         const stream = await s3.getObject(params).createReadStream();
    //         resolve(stream);
    //     } catch (error) {
    //         reject(error);
    //     }
    // });
// }


const AWS = require('aws-sdk');
const fs = require('fs');// Set the region

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIAXGGJDX5IK3Z6DIF7',
    secretAccessKey: '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'
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