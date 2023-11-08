import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const AddToBlockListModal = ({ show, handleClose, handleAction, selectedValue, selectedAlert }) => {
    const data = { selectedValue, selectedAlert }
    const value = data.selectedValue
    const AlertId = data.selectedAlert
    console.log(data, "data")
    return (
        <Modal show={show} onHide={handleClose} className="addToBlockList">
            <Modal.Header closeButton>
                <Modal.Title>
                    <div> <i className="bi bi-shield-slash mr-2"></i> Add To Blocklist</div>
                    <div className="mt-2" style={{ fontSize: '1rem', color: 'gray' }}>
                        Blacklist Type:  Hash
                    </div>
                </Modal.Title><br />

            </Modal.Header>
            <Modal.Body>
                <div className='row'>
                    <div className='col-md-4'>
                        <label htmlFor="osDropdown" className="form-label">OS</label>
                        <select className="form-select" id="osDropdown" name="os">
                            <option value="windows">Windows</option>
                            <option value="mac">Mac</option>
                            <option value="linux">Linux</option>
                        </select>
                    </div>
                    <div className='col-md-4'>
                        <label htmlFor="osDropdown" className="form-label"> Scope</label>
                        <select className="form-select" id="scopeDropdown">
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
                            <input type="text" id="sha1Input" name="sha1" className="form-control" />
                        </div>

                    </div>
                    <div className='col-md-3  text-primary d-flex align-items-end justify-content-end pb-3 '>
                        <i className="bi bi-search text-primary mr-2"></i> Threat |
                    </div>
                    <div className='col-md-3  text-primary d-flex align-items-end pb-3 justify-content-start'>  <i className="bi bi-search text-primary mr-2"></i>Deep Visibility</div>
                </div>
                <div className='mt-5'>
                    <label className='form-label'>Description</label>
                    <textarea rows="1" className="form-control" placeholder='Add Description or Leave empty'></textarea>
                </div>
                <div className='mt-5'>
                Analyst Verdict: True Positive
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleAction}>
                    Apply Action
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default AddToBlockListModal;