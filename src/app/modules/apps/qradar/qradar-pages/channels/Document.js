import React, { useState, useEffect } from "react";
import {
  fetchDelete,
  fetchFilesDownloadUrl,
  fetchGetUploadedFilesListByChannelId,
  fetchUpload,
} from "../../../../../api/ChannelApi";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { notify, notifyFail } from "../components/notification/Notification";
import "react-toastify/dist/ReactToastify.css";
import { useErrorBoundary } from "react-error-boundary";
import DeleteConfirmation from "../../../../../../utils/DeleteConfirmation";

const Document = ({ channelId, channelName }) => {
  const handleError = useErrorBoundary();
  const CreatedUserId = Number(sessionStorage.getItem("userId"));
  const orgId = Number(sessionStorage.getItem("orgId"));
  const date = new Date().toISOString();
  const [documents, setDocuments] = useState(null);
  console.log(documents, "documents");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploadDocumentModal, setUploadDocumentModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = async (channelId) => {
    try {
      const response = await fetchGetUploadedFilesListByChannelId(channelId);
      setDocuments(response);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchData(channelId);
  }, [channelId]);

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile); // Provide a key for the file

      formData.append("CreatedUserId", CreatedUserId);
      formData.append("date", date);
      formData.append("orgId", orgId);
      formData.append("channelId", channelId);

      try {
        const response = await fetchUpload(formData);
        if (response.isSuccess) {
          notify("File updated successfully");
        } else {
          notifyFail("Failed to update file");
        }
        setUploadDocumentModal(false);
        fetchData(channelId);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      const data = {
        orgId: Number(sessionStorage.getItem('orgId')),
        channelId: channelId,
        subitemId: 0,
        deletedUserId: Number(sessionStorage.getItem("userId")),
        deletedDate: new Date().toISOString(),
        fileId: itemToDelete.fileId
      }

      try {
        const response = await fetchDelete(data);
        const {isSuccess, message} = response
        if (isSuccess) {
          notify(message);
          await fetchData(channelId);
        } else {
          notifyFail(message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setShowConfirmation(false);
        setItemToDelete(null);
      }
    }
  };
  const cancelDelete = () => {
    setShowConfirmation(false);
    setItemToDelete(null);
  };
  // const handleDownload = async (item) => {
  //   try {
  //     const data = {
  //       orgId: Number(sessionStorage.getItem('orgId')),
  //       channelId: channelId,
  //       subitemId: 0,
  //       downloadedUserId: Number(sessionStorage.getItem("userId")),
  //       downloadedDate: new Date().toISOString(),
  //       fileId: item.fileId
  //     }
  //     const response = await fetchFilesDownloadUrl(data);
  //     if (response.ok) {
  //       const fileBlob = await response.blob();
  //       const url = URL.createObjectURL(fileBlob);
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.download = item.fileName;
  //       link.target = "_blank";
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       notify("File downloaded successfully");
  //     } else {
  //       notifyFail("File not downloaded");
  //     }
  //   } catch (error) {
  //     handleError(error);
  //     notifyFail("Error occurred while downloading the file");
  //   }
  // };
  const handleDownload = async (item) => {
    try {
      const response = await fetchFilesDownloadUrl(item.fileId, CreatedUserId, orgId, channelId);
      if (response.ok) {
        const fileBlob = await response.blob();
        const url = URL.createObjectURL(fileBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = item.fileName;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notify("File downloaded successfully");
      } else {
        notifyFail("File not downloaded");
      }
    } catch (error) {
      handleError(error);
      notifyFail("Error occurred while downloading the file");
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
          disabled={CreatedUserId !== 1}
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
                <li className="report-files mb-2" key={item.channelId}>
                  <label>
                    <a
                      className="doc-section"
                      href={item.fileUrl}
                      download="Document"
                    >
                      <i className="far fa-file-pdf" />{" "}
                      <span className="text-blue">{item.fileName} Report </span>
                    </a>
                  </label>
                  <button className="btn btn-new">
                    <a
                      href={item.filePhysicalPath}
                      download="Document"
                      onClick={() => {
                        handleDownload(item);
                      }}
                    >
                      <i className="fas fa-download"></i>
                    </a>
                  </button>
                  <button
                    className="btn btn-danger btn-delete ms-3"
                    onClick={() => {
                      handleDelete(item);
                    }}
                    disabled={CreatedUserId !== 1}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                  
              {showConfirmation && (
                <DeleteConfirmation
                  show={showConfirmation}
                  onConfirm={confirmDelete}
                  onCancel={cancelDelete}
                />
              )}
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
        className="application-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload a Document</Modal.Title>
          <button
            type="button"
            class="application-modal-close"
            aria-label="Close"
          >
            <i className="fa fa-close" />
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form className="form-section">
            <Form.Group>
              <Form.Label>Document upload</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
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
          <Button variant="primary btn-small btn-new" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Document;
