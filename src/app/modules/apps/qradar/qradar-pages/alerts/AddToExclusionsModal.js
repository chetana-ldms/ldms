import React, { useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { notify, notifyFail } from "../components/notification/Notification";
import { fetchAddToExclusionListUrl } from '../../../../../api/AlertsApi';

const AddToExclusionsModal = ({ show, handleClose, handleAction, selectedValue, selectedAlert }) => {
    const data = { selectedValue, selectedAlert }
    const value = data.selectedValue
    const AlertId = data.selectedAlert
    console.log(data, "data")
    const osDropdownRef = useRef(null);
    const scopeDropdownRef = useRef(null);
    const sha1InputRef = useRef(null);
    const descriptionTextareaRef = useRef(null);
    const orgId = Number(sessionStorage.getItem("orgId"));
    const handleSubmit = async () => {
        try {
            const data = {
                orgID: orgId,
                alertIds : selectedAlert,
                targetScope: scopeDropdownRef.current.value,
                // externalTicketId: "string",
                description: descriptionTextareaRef.current.value,
                // note: descriptionTextareaRef.current.value
              }
            const responseData = await fetchAddToExclusionListUrl(data);
            const { isSuccess } = responseData;
        
            if (isSuccess) {
                notify('Add To Exclusions Applied');
              } else {
                notifyFail('Add To Exclusions Applied');
              }
            handleClose()
        } catch (error) {
            console.error('Error during API call:', error);
        }
    };
    return (
        <Modal show={show} onHide={handleClose} className="AddToExclusionsModal">
            <Modal.Header closeButton>
                <Modal.Title>Add To Exclusions
                    <div className="mt-2" style={{ fontSize: '1rem', color: 'gray' }}>
                        Exclusions Type:  Hash
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className='row'>
                    <div className='col-md-4'>
                        <label htmlFor="osDropdown" className="form-label">OS</label>
                        <select ref={osDropdownRef} className="form-select" id="osDropdown" name="os">
                            <option value="windows">Windows</option>
                            <option value="mac">Mac</option>
                            <option value="linux">Linux</option>
                        </select>
                    </div>
                    <div className='col-md-4'>
                        <label htmlFor="osDropdown" className="form-label"> Scope</label>
                        <select ref={scopeDropdownRef} className="form-select" id="scopeDropdown">
                            <option value="group">Group</option>
                            <option value="account">Account</option>
                            <option value="site">Site</option>
                        </select>
                    </div>
                </div>
                <div className='row mt-5'>
                    <div className='col-md-6'>
                        <div>
                            <label className="form-label" htmlFor="sha1Input">SHA1:</label>
                            <input ref={sha1InputRef} type="text" id="sha1Input" name="sha1" className="form-control" />
                        </div>

                    </div>
                    <div className='col-md-3  text-primary d-flex align-items-end justify-content-end pb-3 '>
                        <i className="bi bi-search text-primary mr-2"></i> Threat |
                    </div>
                    <div className='col-md-3  text-primary d-flex align-items-end pb-3 justify-content-start'>  <i className="bi bi-search text-primary mr-2"></i>Deep Visibility</div>
                </div>
                <div className='mt-5'>
                    <label className='form-label'>Description</label>
                    <textarea ref={descriptionTextareaRef} rows="1" className="form-control" placeholder='Add Description or Leave empty'></textarea>
                </div>
                <div className='mt-5'>
                    Analyst Verdict: False Positive
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Apply
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddToExclusionsModal;
