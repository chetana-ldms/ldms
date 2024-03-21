
import { Modal, Button } from 'react-bootstrap';

const AddFromExclusionsCatalogModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add From Exclusions Catalog </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddFromExclusionsCatalogModal;
