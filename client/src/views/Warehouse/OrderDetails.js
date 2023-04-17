import React, {useState} from 'react';
import {uploadS3File} from '../../utils/s3utils.js';
import {useNavigate} from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Downloads from '../Warehouse/Downloads.js';
import axios from 'axios';
import AWS from 'aws-sdk';
import "./OrderDetails.css";

function OrderDetails() {
  const [currentPage, setCurrentPage] = useState(<Downloads />);
  const [validated, setValidated] = useState(false);
  const [newImportName, setNewImportName] = useState({importedBy: 'Don Reyes', importName: '', category: 'order-details', batchId: ''});
  const [selectedFile, setSelectedFile] = useState(null);
  const [s3FileName, setS3FileName] = useState('');

  const navigate = useNavigate() 
  const batchIdGenerator = ('WT-' + Date.now());
  
  const handleSubmit = event => {
    const form = event.currentTarget;

    if (form.checkValidity() === true) {
      event.preventDefault();
      console.log("gana man")
      handleUpload();
      newImportNameHandler();
      setValidated(false);
    } else {
      event.preventDefault();
      setValidated(true);
    }
  };

  const newImportNameHandler = () => {
    axios.post('http://localhost:3000/api/imports/createImport', newImportName).then(() => navigate('dashboard/downloads'))
  };

  const handleFileInput = e => {
    setSelectedFile(e.target.files[0]);
    console.log(e.target.files[0]);
    setNewImportName({...newImportName});
  };

  const handleUpload = () => {
    // console.log(newImportName.batchId)
    uploadS3File(selectedFile, newImportName.batchId);
  };

  return (
    <div>
      <Form style={{width: '50%'}} noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Import Name</Form.Label>
          <Form.Control type="text" placeholder="Import Name" onChange={event => setNewImportName({...newImportName, importName: event.target.value, batchId: batchIdGenerator})} value={newImportName.importName} required />
          <Form.Control.Feedback type="invalid">Please provide import name.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formFileSm" className="mb-3">
          <Form.Label>Import File</Form.Label>
          <Form.Control type="file" onChange={handleFileInput} required />
          <Form.Control.Feedback type="invalid">Please do not leave this blank.</Form.Control.Feedback>
        </Form.Group>

        <div className='od-title'>
        <a href="https://cpi-warehouse-tools.s3.amazonaws.com/templates/order-details-template.xlsx" download className="od-title">Download Template</a>
        </div>

        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default OrderDetails;
