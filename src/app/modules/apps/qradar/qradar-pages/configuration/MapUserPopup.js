import React, {useEffect, useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {fetchToolMasterDataUrl} from '../../../../../api/ConfigurationApi'
import {useErrorBoundary} from 'react-error-boundary'

const MapUserPopup = ({show, onClose, selectedTool, selectedDataType, onImport}) => {
    console.log(selectedDataType?.value, "selectedDataType")
  const [toolMasterData, setToolMasterData] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const {showBoundary} = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedTool || !show) return;
  
      const data = {
        orgId,
        toolId: selectedTool,
        masterDataType: selectedDataType?.value || 'user',
      };
  
      try {
        const res = await fetchToolMasterDataUrl(data);
        setToolMasterData(res?.data);
      } catch (error) {
        showBoundary(error);
      }
    };
  
    fetchData();
  }, [selectedTool, show, orgId, selectedDataType?.value]);
  

  const handleImport = () => {
    if (selectedItem) {
      onImport(selectedItem)
      onClose()
    }
  }

  return (
    <Modal show={show} onHide={onClose} className='addANoteModal application-modal'>
      <Modal.Header closeButton>
        <Modal.Title>Map User Details</Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        {toolMasterData !==null ? (
          <ul className='list-unstyled'>
            {toolMasterData.map((item, index) => (
              <li key={index} className='mb-3'>
                <div className='card p-3 shadow-sm'>
                  <div className='form-check'>
                    <input
                      className='form-check-input me-2 mt-4'
                      type='radio'
                      name='userMapping'
                      value={item.dataId}
                      onChange={() => setSelectedItem(item)}
                      checked={selectedItem?.dataId === item.dataId}
                      id={`radio-${item.dataId}`}
                    />
                    <label className='form-check-label w-100' htmlFor={`radio-${item.dataId}`}>
                      <div className='d-flex flex-column'>
                        <span>
                          <strong>Map User Name :</strong> {item.dataValue}
                        </span>
                        <span>
                          <strong>Map User ID :</strong> <span className='text-muted'>{item.dataId}</span>
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found for this tool.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          Close
        </Button>
        <Button variant='primary' onClick={handleImport} disabled={!selectedItem}>
          Map
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MapUserPopup
