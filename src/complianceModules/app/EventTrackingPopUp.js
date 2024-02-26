import React from 'react'
import { Modal } from 'react-bootstrap';

function EventTrackingPopUp({ showModal, setShowModal }) {
  return (
    <Modal className='modal' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <h2>Audit Event</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Event Details</h4>
        <div>
          <span className='initial'>AR</span> Arunachalam
          <span>arunachalam@lancesoft.com</span>
        </div>
        <br />
        <div>
          <p className='bold no-margin'>Timestamp:</p>
          <p>Feb 14, 2024 @9:30:31 AM</p>
        </div>
        <br />
        <div>
          <p className='bold no-margin'>Description:</p>
          <p>Arunachalam created new evidence.</p>
        </div>
        <br />
        <div>
          <p className='bold no-margin'>Response:</p>
          <p className='link'>Show raw evidence</p>
          <div className='card pad-10 mg-btm-10'>
            <div className='row'>
              <div className='col-lg-8'>
                <p className='bold no-margin'>Raw Evidence and Event Details .pdf</p>
                <p className='no-margin'>
                  Get a .pdf file that contains raw evidence along with event details
                </p>
              </div>
              <div className='col-lg-4'>
                <button className='btn btn-border btn-small float-right'>
                  <i className='fa fa-download link' /> Download
                </button>
              </div>
            </div>
          </div>
          <div className='card pad-10'>
            <div className='row'>
              <div className='col-lg-8'>
                <p className='bold no-margin'>Raw Evidence .txt</p>
                <p className='no-margin'>Get a .txt file that only shows raw evidence</p>
              </div>
              <div className='col-lg-4'>
                <button className='btn btn-border btn-small float-right'>
                  <i className='fa fa-download link' /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div>
          <h4>Notes</h4>
          <p className='no-margin gray'>Add a new message</p>
          <textarea className='form-textarea'></textarea>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default EventTrackingPopUp;
