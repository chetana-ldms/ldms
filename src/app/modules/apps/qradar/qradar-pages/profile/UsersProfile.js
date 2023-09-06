import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { fetchUsersUrl } from "../../../../../api/ConfigurationApi";
import { ToastContainer } from 'react-toastify';
import { notify, notifyFail } from '../components/notification/Notification';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Form } from "react-bootstrap";
import { fetchChangePasswordUrl, fetchResetPasswordUrl } from "../../../../../api/UserProfileApi";
import { fetchUserDelete } from "../../../../../api/Api";
import { useErrorBoundary } from "react-error-boundary";
import { UsersListLoading } from "../components/loading/UsersListLoading";
 

function UsersProfile() {
  const handleError = useErrorBoundary();
  const userID = Number(sessionStorage.getItem('userId'));
  const date = new Date().toISOString();
  const [userProfiles, setUserProfiles] = useState([]);
  console.log(userProfiles, "userProfiles")
  const [showChangePwdModal, setShowChangePwdModal] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState("");
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const [loading, setLoading] = useState(false);


  const reload = async () => {
    try {
      setLoading(true)
      const orgId = Number(sessionStorage.getItem('orgId'));
      const data = await fetchUsersUrl(orgId);
      setUserProfiles(data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      handleError(error);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const handleShowChangePwdModal = (userID) => {
    setSelectedUserID(userID);
    setShowChangePwdModal(true);
  };

  const handleCloseChangePwdModal = () => {
    setShowChangePwdModal(false);
  };

  const handlePostChangePwd = async (event) => {
    event.preventDefault();
    const oldPassword = oldPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;
    var data = {
      modifiedUserId: userID,
      modifiedDate: date,
      userId: selectedUserID,
      newPassword: newPassword,
      oldPassword: oldPassword,
    };
    try {
      setLoading(true)
      const responseData = await fetchChangePasswordUrl(data);
      const { isSuccess } = responseData;

      if (isSuccess) {
        notify('Password Updated');
      } else {
        notifyFail('Failed to update the Password');
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      handleError(error);
    }
    setShowChangePwdModal(false);
  };

  const handleResetPassword = async (selectedUserID) => {
    var data = {
      modifiedUserId: userID,
      modifiedDate: date,
      userId: selectedUserID,
    };
    try {
      setLoading(true)
      const responseData = await fetchResetPasswordUrl(data);
      const { isSuccess } = responseData;

      if (isSuccess) {
        notify('Password Reset Successful');
      } else {
        notifyFail('Failed to reset the Password');
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      handleError(error);
    }
  };

  const handleDelete = async (userID) => {
    const deletedUserId = Number(sessionStorage.getItem('userId'));
    const deletedDate = new Date().toISOString();
    const data = {
      deletedUserId,
      deletedDate,
      userID,
    };
    const confirmDelete = window.confirm('Do you want to delete this user profile?');

    if (confirmDelete) {
      try {
        setLoading(true)
        await fetchUserDelete(data);
        notify('User Deleted');
        await reload();
        setLoading(false)
      } catch (error) {
        setLoading(false)
        handleError(error);
      }
    }
  };

  return (
    <>
      <h1>Users Profile</h1>
      <div className="alert-table">
        <ToastContainer />
        {loading ? (
          <UsersListLoading />
        ) : (
        <table className="table users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Role</th>
              <th align="right"></th>
            </tr>
          </thead>
          <tbody>
            {userProfiles.map((profile) => (
              (userID === 1 || userID === profile.userID) && (
                <tr key={profile.userID}>
                  <td>{profile.userID}</td>
                  <td>{profile.name}</td>
                  <td>{profile.roleName}</td>
                  <td align="right">
                    <span className="btn btn-small btn-new btn-primary" onClick={() => handleShowChangePwdModal(profile.userID)}>
                      Change pwd <i className="fa fa-pencil" />
                    </span>{" "}
                    <span className="btn btn-small btn-new btn-primary" onClick={() => handleResetPassword(profile.userID)}>
                      Reset pwd <i className="fa fa-pencil" />
                    </span>{" "}
                    {(userID === 1) ? (
                      <span className="btn btn-small btn-danger"
                        style={{ fontSize: '14px' }}
                        onClick={() => {
                          handleDelete(profile.userID);
                        }}
                      >
                        Delete <i className="fa fa-trash" />
                      </span>
                    ) : (
                      <span className="btn btn-small btn-danger"
                        style={{ fontSize: '14px' }}
                        disabled
                      >
                        Delete <i className="fa fa-trash" />
                      </span>
                    )}
                  </td>
                </tr>
              )
            ))}
          </tbody>

        </table>)
}
      </div>

      {/* Change Password Modal */}
      <Modal show={showChangePwdModal} onHide={handleCloseChangePwdModal}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="oldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control type="password" ref={oldPasswordRef} />
            </Form.Group>
            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" ref={newPasswordRef} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseChangePwdModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePostChangePwd}>
            Change Password
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UsersProfile;
