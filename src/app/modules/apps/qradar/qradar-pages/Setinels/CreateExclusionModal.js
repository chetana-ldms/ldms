import React, {useState, useRef, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {notify, notifyFail} from '../components/notification/Notification'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import {fetchAddToExclusionListUrl} from '../../../../../api/SentinalApi'

const CreateExclusionModal = ({show, onClose, refreshParent}) => {
  const osDropdownRef = useRef(null)
  const descriptionTextareaRef = useRef(null)
  const sha1InputRef = useRef(null)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const createdDate = new Date().toISOString()
  const createdUserId = Number(sessionStorage.getItem('userId'))
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState('Hash')
  const [includeSubfolders, setIncludeSubfolders] = useState(false)
  const [changeEnabled, setChangeEnabled] = useState(false)
  const handleSubmit = async () => {
    try {
      if (!osDropdownRef.current.value || !sha1InputRef.current.value) {
        notifyFail('Please fill out all mandatory fields.')
        return
      }

      const data = {
        orgID: orgId,
        osType: osDropdownRef.current.value,
        value: sha1InputRef.current.value,
        description: descriptionTextareaRef.current.value,
        source: '',
        createdDate: createdDate,
        createdUserId: createdUserId,
        note: 'string',
        targetScope: 'Group',
        pathExclusionType: '',
        externelTicketId: 'string',
        mode: 'string',
        type: 'string',
      }
      const responseData = await fetchAddToExclusionListUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        onClose()
        refreshParent()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.error('Error during API call:', error)
    }
  }
  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen)
  }
  const handleDropdownItemClick = (value) => {
    setSelectedValue(value)
    setDropdownOpen(false)
  }
  const handleToggleChange = () => {
    if (changeEnabled) {
      setIncludeSubfolders(!includeSubfolders)
    }
  }

  const handleToggleEnabled = () => {
    setChangeEnabled(!changeEnabled)
  }

  return (
    <Modal show={show} onHide={onClose} className='AddToExclusionsModal'>
      <Modal.Header closeButton>
        <Modal.Title>New Exclusions</Modal.Title>
      </Modal.Header>
      <Modal.Body className='header-filter'>
        <div className='mb-2 fs-12 d-flex align-items-center'>
          <label className='semi-bold me-2'>Exclusions Type:</label>
          <Dropdown isOpen={dropdownOpen} toggle={handleDropdownToggle}>
            <DropdownToggle className='no-pad btn btn-new btn-small'>
              {selectedValue}
            </DropdownToggle>
            <DropdownMenu className='w-auto'>
              <DropdownItem onClick={() => handleDropdownItemClick('Hash')} className='border-btm'>
                Hash
              </DropdownItem>
              <DropdownItem onClick={() => handleDropdownItemClick('Path')}>Path</DropdownItem>
              <DropdownItem onClick={() => handleDropdownItemClick('Certificate')}>
                Certificate
              </DropdownItem>
              <DropdownItem onClick={() => handleDropdownItemClick('File Type')}>
                File Type
              </DropdownItem>
              <DropdownItem onClick={() => handleDropdownItemClick('Browser')}>
                Browser
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className='row'>
          <div className='col-md-6'>
            <label htmlFor='osInput' className='form-label'>
              OS*
            </label>
            <select className='form-select' id='osInput' ref={osDropdownRef} required>
              <option value=''>Select</option>
              <option value='windows'>Windows</option>
              <option value='macos'>MacOS</option>
              <option value='linux'>Linux</option>
            </select>
          </div>
        </div>
        <div className='row mt-5'>
          <div className='col-md-9'>
            <div>
              <label className='form-label' htmlFor='sha1Input'>
                SHA1*
              </label>
              <input type='text' className='form-control' ref={sha1InputRef} required />
            </div>
          </div>
          <div className='col-md-3  text-primary d-flex align-items-end justify-content-end pb-3 '>
            <i className='bi bi-search text-primary mr-2'></i> Threat
          </div>
        </div>
        <div className='row mt-5'>
          <div className='col-md-9'>
            <div>
              <label className='form-label' htmlFor='sha1Input'>
                Path*
              </label>
              <input
                type='text'
                className='form-control'
                placeholder='Example: /bin/file or /bin/'
                ref={sha1InputRef}
                required
              />
            </div>
            <div>
              <div className=''>
                <span>As File</span>&nbsp;
                <span onClick={handleToggleEnabled} style={{cursor: 'pointer'}}>
                  Change
                </span>
              </div>
              <div>
                <input
                  type='checkbox'
                  checked={includeSubfolders}
                  onChange={handleToggleChange}
                  disabled={!changeEnabled}
                />
                <label>Include Subfolders</label>
              </div>
            </div>
            <hr />
            <div>
              <p>Exclusion Function</p>
              <div>
                <input type='checkbox' />
                <label>Exclude path for alerts and mitigation</label>
              </div>
              <p>
                The selected Exclusion Mode (Suppress Alerts, Interoperability, or Performance
                Focus) applies to files in the path
              </p>
              <div>
                <input type='checkbox' />
                <label>Exclude path for Binary Vault</label>
              </div>
              <p>Files in the path are not uploaded automatically</p>
            </div>
          </div>
        </div>
        <div className='mt-5'>
          <label className='form-label'>Description</label>
          <textarea
            ref={descriptionTextareaRef}
            rows='1'
            className='form-control'
            placeholder='Add Description or Leave empty'
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='btn btn-small btn-secondary' onClick={onClose}>
          Close
        </Button>
        <Button variant='btn btn-new btn-small' onClick={handleSubmit}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateExclusionModal
