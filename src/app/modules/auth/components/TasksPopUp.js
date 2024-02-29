
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TasksPopUp = ({ showModal, setShowModal, navigateToDashboard  }) => {
    const handleClose = () => {
        setShowModal(false);
        navigateToDashboard();
      };
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Here some important tasks are pending from you!!!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center">
        <Link to='/qradar/tasks/list'>
          <Button>Click Here</Button>
        </Link>
      </Modal.Body>
    </Modal>
  );
};

export default TasksPopUp;
