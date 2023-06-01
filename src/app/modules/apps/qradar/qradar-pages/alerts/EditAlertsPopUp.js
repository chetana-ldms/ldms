import React, { useEffect } from "react";
import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { fetchUpdateAlert } from "../../../../../api/Api";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const EditAlertsPopUp = ({ show, onClose, row, ldp_security_user, dropdownData, onTableRefresh }) => {
    const [formData, setFormData] = useState({
        // severityName: row.severityId,
        // status: row.statusID,
        // observableTag: row.observableTagID,
        // ownerusername: row.ownerUserID
        severityName: row.severityName,
        status: row.status,
        observableTag: row.observableTag,
        ownerusername: row.ownerusername
    });
    console.log(row, "row1111")
    const [ownerId, setOwnerId] = useState()
    const { orgID, alertID, statusID, userID, severityId, observableTagID, ownerUserID, modifiedDate } = row;
//    const {userID} = ldp_security_user;
    const [id, setId] = useState({
        severityId:severityId,
        statusID:statusID,
        observableTagID:observableTagID,
        ownerUserID:ownerUserID
    });
console.log(id, "id111")
    console.log("idsssss",row);

    const { severityName, status, observableTag, ownerusername } = formData
    console.log(formData, "formData111111")
    const { name, score, sla, detectedtime, source } = row
    const { severityNameDropDownData, statusDropDown, observableTagDropDown } = dropdownData;

   
    const handleChange = (e, field) => {
        e.preventDefault();
        console.log(e.target.value, "value11111")
        setFormData({
            ...formData,
            [field]: e.target.value
        })

        if(field==="severityName"){
            severityNameDropDownData.filter((item)=>{
                if(item.dataValue === e.target.value){
                     setId({
                        ...id,
                        severityId:item.dataID
                     })
                }
            })
        }else if(field==="status"){
            statusDropDown.filter((item)=>{
                if(item.dataValue === e.target.value){
                     setId({
                        ...id,
                        statusID:item.dataID
                     })
                }
            })
        }else if(field==="observableTag"){
            observableTagDropDown.filter((item)=>{
                if(item.dataValue === e.target.value){
                     setId({
                        ...id,
                        observableTagID:item.dataID
                     })
                }
            })
        }
        else if(field==="ownerusername") {
            ldp_security_user.filter((item)=>{
                if(item.name === e.target.value){
                     setId({
                        ...id,
                        ownerUserID:item.userID
                     })
                }
            })
        }
    }
    const notify = (e) =>
        toast.success(e, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
        })
    const notifyFail = (message) => {
        toast.error(message, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
        });
    };
    const onClickUpdate = async () => {
        try {
            const modifiedUserId1 = Number(sessionStorage.getItem('userId'));
            const { orgID, alertID, score, statusID, priorityid, severityId, observableTagID, ownerUserID=1, modifiedUserId = modifiedUserId1, modifiedDate } = row;

            const data = {
                orgID,
                severityId: Number(id.severityId),
                alertId: alertID,
                priorityId: priorityid,
                statusId: id.statusID,
                observableTagId: id.observableTagID,
                ownerUserId: id.ownerUserID,
                modifiedUserId,
                modifiedDate,
                score
            };
            const response = await fetchUpdateAlert(data);
            console.log(response);
            if (response.isSuccess) {
                notify('table Updated')
                onClose();
                onTableRefresh();
            } else {
                notifyFail('table not Updated')
            }
        } catch (error) {
            console.log(error);
        }

    };

    return (
        <div>
            <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Alert PopUp</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='row mb-2'>

                            <Form.Label className="col-md-3">Severity :</Form.Label>
                            <div className="col-md-9">
                                <select
                                    className='form-select form-select-solid'
                                    data-kt-select2='true'
                                    data-placeholder='Select option'
                                    data-dropdown-parent='#kt_menu_637dc885a14bb'
                                    data-allow-clear='true'
                                    value={severityName}
                                    onChange={(e) => handleChange(e, 'severityName')}
                                >
                                    <option value="">Select</option>
                                    {severityNameDropDownData.length > 0 &&
                                        severityNameDropDownData.map((item) => (
                                            <option key={item.dataID} value={item.dataValue}>
                                                {item.dataValue}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </Form.Group>
                        <Form.Group className='row mb-2'>
                            <Form.Label className="col-md-3">Status :</Form.Label>
                            <div className="col-md-9">
                                <select
                                    className='form-select form-select-solid'
                                    data-kt-select2='true'
                                    data-placeholder='Select option'
                                    data-dropdown-parent='#kt_menu_637dc885a14bb'
                                    data-allow-clear='true'
                                    value={status}
                                    onChange={(e) => handleChange(e, 'status')}
                                >
                                    <option value="">Select</option>
                                    {statusDropDown.length > 0 &&
                                        statusDropDown.map((item) => (
                                            <option key={item.dataID} value={item.dataValue}>
                                                {item.dataValue}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </Form.Group>
                        <Form.Group className='row mb-2'>
                            <Form.Label className="col-md-3">Observables tags:</Form.Label>
                            <div className="col-md-9">
                                <select
                                    className='form-select form-select-solid'
                                    data-kt-select2='true'
                                    data-placeholder='Select option'
                                    data-dropdown-parent='#kt_menu_637dc885a14bb'
                                    data-allow-clear='true'
                                    value={observableTag}
                                    onChange={(e) => handleChange(e, 'observableTag')}
                                >
                                    <option value="">Select</option>
                                    {observableTagDropDown.length > 0 &&
                                        observableTagDropDown.map((item) => (
                                            <option key={item.dataID} value={item.dataValue}>
                                                {item.dataValue}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </Form.Group>
                        <Form.Group className='row mb-2'>
                            <Form.Label className="col-md-3">Owner :</Form.Label>
                            <div className="col-md-9">
                                <select
                                    className='form-select form-select-solid'
                                    data-kt-select2='true'
                                    data-placeholder='Select option'
                                    data-dropdown-parent='#kt_menu_637dc885a14bb'
                                    data-allow-clear='true'
                                    value={ownerusername}
                                    onChange={(e) => handleChange(e, 'ownerusername')}
                                >
                                    <option value="">Select</option>
                                    {ldp_security_user.length > 0 &&
                                        ldp_security_user.map((item) => {
                                            return (
                                                <option key={item.userID} value={item?.name}>
                                                    {item?.name}
                                                </option>
                                            )
                                        })}
                                </select>
                            </div>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">Alert Name :</Form.Label>
                            <div className="col-md-9">{name}</div>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">Score :</Form.Label>
                            <div className="col-md-9">{score}</div>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">SLA : </Form.Label>
                            <div className="col-md-9">{sla}</div>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">Detected Date/Time :</Form.Label>
                            <div className="col-md-9">{detectedtime}</div>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">Source Name :</Form.Label>
                            <div className="col-md-9">{source}</div>
                        </Form.Group>
                        <br />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={onClose}>
                        Close
                    </Button>
                    <Button variant='primary' onClick={onClickUpdate}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}
export default EditAlertsPopUp;