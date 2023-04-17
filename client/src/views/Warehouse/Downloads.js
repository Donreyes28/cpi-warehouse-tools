import React from 'react';

import {useState, useEffect} from 'react';
import {Button, Table, InputGroup} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowsRotate, faPenToSquare, faTrash} from '@fortawesome/free-solid-svg-icons';
import {downloadS3File} from '../../utils/s3utils';
import {ToastContainer, toast} from 'react-toastify';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';
import 'react-toastify/dist/ReactToastify.css';

const Downloads = () => {
  const [importList, setImportList] = useState([]);
  const [counter, setCounter] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(15);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/imports/getAllImportRequest')
      .then(res => {
        let importsArr = [];
        Object.entries(res.data.rows).map(imports => {
          const {id, batchId, importedBy, importName, category, status, dateImported} = imports[1];
          return importsArr.push({
            id: id,
            batchId: batchId,
            importedBy: importedBy,
            importName: importName,
            category: category,
            status: status,
            dateImported: dateImported
          });
        });
        return setImportList(importsArr);
      })
      .catch(error => setImportList({key: error.name, text: error.message}));

      const timer = setInterval(() => {
        setAutoRefresh(autoRefresh => autoRefresh - 1)
      },1500)

      return () => clearInterval(timer);

  }, [counter]);
  
  const refreshPage = () => {
    setAutoRefresh(15)
  };

  useEffect(() => {
    if ( autoRefresh === 0 ){
      refreshPage();
    }
  },[autoRefresh]);
  
  const downloadHandler = async => {
    try {
      // const fileData = await downloadS3File('uploads/' + s3FileName, s3FileName);
      toast.success('File downloaded successfully!');
    } catch (error) {
      toast.error('File does not exist!');
    }
  };

  const sortedImportList = importList.sort((a, b) => {
    if (a.status === b.status) {
      return new Date(b.dateImported) - new Date(a.dateImported);
    }
    if (a.status === 'open') {
      return -1;
    } else if (a.status === 'on-going' && b.status !== 'open') {
      return -1;
    } else if (a.status === 'completed' && b.status !== 'open' && b.status !== 'on-going') {
      return -1;
    } else {
      return 1;
    }
  });

  const resubmitHandler = item => {
    const {batchId, category, dateImported, id, importName, importedBy, s3FileName, status} = item;
    item.newStatus = 'open';
    axios
      .put(`http://localhost:3000/api/imports/updateImportStatus/:${id}`, item)
      .then(res => {
        setCounter(!counter);
      })
      .catch(err => console.log(err));
  };

  const deleteHandler = item => {
    const {batchId, category, dateImported, id, importName, importedBy, s3FileName, status} = item;
    axios
      .delete(`http://localhost:3000/api/imports/deleteImport/${id}`)
      .then(res => {
        console.log('Deleted');
        setCounter(!counter);
        setTimeout(() => {
          toast.success('User has been deleted successfully');
        }, 1500);
      })
      .catch(err => console.log(err));
  };

  // setInterval(refreshPage, 15000);

  return (
    <div>
      <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgb(210,214,218)', padding: '10px'}}>
        <h4>Downloads</h4>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Form className="d-flex ms-2">
            <InputGroup>
              <Form.Control type="search" placeholder="Search name" className="me-2" />
            </InputGroup>
          </Form>
          <Button onClick={refreshPage}>
            <FontAwesomeIcon icon={faArrowsRotate} />
          </Button>
            <p>Countdown: {autoRefresh}</p>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss={false} draggable pauseOnHover theme="light" />

      <Table hover striped bordered className="tblCxSalesListStyles">
        <thead className="trHeaders">
          <tr>
            <th>Batch ID</th>
            <th>Imported By</th>
            <th>Import Name</th>
            <th>Category</th>
            <th>Date Imported</th>
            <th>Status</th>
            <th colSpan={2} style={{textAlign: 'center'}}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedImportList.map((item, i) => {
            let badgeBg;
            if (item.status === 'open') {
              badgeBg = 'secondary';
            } else if (item.status === 'on-going') {
              badgeBg = 'warning';
            } else if (item.status === 'completed') {
              badgeBg = 'success';
            } else if (item.status === 'failed') {
              badgeBg = 'danger';
            }
            return (
              <tr key={i} id={item.id}>
                <td>{item.batchId}</td>
                <td>{item.importedBy}</td>
                <td>{item.importName}</td>
                <td>{item.category}</td>
                <td>{item.dateImported}</td>
                <td>
                  <Badge bg={badgeBg}>{item.status}</Badge>
                </td>
                <td style={{textAlign: 'center'}}>
                  <Dropdown as={ButtonGroup} size="sm">
                    <Button variant="primary">Download</Button>

                    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

                    <Dropdown.Menu>
                      {/* <Dropdown.Item onClick={() => downloadHandler(item.s3FileName)}>Download original file</Dropdown.Item> */}
                      <Dropdown.Item onClick={() => resubmitHandler(item)}>Resubmit</Dropdown.Item>
                      <Dropdown.Item onClick={() => deleteHandler(item)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default Downloads;
