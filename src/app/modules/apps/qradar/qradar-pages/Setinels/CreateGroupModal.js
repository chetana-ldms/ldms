import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify, notifyFail } from '../components/notification/Notification';
import { fetchGroupsCreateUrl } from '../../../../../api/SentinalApi';

function CreateGroupModal({ show, handleClose, items, selectedActionId, refreshData }) {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const siteId = sessionStorage.getItem('siteId');
  
  const [selectedGroupType, setSelectedGroupType] = useState('');

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleGroupDescriptionChange = (event) => {
    setGroupDescription(event.target.value);
  };

  const handleRadioChange = (event) => {
    setSelectedGroupType(event.target.value);
  };

  const handleCreateGroup = async (event) => {
    event.preventDefault();
    if (!groupName) {
      notifyFail('Enter Group Name');
      return;
    }
    if (!selectedGroupType) {
      notifyFail('Enter Group Type');
      return;
    }

    const data = {
      name: groupName,
      type: selectedGroupType,
      description: groupDescription,
      orgId: Number(sessionStorage.getItem('orgId')),
      toolId: Number(sessionStorage.getItem('toolID')),
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      siteId: siteId,
      isDefault: false,
      inherits: true,
    };

    try {
      const responseData = await fetchGroupsCreateUrl(data);
      const { isSuccess, message } = responseData;

      if (isSuccess) {
        notify(message);
        handleClose();
        window.location.reload();
      } else {
        notifyFail(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="application-modal">
      <Modal.Header closeButton>
        <Modal.Title>Create New Group</Modal.Title>
        <button type="button" className="application-modal-close" aria-label="Close">
          <i className="fa fa-close" />
        </button>
      </Modal.Header>
      <Modal.Body>
        <form className="px-5 mx-5">
          {/* Added 'col-md-8' to reduce the width */}
          <div className="mb-3 col-md-8 mx-auto">
            <label htmlFor="groupName" className="form-label">
              Group Name
            </label>
            <input
              type="text"
              className="form-control"
              id="groupName"
              value={groupName}
              onChange={handleGroupNameChange}
              placeholder="Enter group name"
            />
          </div>

          {/* Added 'col-md-8' to reduce the width */}
          <div className="mb-3 col-md-8 mx-auto">
            <label htmlFor="groupDescription" className="form-label">
              Group Description
            </label>
            <textarea
              id="groupDescription"
              className="form-control"
              rows={6}
              placeholder="Enter group description"
              value={groupDescription}
              onChange={handleGroupDescriptionChange}
            />
          </div>

          <div className="mb-3 col-md-8 mx-auto mt-5">
            <h6 className='mt-5 mt-5'>Group Type</h6>
            <div className="form-radio mt-3">
              <input
                className="form-radio-input me-3"
                type="radio"
                id="static"
                name="groupType"
                value="static"
                checked={selectedGroupType === 'static'}
                onChange={handleRadioChange}
              />
              <label className="form-check-label" htmlFor="static">
                Manual Group
              </label>
            </div>
            <div className="form-radio mt-3">
              <input
                className="form-radio-input me-3"
                type="radio"
                id="pinned"
                name="groupType"
                value="pinned"
                checked={selectedGroupType === 'pinned'}
                onChange={handleRadioChange}
              />
              <label className="form-check-label" htmlFor="pinned">
                Pinned Group
              </label>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreateGroup}>
          Create Group
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateGroupModal;
