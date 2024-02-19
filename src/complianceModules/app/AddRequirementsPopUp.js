import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AddRequirementsPopUp = ({ showSecondModal, setShowSecondModal }) => {
  // Sample JSON data
  const requirements = [
    {
      id: 'AC-02-01',
      description: ' Automated system Account Management',
    }, 
    {
      id: 'AC-02-03',
      description: ' Automated system Account Management',
    },
    {
      id: 'AC-02-04',
      description: ' Automated system Account Management',
    },
    {
      id: 'AC-02-05',
      description: ' Automated system Account Management',
    },
    {
      id: 'AC-02-06',
      description: ' Automated system Account Management',
    },
  ];

  return (
    <Modal show={showSecondModal} onHide={() => setShowSecondModal(false)}>
      <Modal.Header closeButton className='bg-secondary text-light'>
        <Modal.Title>
          <p>Map NIST SP 800-53 Requirements</p> <p>0 Requirements selected</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-secondary'>
        <div className=' p-3'>
          <input type='text' placeholder='Search by requirement name...' style={{ width: '100%' }} />
          {requirements.map((requirement, index) => (
            <div key={index} className='d-flex align-items-center mt-3 bg-secondary border-bottom '>
              <input type='checkbox' className='me-2' />
              <div>
                <p className='mb-0'>{requirement.id}</p>
                <p className='mb-0'>Account Management:{requirement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className='bg-secondary'>
        <Button variant='primary' onClick={() => setShowSecondModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRequirementsPopUp;
