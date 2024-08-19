import React, {useEffect, useState} from 'react'
import {Modal, Button, DropdownButton, Dropdown} from 'react-bootstrap'
import {fetchGroupActionUrl, fetchGroupsUrl} from '../../../../../api/SentinalApi'
import {notify, notifyFail} from '../components/notification/Notification'

const MoveToGroupModal = ({show, handleClose, items, selectedActionId, refreshData}) => {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const siteId = sessionStorage.getItem('siteId')
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedGroupName, setSelectedGroupName] = useState('Select Group')

  const fetchGroups = async () => {
    try {
      const data = {
        orgId: orgId,
        siteId: siteId,
      }
      const response = await fetchGroupsUrl(data)
      setGroups(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  const sendSelectedItemsToBackend = async () => {
    const endPointsData = items.map((item) => ({
      agentIds: item.id,
      accountIds: item.accountId,
      groupIds: item.groupId,
      siteIds: item.siteId,
    }))

    const payload = {
      orgId,
      toolId,
      actionId: selectedActionId,
      groupId: selectedGroup,
      endPointsData,
      executedUserId: Number(sessionStorage.getItem('userId')),
      executedDate: new Date().toISOString(),
    }
    try {
      const response = await fetchGroupActionUrl(payload)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        refreshData()
        handleClose()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSave = () => {
    if (!selectedGroup) {
      notifyFail('Please select a group.')
      return
    }
    sendSelectedItemsToBackend()
  }

  const handleSelect = (groupId, groupName) => {
    setSelectedGroup(groupId)
    setSelectedGroupName(groupName)
  }

  return (
    <Modal show={show} onHide={handleClose} className='application-modal small-modal border-0'>
      <Modal.Header closeButton>
        <Modal.Title>Move Endpoint to Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Select a new Group for this endpoint:</p>
        <DropdownButton id='dropdown-basic-button' title={selectedGroupName}>
          <Dropdown.Item
            key='select-option'
            onClick={() => handleSelect(null, 'Select Group')}
          >
            Select Group
          </Dropdown.Item>
          {groups.map((group) => (
            <Dropdown.Item key={group.id} onClick={() => handleSelect(group.id, group.name)}>
              {group.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <p className='mt-5 pt-3'>You can move endpoints to a Manual or Pinned Group.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={handleSave}>
          Save
        </Button>
        <Button variant='secondary' onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MoveToGroupModal
