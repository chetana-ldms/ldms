import React, {useState, useEffect} from 'react'
import {Modal} from 'react-bootstrap'
import Select from 'react-select'
import {
  fetchRolesByParentRoleNameUrl,
  fetchUsersByRoleIdUrl,
  fetchControlsTrackingAssignmentsUrl,
} from '../../../../../api/ComplianceApi'
import {notify, notifyFail} from '../components/notification/Notification'
 
const ControlsAssignmentModal = ({show, handleClose, selectedTrackingIds, orgId, onSuccess, initialAssignments}) => {
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState('')
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [assignments, setAssignments] = useState([])
  const [isPrimary, setIsPrimary] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [loading, setLoading] = useState(false)

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
      const fetchRoles = async () => {
        try {
          const res = await fetchRolesByParentRoleNameUrl('Compliance Roles', orgId)
          setRoles(Array.isArray(res?.rolesList) ? res.rolesList : [])
        } catch (error) {
          console.error('Error fetching roles:', error)
        }
      }

      // If editing a single control, pre-populate assignments from initialAssignments prop
      if (selectedTrackingIds.length === 1 && initialAssignments) {
        setAssignments(initialAssignments.map(assignment => ({
          userId: assignment.userId,
          userName: assignment.userName,
          roleTypeId: assignment.roleTypeId,
          roleName: assignment.roleTypeName, // Map roleTypeName from API to roleName in local state
          isPrimary: assignment.isPrimary,
        })))
      }
      fetchRoles()
    } else {
      setSelectedRole('')
      setSelectedUser('')
      setUsers([])
      setAssignments([])
      setIsPrimary(false)
      setEditingIndex(null)
    } // Add initialAssignments to dependency array
  }, [show, orgId, selectedTrackingIds, initialAssignments])

  useEffect(() => {
    if (selectedRole) {
      const fetchUsers = async () => {
        try {
          const res = await fetchUsersByRoleIdUrl(selectedRole)
          setUsers(Array.isArray(res?.usersList) ? res.usersList : [])
        } catch (error) {
          console.error('Error fetching users:', error)
        }
      }
      fetchUsers()
    } else {
      setUsers([])
      setSelectedUser('')
    }
  }, [selectedRole])

  const handleAddAssignment = () => {
    if (!selectedRole || !selectedUser) {
      notifyFail('Please select both role and user')
      return
    }

    const roleName = roles.find((r) => r.roleID === Number(selectedRole))?.roleName || ''
    const userName = users.find((u) => u.userID === Number(selectedUser))?.name || ''

    const newAssignment = {
      userId: Number(selectedUser),
      userName,
      roleTypeId: Number(selectedRole),
      roleName,
      isPrimary,
    }

    if (editingIndex !== null) {
      const updated = [...assignments]
      updated[editingIndex] = newAssignment
      setAssignments(updated)
      setEditingIndex(null)
    } else {
      setAssignments([...assignments, newAssignment])
    }

    setSelectedRole('')
    setSelectedUser('')
    setIsPrimary(false)
  }

  const handleDeleteAssignment = (index) => {
    setAssignments(assignments.filter((_, i) => i !== index))
  }

  const handleEditAssignment = (index) => {
    const item = assignments[index]
    setSelectedRole(item.roleTypeId.toString())
    setSelectedUser(item.userId.toString())
    setIsPrimary(item.isPrimary)
    setEditingIndex(index)
  }

  const userOptions = users.map((user) => ({
    value: user.userID.toString(),
    label: user.name,
  }))

  const handleSubmit = async () => {
    if (assignments.length === 0) {
      notifyFail('Please add at least one assignment')
      return
    }

    try {
      setLoading(true)
      const userId = Number(sessionStorage.getItem('userId'))
      const payload = {
        trackingIds: selectedTrackingIds.map(Number),
        createdByUserId: userId,
        assignments: assignments.map((item) => ({
          userId: item.userId,
          roleTypeId: item.roleTypeId,
          isPrimary: item.isPrimary,
        })),
      }

      const res = await fetchControlsTrackingAssignmentsUrl(payload)
      if (res?.isSuccess) {
        notify('Assignments updated successfully')
        onSuccess()
        handleClose()
      } else {
        notifyFail(res?.message || 'Failed to update assignments')
      }
    } catch (error) {
      console.error('Error submitting assignments:', error)
      notifyFail('An error occurred while assigning controls')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop='static'
      keyboard={false}
      className='addANoteModal application-modal'
    >
      <Modal.Header closeButton> {/* Using closeButton prop for standard close functionality */}
        <Modal.Title>Assign Controls</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-3'>
          <label className='form-label fw-bold'>Select Role</label>
          <select
            className='form-select form-select-sm'
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value=''>Choose a role...</option>
            {roles.map((role) => (
              <option key={role.roleID} value={role.roleID}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-3'>
          <label className='form-label fw-bold'>Select User</label>
          <Select
            options={userOptions}
            value={userOptions.find((option) => option.value === selectedUser) || null}
            onChange={(option) => setSelectedUser(option ? option.value : '')}
            isDisabled={!selectedRole}
            placeholder='Choose a user...'
            isClearable
            styles={customSelectStyle}
          />
        </div>
        <div className='mb-3 form-check'>
          <input
            type='checkbox'
            className='form-check-input'
            id='isPrimaryCheck'
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
          />
          <label className='form-check-label' htmlFor='isPrimaryCheck'>
            Is Primary
          </label>
        </div>
        <div className='mb-4'>
          <button type='button' className='btn btn-sm btn-info' onClick={handleAddAssignment}>
            {editingIndex !== null ? 'Update Assignment' : 'Add Assignment'}
          </button>
        </div>

        {assignments.length > 0 && (
          <div className='table-responsive'>
            <table className='table table-sm table-bordered'>
              <thead>
                <tr className='bg-light'>
                  <th>Role</th>
                  <th>User</th>
                  <th>Primary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((item, index) => (
                  <tr key={index}>
                    <td>{item.roleName}</td>
                    <td>{item.userName}</td>
                    <td>{item.isPrimary ? 'Yes' : 'No'}</td>
                    <td>
                      <button
                        className='btn btn-icon btn-sm me-1'
                        onClick={() => handleEditAssignment(index)}
                      >
                        <i className='fa fa-edit text-primary' />
                      </button>
                      <button
                        className='btn btn-icon btn-sm'
                        onClick={() => handleDeleteAssignment(index)}
                      >
                        <i className='fa fa-trash text-danger' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button type='button' className='btn btn-sm btn-light' onClick={handleClose}>
          Close
        </button>
        <button
          type='button'
          className='btn btn-sm btn-primary'
          onClick={handleSubmit}
        >
          {loading ? 'Processing...' : 'Assign'}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
export default ControlsAssignmentModal
