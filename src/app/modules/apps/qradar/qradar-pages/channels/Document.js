import React, { useState, useEffect } from "react";
import { fetchSubItemsByOrgChannel } from "../../../../../api/ChannelApi";
import { Modal, Button, Form } from "react-bootstrap";

const Document = ({ channelId, channelName }) => {
  const [channelSubItems, setChannelSubItems] = useState(null);
  const [error, setError] = useState(null);
  const [uploadDocumentModal, setUploadDocumentModal] = useState(false);

  useEffect(() => {
    const orgId = Number(sessionStorage.getItem("orgId"));
    const data = { channelId, orgId };

    fetchSubItemsByOrgChannel(data)
      .then((channelSubItems) => {
        setChannelSubItems(channelSubItems);
      })
      .catch((error) => {
        console.log(error);
        setError("Error occurred while fetching channel sub-item data");
      });
  }, [channelId]);

  return (
    <div>
      <div className="clearfix">
        <p className="float-left channel-heading">
          <strong>{channelName}</strong>
        </p>
        <button
          className="float-right btn btn-channel btn-primary"
          onClick={() => setUploadDocumentModal(true)}
        >
          Upload Document
        </button>
      </div>
      {error ? (
        <p>Error occurred while fetching data</p>
      ) : (
        <ul className="channel-report">
          {channelSubItems !== null ? (
            channelSubItems.length > 0 ? (
              channelSubItems.map((subItem) => (
                <li
                  className="report-files mb-2"
                  key={subItem.channelSubItemId}
                >
                  <label>
                    <a
                      className="doc-section"
                      href={subItem.documentUrl}
                      download="Document"
                    >
                      <i className="far fa-file-pdf" />{" "}
                      <span className="text-blue">
                        {subItem.channelSubItemName} Report{" "}
                      </span>
                    </a>
                  </label>
                  <button className="btn btn-new">
                    <a href={subItem.documentUrl} download="Document">
                      <i className="fas fa-download"></i>
                    </a>
                  </button>
                </li>
              ))
            ) : (
              <li>Loading...</li>
            )
          ) : null}
        </ul>
      )}
      {/* Upload Document Modak */}
      <Modal
        show={uploadDocumentModal}
        onHide={() => setUploadDocumentModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload a Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Document upload</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Form>
          <p className="text-muted mt-5 mb-0">Max. size limit 20MB</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary btn-small"
            onClick={() => setUploadDocumentModal(false)}
          >
            Close
          </Button>
          <Button variant="primary btn-small">Upload</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Document;
