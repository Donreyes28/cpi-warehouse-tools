import React, {useState} from 'react';
import AWS from 'aws-sdk';
import {uploadS3File, downloadS3File} from '../../utils/s3utils';

const ImageDownloader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [s3FileName, setS3FileName] = useState('');

  const handleFileInput = e => {
    const accessID = process.env.AWS_ACCESS_KEY_ID;
    setSelectedFile(e.target.files[0]);
    setS3FileName(e.target.files[0].name);
    console.log(accessID);
  };

  const handleUpload = () => {
    uploadS3File(selectedFile);
  };

  const handleDownload = async () => {
    const fileData = await downloadS3File('uploads/' + s3FileName, s3FileName);
    console.log(fileData);
  };

  return (
    <div>
      <div>Native SDK File Upload Progress is %</div>
      <input type="file" onChange={handleFileInput} />
      <button onClick={handleUpload}> Upload to S3</button>
      <button onClick={handleDownload}>Download from s3</button>
    </div>
  );
};

export default ImageDownloader;
