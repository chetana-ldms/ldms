import {useEffect, useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import Select from 'react-select'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchTagsActionsUrl, fetchTagsUrl} from '../../../../../api/SentinalApi'

const ManageEndpointTagsModal = ({show, handleClose, tags, onSave, id}) => {
  const [tagKey, setTagKey] = useState('')
  const [tagValue, setTagValue] = useState('')
  const [dropdownTags, setDropdownTags] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const fetchDropdownTags = async () => {
    const data = {
      orgId: orgId,
      toolId: toolId,
      includeChildren: true,
      includeParents: true,
      orgAccountStructureLevel: [
        {levelName: 'AccountId', levelValue: accountId || ''},
        {levelName: 'SiteId', levelValue: siteId || ''},
        {levelName: 'GroupId', levelValue: groupId || ''},
      ],
    }
    try {
      const response = await fetchTagsUrl(data)
      setDropdownTags(response?.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchDropdownTags()
  }, [])

  const tagKeyOptions = dropdownTags.map((tag) => ({
    value: tag.key,
    label: tag.key,
  }))

  const tagValueOptions = tagKey
    ? dropdownTags
        .filter((tag) => tag.key === tagKey)
        .map((tag) => ({value: tag.value, label: tag.value}))
    : []
  const handleAddTag = async () => {
    if (tagKey && tagValue) {
      let updatedTags = [...tags]
      let tagId = null

      if (editingIndex !== null) {
        const selectedTag = dropdownTags.find((tag) => tag.key === tagKey && tag.value === tagValue)

        if (selectedTag) {
          tagId = selectedTag.id
          updatedTags[editingIndex] = {...updatedTags[editingIndex], key: tagKey, value: tagValue}
        }
      } else {
        const selectedTag = dropdownTags.find((tag) => tag.key === tagKey && tag.value === tagValue)

        if (selectedTag) {
          tagId = selectedTag.id
          updatedTags.push({key: tagKey, value: tagValue, id: tagId})
        }
      }

      const sentinelEndPointActions = [
        {
          tagId: tagId,
          operation: editingIndex !== null ? 'override' : 'add',
        },
      ]

      const data = {
        orgId,
        toolId,
        agentId: id,
        sentinelEndPointActions,
      }

      try {
        const responseData = await fetchTagsActionsUrl(data)
        const {isSuccess, message} = responseData

        if (isSuccess) {
          notify(message)
          onSave(updatedTags)
        } else {
          notifyFail(message)
        }
      } catch (error) {
        notifyFail('Failed to save changes. Please try again.')
      }

      setTagKey('')
      setTagValue('')
      setEditingIndex(null)
    } else {
      notifyFail('Please select both Tag Key and Tag Value.')
    }
  }

  const handleEdit = (tag, index) => {
    setTagKey(tag.key)
    setTagValue(tag.value)
    setEditingIndex(index)
  }

  const handleDelete = async (index) => {
    const tagToDelete = tags[index]
    const updatedTags = tags.filter((_, i) => i !== index)
    const sentinelEndPointActions = [
      {
        tagId: tagToDelete.id,
        operation: 'remove',
      },
    ]

    const data = {
      orgId,
      toolId,
      agentId: id,
      sentinelEndPointActions,
    }

    try {
      const responseData = await fetchTagsActionsUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        onSave(updatedTags)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      notifyFail('Failed to delete tag. Please try again.')
    }
  }

  return (
    <Modal
      backdrop='static'
      keyboard={false}
      show={show}
      onHide={handleClose}
      className='application-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title>Manage Endpoint Tags</Modal.Title>
        <button type='button' class='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className='d-flex align-items-center mb-4 position-relative'>
          <div className='me-3'>
            <label className='form-label' htmlFor='tagKeyInput'>
              Tag Key*
            </label>
            <Select
              options={tagKeyOptions}
              value={tagKey ? {value: tagKey, label: tagKey} : null}
              onChange={(selectedOption) => setTagKey(selectedOption ? selectedOption.value : '')}
              placeholder='Select Tag Key'
              isClearable
              isDisabled={editingIndex !== null}
            />
          </div>

          <div className='me-3'>
            <label className='form-label' htmlFor='tagValueInput'>
              Tag Value*
            </label>
            <Select
              options={tagValueOptions}
              value={tagValue ? {value: tagValue, label: tagValue} : null}
              onChange={(selectedOption) => setTagValue(selectedOption ? selectedOption.value : '')}
              placeholder='Select Tag Value'
              isClearable
              isDisabled={!tagKey}
            />
          </div>

          <Button variant='success' onClick={handleAddTag}>
            {editingIndex !== null ? 'Save' : 'Add'}
          </Button>
        </div>

        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <tr key={index}>
                  <td>{tag.key}</td>
                  <td>{tag.value}</td>
                  <td>
                    <span onClick={() => handleEdit(tag, index)} title='Edit'>
                      <i className='fa fa-pencil cursor link' />
                    </span>
                    <span className='ms-8' onClick={() => handleDelete(index)} title='Delete'>
                      <i className='fa fa-trash cursor red' />
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='3'>No tags available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Modal.Body>
    </Modal>
  )
}

export default ManageEndpointTagsModal
