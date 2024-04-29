import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function DeleteConfirmation({ show, onConfirm, onCancel }) {
    return (
        <Modal show={show} onHide={onCancel}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    No
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteConfirmation;
