import React, {useState, useEffect} from 'react';
import axios from 'axios';

import './Profile.css';
import {Row, Table, InputGroup, Pagination} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPenToSquare, faTrash, faUserPlus, faScroll, faUser, faVenusMars, faKey, faEnvelope, faLock, faSortDown, faSortUp, faXmark, faArrowsRotate} from '@fortawesome/free-solid-svg-icons';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = props => {
  const [modalShow, setModalShow] = useState(false);
  const [updateModal, setUpdateModal] = useState({
    id: '',
    firstName: '',
    lastName: '',
    gender: '',
    role: '',
    showUpdate: false,
  });
  const [deleteModal, setDeleteModal] = useState({
    id: '',
    name: '',
    showDelete: false,
  });
  const [profileList, setProfileList] = useState([]);
  const [counter, setCounter] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [validated, setValidated] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/userProfile/getUserList')
      .then(res => {
        let userArr = [];
        Object.entries(res.data.data).map(user => {
          const {id, first_name, last_name, gender, email, role} = user[1];
          return userArr.push({
            userId: id,
            firstName: first_name,
            lastName: last_name,
            gender: gender,
            email: email,
            role: role,
          });
        });
        return setProfileList(userArr);
      })
      .catch(error => setProfileList({key: error.name, text: error.message}));
  }, [counter]);

  const handleModalSubmit = event => {
    const form = event.currentTarget;

    if (form.checkValidity() === true) {
      addNewUser();
      setValidated(false);
    } else {
      setValidated(true);
    }
    event.preventDefault();
  };

  const handleModalCancel = () => {
    setModalShow(false);
    setUpdateModal(false);
    setValidated(false);
    resetForm();
  };

  const resetForm = () => {
    document.getElementById('addUserProfileForm').reset();
    setUserDetails({});
  };

  const addNewUser = () => {
    const {firstName, lastName, gender, email, role, password} = userDetails;
    let isUserExist = false;

    profileList.find(x => {
      if (x.firstName === firstName) isUserExist = true;
    });

    if (isUserExist !== true) {
      if (firstName !== undefined) {
        axios
          .post('http://localhost:3000/api/userProfile/createProfile', userDetails)
          .then(res => {
            setCounter(!counter);
            setModalShow(false);
            resetForm();
            setTimeout(() => {
              toast.success('User Successfully Added!!');
            }, 1000);
          })
          .catch(() => toast.error('User was not added'));
      }
    }
  };

  const deleteUser = (id, name) => {
    console.log(id);
    setDeleteModal(false);
    axios
      .delete(`http://localhost:3000/api/userProfile/deleteUserProfile/${id}`)
      .then(() => {
        setCounter(!counter);
        setTimeout(() => {
          toast.success('User has been deleted successfully');
        }, 1500);
      })
      .catch(() => {
        toast.warning('User was not deleted');
      });

    setUserDetails({
      firstName: '',
      lastName: '',
      gender: '',
      email: '',
      role: '',
    });
  };

  const createUserHandler = () => {
    setModalShow(true);
    setValidated(false);
  };

  const updateUser = id => {
    const {firstName, lastName, gender, role} = updateModal;
    setUpdateModal(false);
    axios
      .put(`http://localhost:3000/api/userProfile/updateUserInfo/${id}`, {
        first_name: firstName,
        last_name: lastName,
        gender: gender,
        role: role,
      })
      .then(() => {
        setCounter(!counter);
        setTimeout(() => {
          toast.success('User was updated');
        }, 1500);
      })
      .catch(() => {
        toast.error('User was not updated');
      });
  };

  const handleRoleClick = () => {
    if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('asc');
    }
  };

  const handleChange = e => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const filteredUsers = profileList.filter(user => user.firstName.toLowerCase().includes(searchInput.toLowerCase()) || user.lastName.toLowerCase().includes(searchInput.toLowerCase()));

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const slicedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss={false} draggable pauseOnHover theme="light" />

      <Modal onHide={() => setModalShow(false)} show={modalShow} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton onClick={() => setValidated(false)}>
          <Modal.Title id="contained-modal-title-vcenter">Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="addUserProfileForm" noValidate validated={validated} onSubmit={handleModalSubmit}>
            <Row className="mb-3">
              <Form.Group className="mb-3" style={{width: '37%'}}>
                <Form.Label>First Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    value={userDetails.firstName}
                    onChange={e =>
                      setUserDetails({
                        ...userDetails,
                        firstName: e.target.value,
                      })
                    }         
                    required
                  />
                </InputGroup>
                <Form.Control.Feedback type="invalid">Please input first name.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" style={{width: '37%'}}>
                <Form.Label>Last Name </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faUser} />
                  </InputGroup.Text>
                  <Form.Control type="text" placeholder="Last Name" value={userDetails.lastName}
                    onChange={e =>
                      setUserDetails({
                        ...userDetails,
                        lastName: e.target.value,
                      })
                    }
                    required
                  />
                </InputGroup>
                <Form.Control.Feedback type="invalid">Please input last name.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" style={{width: '26%'}}>
                <Form.Label>Gender</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FontAwesomeIcon icon={faVenusMars} /></InputGroup.Text>
                  <Form.Select aria-label="Default select example" defaultValue="" value={userDetails.gender}
                    onChange={e =>
                      setUserDetails({
                        ...userDetails,
                        gender: e.target.value,
                      })
                    }
                    required>
                    <option value="" disabled>Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                </InputGroup>
                <Form.Control.Feedback type="invalid">Please select gender.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" style={{width: '100%'}}>
                <Form.Label>Role</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FontAwesomeIcon icon={faKey} /></InputGroup.Text>
                  <Form.Select aria-label="Default select example" defaultValue="" value={userDetails.role}
                    onChange={e =>
                      setUserDetails({
                        ...userDetails,
                        role: e.target.value,
                      })
                    }
                    required>
                    <option value="" disabled>Role</option>
                    <option value="Administrator">Administrator</option>
                    <option value="User">User</option>
                  </Form.Select>
                </InputGroup>
                <Form.Control.Feedback type="invalid">Please select user role.</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faEnvelope} />
                </InputGroup.Text>
                <Form.Control type="email" placeholder="Email" value={userDetails.email}
                  onChange={e =>
                    setUserDetails({
                      ...userDetails,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </InputGroup>
              <Form.Control.Feedback type="invalid">Please input email.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <InputGroup.Text><FontAwesomeIcon icon={faLock} /></InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={userDetails.password}
                  onChange={e =>
                    setUserDetails({
                      ...userDetails,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </InputGroup>
              <Form.Control.Feedback type="invalid">Please create a password.</Form.Control.Feedback>
            </Form.Group>

            <Modal.Footer>
              <Button variant="outline-danger" onClick={handleModalCancel}>Cancel</Button>
              <Button type="submit" variant="primary">Submit</Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal onHide={() => setDeleteModal({...deleteModal, showDelete: false})} show={deleteModal.showDelete} size="md" aria-labelledby="contained-modal-title-vcenter" centered animation={true}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize: '20px'}}>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{fontSize: '13px'}}>
          <Alert variant="danger">
            <b>Note:</b> Once you delete this user, changes will be permanent?
          </Alert>
          Are you sure you want to delete {deleteModal.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setDeleteModal(false)}>
            NO
          </Button>
          <Button variant="danger" size="sm" onClick={() => deleteUser(deleteModal.id)}>
            {' '}
            YES
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal onHide={() => setUpdateModal({...updateModal, showUpdate: false})} show={updateModal.showUpdate} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Edit User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="addUserProfileForm" noValidate validated={validated}>
            <Row className="mb-3">
              <Form.Group className="mb-3" style={{width: '40%'}}>
                <Form.Label>First Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faUser} />
                  </InputGroup.Text>
                  <Form.Control type="text" defaultValue={updateModal.firstName} value={userDetails.firstName}
                    onChange={e =>
                      setUpdateModal({
                        ...updateModal,
                        firstName: e.target.value,
                      })
                    }
                    required
                  />
                </InputGroup>
                <Form.Control.Feedback type="invalid">Please input first name.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" style={{width: '40%'}}>
                <Form.Label>Last Name </Form.Label>
                <InputGroup>
                  <InputGroup.Text><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                  <Form.Control type="text" defaultValue={updateModal.lastName} value={userDetails.lastName}
                    onChange={e =>
                      setUpdateModal({
                        ...updateModal,
                        lastName: e.target.value,
                      })
                    }
                    required
                  />
                </InputGroup>
                <Form.Control.Feedback type="invalid">Please input last name.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" style={{width: '20%'}}>
                <Form.Label>Gender</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FontAwesomeIcon icon={faVenusMars} /></InputGroup.Text>
                  <Form.Select aria-label="Default select example" defaultValue={updateModal.gender} value={userDetails.gender}
                    onChange={e =>
                      setUpdateModal({
                        ...updateModal,
                        gender: e.target.value,
                      })
                    }
                    required>
                    <option value="" disabled>Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                </InputGroup>
                <Form.Control.Feedback type="invalid">Please select gender.</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" style={{width: 'width: 100%'}}>
              <Form.Label>Role</Form.Label>
              <InputGroup>
                <InputGroup.Text><FontAwesomeIcon icon={faKey} /></InputGroup.Text>
                <Form.Select aria-label="Default select example" defaultValue={updateModal.role} value={userDetails.role}
                  onChange={e =>
                    setUpdateModal({
                      ...updateModal,
                      role: e.target.value,
                    })
                  }
                  required>
                  <option value="" disabled>Role</option>
                  <option value="Administrator">Administrator</option>
                  <option value="User">User</option>
                </Form.Select>
              </InputGroup>
              <Form.Control.Feedback type="invalid">Please select user role.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <InputGroup.Text><FontAwesomeIcon icon={faEnvelope} /></InputGroup.Text>
                <Form.Control type="email" defaultValue={updateModal.email} value={userDetails.email} disabled />
              </InputGroup>
            </Form.Group>

            <Modal.Footer>
              <Button variant="outline-danger" onClick={handleModalCancel}>Cancel</Button>
              <Button variant="primary" onClick={() => updateUser(updateModal.id)}>Submit</Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgb(210,214,218)', padding: '10px'}}>
        <h4><FontAwesomeIcon icon={faScroll} />List of Profiles</h4>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Button name="createUserIcon" variant="secondary" size="sm" onClick={createUserHandler}>
            {' '}
            <FontAwesomeIcon icon={faUserPlus} />{' '}
          </Button>
          <Form className="d-flex ms-2">
            <InputGroup>
              <Form.Control type="search" placeholder="Search name" className="me-2" onChange={handleChange} value={searchInput} />
            </InputGroup>
          </Form>
        </div>
      </div>

      <Table hover striped bordered className="tblCxSalesListStyles">
        <thead className="trHeaders">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Email</th>
            <th onClick={handleRoleClick}>Role {sortOrder === 'asc' ? <FontAwesomeIcon icon={faSortDown} /> : sortOrder === 'desc' ? <FontAwesomeIcon icon={faSortUp} /> : null}</th>
            <th colSpan={2} style={{textAlign: 'center'}}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {slicedUsers.length >= 1 ? (
            slicedUsers
              .slice()
              .sort((a, b) => (sortOrder !== null ? (sortOrder === 'asc' ? a.role.localeCompare(b.role) : b.role.localeCompare(a.role)) : 0))
              .map((item, i) => {
                return (
                  <tr key={i} id={item.userId}>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.gender}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td style={{textAlign: 'center'}}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          setDeleteModal({
                            id: item.userId,
                            name: item.firstName,
                            showDelete: true,
                          })
                        }>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>

                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          setUpdateModal({
                            id: item.userId,
                            firstName: item.firstName,
                            lastName: item.lastName,
                            gender: item.gender,
                            role: item.role,
                            email: item.email,
                            showUpdate: true,
                          })
                        }
                        style={{marginLeft: '5px'}}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Button>
                    </td>
                  </tr>
                );
              })
          ) : (
            <tr>
              <td colSpan={6} style={{textAlign: 'center'}}>
                {' '}
                {profileList.key ? profileList.key + ': ' + profileList.text : 'No users found.'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <div style={{ display: "flex", justifyContent: "center" }}>
      <Pagination className="mt-3">
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
        {Array.from({
          length: Math.ceil(filteredUsers.length / itemsPerPage),
        }).map((_, index) => (
          <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={slicedUsers.length < itemsPerPage} />
      </Pagination>
      </div>
    </div>
  );
};

export default Profile;


