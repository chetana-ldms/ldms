import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { notify, notifyFail } from "../components/notification/Notification";
import { fetchAddToblockListUrl } from "../../../../../api/SentinalApi";

const BlockListEditPopup = ({ show, onClose, refreshParent, selectedItem }) => {
    console.log(selectedItem, "selectedItem");
    const osDropdownRef = useRef(null);
    const descriptionTextareaRef = useRef(null);
    const sha1InputRef = useRef(null);
    const orgId = Number(sessionStorage.getItem("orgId"));
    const createdDate = new Date().toISOString();
    const createdUserId = Number(sessionStorage.getItem('userId'));

    const [osValue, setOsValue] = useState("");
    const [discValue, setDiscValue] = useState("");

    const handleOsChange = (event) => {
        const osValue = event.target.value;
        setOsValue(osValue);
    };

    const handleDescriptionChange = (event) => {
        const discValue = event.target.value;
        setDiscValue(discValue);
    };

    const handleSubmit = async () => {
        try {
            if (!osDropdownRef.current.value) {
                notifyFail("Please fill out all mandatory fields.");
                return;
            }

            const data = {
                orgID: orgId,
                osType: osValue || selectedItem?.osType,
                value: sha1InputRef.current.value,
                description: discValue || selectedItem?.description,
                source: "",
                createdDate: createdDate,
                createdUserId: createdUserId,
                groupId: "1924063617266855450",
                siteId: "1924063617241689625",
                accountId: "1924063616109227261"
            };
            const responseData = await fetchAddToblockListUrl(data);
            const { isSuccess, message } = responseData;

            if (isSuccess) {
                notify(message);
                onClose();
                refreshParent();
            } else {
                notifyFail(message);
            }
        } catch (error) {
            console.error("Error during API call:", error);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onClose}
            className="addToBlockList application-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <div>
                        {" "}
                        <i className="bi bi-shield-slash mr-2 white"></i> Add To Blocklist
                    </div>
                </Modal.Title>
                <button
                    type="button"
                    className="application-modal-close"
                    aria-label="Close"
                >
                    <i className="fa fa-close" />
                </button>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-5">
                    <b>Blacklist Type : </b> Hash
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="osInput" className="form-label">
                            OS*
                        </label>
                        <select className="form-select" id="osInput" ref={osDropdownRef} onChange={handleOsChange} value={selectedItem?.osType} required>
                            <option value="">Select</option>
                            <option value="windows">windows</option>
                            <option value="Mac">Mac</option>
                            <option value="Linux">Linux</option>
                        </select>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-md-6">
                        <div>
                            <label className="form-label" htmlFor="sha1Input">
                                SHA1*
                            </label>
                            <input type="text" className="form-control" ref={sha1InputRef} value={selectedItem?.value} disabled />
                        </div>
                    </div>
                    <div className="col-md-3  text-primary d-flex align-items-end justify-content-end pb-3 ">
                        <i className="bi bi-search text-primary mr-2"></i> Threat
                    </div>
                </div>
                <div className="mt-5">
                    <label className="form-label">Description</label>
                    <textarea
                        ref={descriptionTextareaRef}
                        rows="1"
                        className="form-control"
                        placeholder="Add Description or Leave empty"
                        value={selectedItem?.description}
                        onChange={handleDescriptionChange}
                    ></textarea>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="btn btn-small btn-secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="btn btn-new btn-small" onClick={handleSubmit}>
                    Apply
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BlockListEditPopup;
