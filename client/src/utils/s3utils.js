import React, {useState} from 'react';
import AWS from 'aws-sdk';
import fileSaver from 'file-saver'

AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',

});

const BUCKET = '';
const REGION = '';

const myBucket = new AWS.S3({
  params: {Bucket: BUCKET},
  region: REGION,
});

const uploadS3File = async (file, generatedKey) => {
  console.log(generatedKey)
  const params = {
    ACL: 'public-read',
    Body: file,
    Bucket: '',  
    Key: `uploads/${generatedKey}-${file.name}`,
  };

  await myBucket.putObject(params).send(err => {
    if (err) console.log(err);
  });
};

const downloadS3File = (s3Key) => {
  const s3 = new AWS.S3();
  return new Promise((resolve, reject) => {
    s3.getObject({Key: s3Key, Bucket: ''}, (error, data) => {
      if (error) {
        reject(error);
      } else {
        const blob = new Blob([data.Body]);
        fileSaver.saveAs(blob, s3Key);
        resolve();
      }
    });
  });
};

const readFileFromS3 = (fileName) =>
  new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: key.s3Bucket,
        Key: `${fileName}`
      };
      const stream = await s3.getObject(params).createReadStream();
      
      resolve(stream);
    } catch (error) {
      reject(error);
    }
  });

export {uploadS3File, downloadS3File};

