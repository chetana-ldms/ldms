import { Modal, Button } from "react-bootstrap";

const AddFromExclusionsCatalogModal = ({ show, handleClose }) => {
  return (
    <Modal className="application-modal" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add From Exclusions Catalog </Modal.Title>
        <button
          type="button"
          class="application-modal-close"
          aria-label="Close"
        >
          <i className="fa fa-close" />
        </button>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddFromExclusionsCatalogModal;
