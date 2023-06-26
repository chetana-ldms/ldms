import React, { useState, useEffect } from "react";
import { fetchDelete, fetchGetUploadedFilesListByChannelId, fetchUpload } from "../../../../../api/ChannelApi";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer } from 'react-toastify'
import { notify, notifyFail } from '../components/notification/Notification'
import 'react-toastify/dist/ReactToastify.css'

const Document = ({ channelId, channelName }) => {
  const userID = Number(sessionStorage.getItem('userId'));
  const orgId = Number(sessionStorage.getItem('orgId'))
  const date = new Date().toISOString();
  const [documents, setDocuments] = useState(null);
  console.log(documents, "documents")
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploadDocumentModal, setUploadDocumentModal] = useState(false);

  const fetchData = async (channelId) => {
    try {
      const response = await fetchGetUploadedFilesListByChannelId(channelId);
      setDocuments(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(channelId);
  }, [channelId]);

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append(selectedFile);
      formData.append(userID);
      formData.append(date);
      formData.append(orgId);
      formData.append(channelId);
      // formData.append('SubitemId', subitemId);

      try {
        const response = await fetchUpload(formData);
        if (response.isSuccess) {
          notify('file update Successfully');
        } else {
          notifyFail("file not update Successfully")
        }
        setUploadDocumentModal(false);
        fetchData(channelId);

      } catch (error) {
        console.log(error)
      }
    }
  };
  const handleDelete = async (item) => {
    const formData = new FormData();
    formData.append('fileId', item.fileId);
  
    try {
      const response = await fetchDelete(formData);
      if (response.isSuccess) {
        notify('File Deleted');
      } else {
        notifyFail('File not Deleted');
      }
      await fetchData(channelId);
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div>
      <ToastContainer />
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
          {documents !== null ? (
            documents.length > 0 ? (
              documents.map((item) => (
                <li
                  className="report-files mb-2"
                  key={item.channelId}
                >
                  <label>
                    <a
                      className="doc-section"
                      href={item.fileUrl}
                      download="Document"
                    >
                      <i className="far fa-file-pdf" />{" "}
                      <span className="text-blue">
                        {item.fileName} Report{" "}
                      </span>
                    </a>
                  </label>
                  <button className="btn btn-new">
                    <a href={item.documentUrl} download="Document">
                      <i className="fas fa-download"></i>
                    </a>
                  </button>
                  <button className="btn btn-danger btn-delete ms-3" onClick={() => { handleDelete(item) }}>
                    <i className="fas fa-trash-alt"></i>
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
              <Form.Control type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
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
          <Button variant="primary btn-small" onClick={handleUpload}>Upload</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Document;
