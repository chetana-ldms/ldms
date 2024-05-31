import React, {useState, useEffect, useRef} from 'react'
import {
  fetchChannelsCreateUrl,
  fetchSubItemsByOrgChannel,
  fetchlistUrl,
} from '../../../../../api/ChannelApi'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'

const Reports = ({channelId, channelName}) => {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [channelSubItems, setChannelSubItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [teamsList, setTeamsList] = useState([])
  console.log(teamsList, 'teamsList')
  const [error, setError] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState)
  const dropdownRef = useRef(null)
  const teamSelectRef = useRef(null)

  const [modalOpen, setModalOpen] = useState(false)
  const openModal = () => {
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  useEffect(() => {
    const orgId = Number(sessionStorage.getItem('orgId'))
    const data = {channelId, orgId}

    fetchSubItemsByOrgChannel(data)
      .then((subItems) => {
        setChannelSubItems(subItems)
      })
      .catch((error) => {
        console.log(error)
        setError('Error occurred while fetching channel sub-item data')
      })
  }, [channelId])

  const handleItemCheckboxChange = (subItemId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(subItemId)) {
        return prevSelectedItems.filter((id) => id !== subItemId)
      } else {
        return [...prevSelectedItems, subItemId]
      }
    })
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchlistUrl(orgId)
        setTeamsList(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])
  const handleFormSubmit = (event) => {
    event.preventDefault()
    const selectedTeamId = teamSelectRef.current.value
    const data = {
      teamsId: Number(selectedTeamId),
      channelId: channelId,
    }
    fetchChannelsCreateUrl(data).catch((error) => {
      console.error(error)
    })
  }
  return (
    <div>
      <div className='clearfix'>
        <p className='float-left channel-heading'>
          <strong>{channelName}</strong>
        </p>
        {/* Microsoft teams integration (hidden for now) */}
        <div className='float-right teams-channel hidden'>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} innerRef={dropdownRef}>
            <DropdownToggle caret>
              Teams <img alt='Logo' src={toAbsoluteUrl('/media/icons/teams-icon.png')} width='20' />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={openModal}>Add Channel in Teams</DropdownItem>
              <DropdownItem>Share File to Teams</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {error ? (
        <p>Error occurred while fetching data</p>
      ) : (
        <div className='channel-report'>
          {/* Generate Report */}
          <div className='generate-report'>
            {channelSubItems !== null? (
              channelSubItems?.map((subItem) => (
                <div className='report-files mb-2' key={subItem.channelSubItemId}>
                  <label>
                    <input
                      type='checkbox'
                      checked={selectedItems.includes(subItem.channelSubItemId)}
                      onChange={() => handleItemCheckboxChange(subItem.channelSubItemId)}
                    />
                    <a className='doc-section'  download='Document'>
                      <i className='far fa-file-pdf' />{' '}
                      <span className='text-blue'>{subItem.channelSubItemName} Report</span>
                    </a>
                  </label>
                  {/* Download Report - show download icon once report is available for download */}
                  <button className='btn btn-new hidden '>
                    <a href={subItem.documentUrl} download='Document'>
                      <i className='fas fa-download'></i>
                    </a>
                  </button>
                </div>
              ))
            ) : (
              <div>No Data found</div>
            )}
            {/* <button className='btn btn-new btn-primary btn-small mt-5'>Generate Report</button> */}
          </div>
        </div>
      )}
      {/* Add channels in teams modal */}
      <Modal isOpen={modalOpen} toggle={closeModal} className='teams-modal'>
        <ModalHeader toggle={closeModal}>Add Channel in Teams</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label htmlFor='teamSelect'>Select Team:</label>
            <select id='teamSelect' className='form-select form-select-solid' ref={teamSelectRef}>
              <option value=''>Select a team</option>
              {teamsList
                ? teamsList.map((team) => (
                    <option key={team.teamId} value={team.teamId}>
                      {team.teamName}
                    </option>
                  ))
                : null}
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary btn-small' onClick={handleFormSubmit}>
            Submit
          </button>
          <button className='btn btn-secondary btn-small' onClick={closeModal}>
            Close
          </button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default Reports
