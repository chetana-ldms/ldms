import React, {useEffect, useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {fetchToolMasterDataUrl} from '../../../../../api/ConfigurationApi'
import {useErrorBoundary} from 'react-error-boundary'

const MapUserPopup = ({show, onClose, selectedTool, selectedDataType, onImport}) => {
  console.log(selectedDataType, 'selectedDataType')
  const [toolMasterData, setToolMasterData] = useState([])
  console.log(toolMasterData, 'toolMasterData')
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const {showBoundary} = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedTool || !show) return

      const data = {
        orgId,
        toolId: selectedTool,
        masterDataType: selectedDataType || 'user',
      }

      try {
        const res = await fetchToolMasterDataUrl(data)
        setToolMasterData(res?.data)
      } catch (error) {
        showBoundary(error)
      }
    }

    fetchData()
  }, [selectedTool, show, orgId, selectedDataType])

  const handleImport = () => {
    if (selectedItem) {
      onImport(selectedItem)
      onClose()
    }
  }
const filteredData = (toolMasterData || []).filter((item) =>
  item?.dataValue?.toLowerCase().includes(searchTerm.toLowerCase())
)

  return (
    <Modal show={show} onHide={onClose} className='addANoteModal application-modal'>
      <Modal.Header closeButton>
        <Modal.Title>{selectedDataType ? 'Map Data Value' : 'Map User Details'}</Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-3'>
          <input
            type='text'
            className='form-control'
            placeholder='Search by Data Value...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredData.length > 0 ? (
          <ul className='list-unstyled'>
            {filteredData.map((item, index) => (
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
                          <strong>{selectedDataType ? 'Map Data Value' : 'Map User Name'} :</strong>{' '}
                          {item.dataValue}
                        </span>
                        <span>
                          <strong>{selectedDataType ? 'Map Data ID' : 'Map User ID'} :</strong>{' '}
                          <span className='text-muted'>{item.dataId}</span>
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Data Found.</p>
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
