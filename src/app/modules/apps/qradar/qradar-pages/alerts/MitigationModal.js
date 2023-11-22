
import React, { useState } from 'react';

import { Modal, Button } from 'react-bootstrap';
import { fetchMitigateActionUrl } from '../../../../../api/AlertsApi';
import { notify, notifyFail } from "../components/notification/Notification";

const MitigationModal = ({ show, handleClose, handleAction, selectedValue, selectedAlert }) => {
    const data = { selectedValue, selectedAlert }
    const value = data.selectedValue;
    const AlertId = data.selectedAlert;
    console.log(data, "data")
    console.log(value, "value")
    const orgId = Number(sessionStorage.getItem("orgId"));
    const [markAsResolved, setMarkAsResolved] = useState(false);
    const [addToBlocklist, setAddToBlocklist] = useState(false)
    const [groupDropdownVisible, setGroupDropdownVisible] = useState(false);
    const [scopeValue, setScopeValue] = useState('');
    const [additionalNote, setAdditionalNote] = useState('');
    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const [killSwitchChecked, setKillSwitchChecked] = useState(false);
    const [quarantineSwitchChecked, setQuarantineSwitchChecked] = useState(false);
    const [remediateSwitchChecked, setRemediateSwitchChecked] = useState(false);
    const [rollbackSwitchChecked, setRollbackSwitchChecked] = useState(false);

    const handleCheckboxChange = (checkboxId) => {
        if (checkboxId === 'checkboxButton1') {
            setIsChecked1(true);
            setIsChecked2(false);
        } else if (checkboxId === 'checkboxButton2') {
            setIsChecked1(false);
            setIsChecked2(true);
        }
    };
    const handleActionCheckboxChange = (checkboxId) => {
        if (checkboxId === 'killSwitch') {
            setKillSwitchChecked(!killSwitchChecked);
        } else if (checkboxId === 'quarantineSwitch') {
            setQuarantineSwitchChecked(!quarantineSwitchChecked);
        } else if (checkboxId === 'remediateSwitch') {
            setRemediateSwitchChecked(!remediateSwitchChecked);
        } else if (checkboxId === 'rollbackSwitch') {
            setRollbackSwitchChecked(!rollbackSwitchChecked);
        }
    };

    const handleSubmit = async () => {
        try {
            const data = {
                orgID: orgId,
                alertIds : selectedAlert,
                kill: killSwitchChecked,
                quarantine: quarantineSwitchChecked,
                remediate: remediateSwitchChecked,
                rollback: rollbackSwitchChecked,
                resolvedStatus: markAsResolved,
                addToBlockedList: addToBlocklist,
                scope: scopeValue,
                notes: additionalNote,
                analystVerdict_TruePositive: isChecked1,
                analystVerdict_FalsePositive: false,
                analystVerdict_Suspecious: isChecked2
              }
            
            const responseData = await fetchMitigateActionUrl(data);
            const { isSuccess } = responseData;
        
            if (isSuccess) {
              notify('MitigateAction Applied');
            } else {
              notifyFail('MitigateAction not Applied');
            }
            handleClose()
        } catch (error) {
            console.error('Error during API call:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} className="mitigate">
            <Modal.Header closeButton>
                <Modal.Title>Mitigation Actions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <label>Select Action:</label>
                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="killSwitch"
                            checked={killSwitchChecked}
                            onChange={() => handleActionCheckboxChange('killSwitch')}
                        />
                        <label className="form-check-label" htmlFor="killSwitch">
                            Kill
                        </label>
                    </div>
                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="quarantineSwitch"
                            checked={quarantineSwitchChecked}
                            onChange={() => handleActionCheckboxChange('quarantineSwitch')}
                        />
                        <label className="form-check-label" htmlFor="quarantineSwitch">
                            Quarantine
                        </label>
                    </div>
                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="remediateSwitch"
                            checked={remediateSwitchChecked}
                            onChange={() => handleActionCheckboxChange('remediateSwitch')}
                        />
                        <label className="form-check-label" htmlFor="remediateSwitch">
                            Remediate
                        </label>
                    </div>
                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="rollbackSwitch"
                            checked={rollbackSwitchChecked}
                            onChange={() => handleActionCheckboxChange('rollbackSwitch')}
                        />
                        <label className="form-check-label" htmlFor="rollbackSwitch">
                            RollBack
                        </label>
                    </div>




                    <hr className="my-4" />
                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkbox1"
                            onChange={() => setMarkAsResolved(!markAsResolved)}
                        />
                        <label className="form-check-label" htmlFor="checkbox1">
                            Mark as Resolved
                        </label>
                    </div>
                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkbox2"
                            onChange={() => setAddToBlocklist(!addToBlocklist)}
                        />
                        <label className="form-check-label" htmlFor="checkbox2">
                            Add to Blocklist
                        </label>
                    </div>
                    {addToBlocklist && (
                        <div className="m-0">
                            <label htmlFor="scopeDropdown" className="form-label">
                                Scope:
                            </label>
                            <button
                                className="btn btn-outline-primary rounded-pill position-relative"
                                style={{ backgroundColor: 'white', color: '#007BFF' }}
                                onClick={() => setGroupDropdownVisible(!groupDropdownVisible)}
                            >
                                Group <i className="bi bi-caret-down-fill" style={{ position: 'absolute', right: '0px', top: '55%', transform: 'translateY(-50%)' }}></i>
                            </button>


                            {groupDropdownVisible && (
                                <select className="form-select" id="scopeDropdown"
                                    type="text"
                                    value={scopeValue}
                                    onChange={(e) => setScopeValue(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="account">Account</option>
                                    <option value="site">Site</option>
                                    <option value="group">Group</option>
                                </select>
                            )}
                        </div>
                    )}
                    {(markAsResolved || addToBlocklist) && (
                        <div className="mb-2">
                            <textarea
                                className="form-control"
                                placeholder="Add an additional note..."
                                rows="2"
                                value={additionalNote}
                                onChange={(e) => {
                                    setAdditionalNote(e.target.value);
                                }}
                            ></textarea>
                        </div>
                    )}

                    <p className="mb-3"><i className="bi bi-info-circle"></i> This action will apply to all selected threats.</p>

                </div>
                <hr className="my-4" />
                <p>Analyst verdict</p>
                {addToBlocklist && (
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkboxButton1"
                            checked={isChecked1}
                            onChange={() => handleCheckboxChange('checkboxButton1')}
                        />
                        <label className="form-check-label" htmlFor="checkboxButton1">
                            True Positive
                        </label>
                    </div>
                )}
                {!addToBlocklist && (
                    <div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="checkboxButton1"
                                checked={isChecked1}
                                onChange={() => handleCheckboxChange('checkboxButton1')}
                            />
                            <label className="form-check-label" htmlFor="checkboxButton1">
                                True Positive
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="checkboxButton2"
                                checked={isChecked2}
                                onChange={() => handleCheckboxChange('checkboxButton2')}
                            />
                            <label className="form-check-label" htmlFor="checkboxButton2">
                                Suspicious
                            </label>
                        </div>
                    </div>
                )}

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

export default MitigationModal;
