import React, {useEffect, useState} from 'react'
import {Modal, Button, Spinner} from 'react-bootstrap'
import Select from 'react-select'
import {
  fetchMessagePlaceHolderGroupsUrl,
  fetchMessagePlaceholdersUrl,
} from '../../../../../../api/MessageTemplateApi'
import {notifyFail} from '../notification/Notification'

const PlaceholdersModal = ({show, onHide, onSelect}) => {
  const [placeholders, setPlaceholders] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedPlaceholders, setSelectedPlaceholders] = useState([])

  const orgId = Number(sessionStorage.getItem('orgId')) || 0

  const customSelectStyle = {
    control: (provided) => ({
      ...provided,
      minHeight: '36px',
      fontSize: '0.9rem',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  }

  useEffect(() => {
    if (show) {
      loadGroups()
      loadPlaceholders()
      setSelectedPlaceholders([]) // reset on open
    }
  }, [show])

  const loadGroups = async () => {
    try {
      const res = await fetchMessagePlaceHolderGroupsUrl(0)
      setGroups(Array.isArray(res?.data) ? res.data : [])
    } catch (err) {
      console.error('Failed to load groups', err)
    }
  }

  const groupOptions = groups.map((g) => ({
    label: g.displayName,
    value: g.templateGroupId,
    masterId: g.masterId,
  }))

  const loadPlaceholders = async () => {
    setLoading(true)
    try {
      const payload = {
        orgId,
        toolId: 0, // not used
        templateId: 0,
        placeholderId: 0,
        placeholdergroupid: selectedGroup?.masterId || 0,
        searchText: search || '',
      }

      const response = await fetchMessagePlaceholdersUrl(payload)
      if (response?.isSuccess && Array.isArray(response?.placeholders)) {
        setPlaceholders(response.placeholders)
      } else {
        setPlaceholders([])
        notifyFail(response?.message || 'No placeholders found')
      }
    } catch (err) {
      console.error('Failed to load placeholders:', err)
      notifyFail('Failed to load placeholders')
      setPlaceholders([])
    } finally {
      setLoading(false)
    }
  }

  const reload = () => loadPlaceholders()

  const addPlaceholder = (ph) => {
    setSelectedPlaceholders((prev) => [
      ...prev,
      {
        placeholderText: ph.placeholderText,
        placeholderId: ph.placeholderId,
        ...ph,
      },
    ])
  }

  const removePlaceholder = (index) => {
    setSelectedPlaceholders((prev) => prev.filter((_, i) => i !== index))
  }

  const handleConfirm = () => {
    onSelect(selectedPlaceholders)
    onHide()
  }

  return (
    <Modal
      backdrop='static'
      keyboard={false}
      show={show}
      onHide={onHide}
      className='selectPlaceholders application-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title className='fw-semibold'>Placeholders</Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>

      <Modal.Body style={{maxHeight: '70vh', overflowY: 'auto'}}>
        {/* 🔍 Filter Row */}
        <div className='row align-items-center mb-2 mt-1'>
          <div className='col-md-8 mb-2'>
            <input
              type='text'
              className='form-control'
              placeholder='Search Placeholder...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className='col-md-3 mb-2'>
            <Select
              options={groupOptions}
              value={selectedGroup}
              onChange={setSelectedGroup}
              isClearable
              placeholder='Select Group'
              styles={customSelectStyle}
            />
          </div>

          <div className='col-md-1 text-end'>
            <button type='button' className='btn btn-primary sm' onClick={reload}>
              <i className='fa fa-search me-1'></i>
            </button>
          </div>
        </div>

        {/* Placeholder Buttons */}
        {loading ? (
          <div
            className='d-flex justify-content-center align-items-center'
            style={{height: '200px'}}
          >
            <Spinner animation='border' variant='primary' />
          </div>
        ) : placeholders.length > 0 ? (
          <div className='d-flex flex-wrap gap-2 mb-3'>
            {placeholders.map((ph) => (
              <Button
                key={`${ph.placeholderId}-${Math.random()}`} // allow multiple selection
                variant='outline-secondary'
                size='sm'
                className='rounded-pill text-truncate'
                style={{maxWidth: '200px', fontSize: '0.85rem'}}
                onClick={() => addPlaceholder(ph)}
              >
                {ph.placeholderText}
              </Button>
            ))}
          </div>
        ) : (
          <div className='text-center text-muted py-3'>No placeholders found</div>
        )}

        {/* Selected Placeholders */}
        {selectedPlaceholders.length > 0 && (
          <div className='mt-2'>
            <label className='form-label fw-bold'>Selected Placeholders:</label>
            <div className='d-flex flex-wrap gap-2'>
              {selectedPlaceholders.map((ph, index) => (
                <span
                  key={index}
                  className='badge bg-primary rounded-pill d-flex align-items-center'
                >
                  {ph.placeholderText}
                  <i
                    className='fa fa-times ms-2'
                    style={{cursor: 'pointer'}}
                    onClick={() => removePlaceholder(index)}
                  ></i>
                </span>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Cancel
        </Button>
        <Button variant='primary' onClick={handleConfirm}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PlaceholdersModal
