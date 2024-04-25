import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const TasksPopUp = ({ showModal, setShowModal, navigateToDashboard }) => {
  const handleClose = () => {
    setShowModal(false);
    navigateToDashboard();
  };
  const handleButtonClick = () => {
    sessionStorage.setItem("clickedButton", "true");
  };
  return (
    <Modal className="modal-small" show={showModal} onHide={handleClose}>
      <Modal.Header closeButton className="border-0">
        {/* <Modal.Title>Here some important tasks are pending from you!!!</Modal.Title> */}
      </Modal.Header>
      <Modal.Body className="text-center no-pad">
        <p className="fs-15">
          You have some significant tasks that require your immediate
          attention!!!
        </p>
        <br />
        <Link to="/qradar/tasks/list">
          <Button onClick={handleButtonClick} className="btn-login w-100">
            Click Here
          </Button>
        </Link>
      </Modal.Body>
    </Modal>
  );
};

export default TasksPopUp;
