import React, {useState, useEffect} from 'react'
import {Modal} from 'react-bootstrap'
import {fetchRolesByParentRoleNameUrl, fetchUsersByRoleIdUrl, fetchControlsTrackingAssignmentsUrl} from '../../../../../api/ComplianceApi'
import {notify, notifyFail} from '../components/notification/Notification'

const ControlsAssignmentModal = ({show, handleClose, selectedTrackingIds, orgId, onSuccess}) => {
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState('')
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [loading, setLoading] = useState(false)

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
      fetchRoles()
    } else {
      setSelectedRole('')
      setSelectedUser('')
      setUsers([])
    }
  }, [show, orgId])

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

  const handleSubmit = async () => {
    if (!selectedRole || !selectedUser) {
      notifyFail('Please select both role and user')
      return
    }

    try {
      setLoading(true)
      const userId = Number(sessionStorage.getItem('userId'))
      const payload = {
        trackingIds: selectedTrackingIds.map(Number),
        createdByUserId: userId,
        assignments: [
          {
            userId: Number(selectedUser),
            roleTypeId: Number(selectedRole),
            isPrimary: true,
          },
        ],
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
    <Modal show={show} onHide={handleClose} backdrop='static' keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Controls</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-3'>
          <label className='form-label fw-bold'>Select Role</label>
          <select className='form-select form-select-sm' value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value=''>Choose a role...</option>
            {roles.map((role) => (
              <option key={role.roleID} value={role.roleID}>{role.roleName}</option>
            ))}
          </select>
        </div>
        <div className='mb-3'>
          <label className='form-label fw-bold'>Select User</label>
          <select className='form-select form-select-sm' value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} disabled={!selectedRole}>
            <option value=''>Choose a user...</option>
            {users.map((user) => (
              <option key={user.userID} value={user.userID}>{user.name}</option>
            ))}
          </select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type='button' className='btn btn-sm btn-light' onClick={handleClose}>Close</button>
        <button type='button' className='btn btn-sm btn-primary' onClick={handleSubmit} disabled={loading || !selectedUser}>{loading ? 'Processing...' : 'Assign'}</button>
      </Modal.Footer>
    </Modal>
  )
}
export default ControlsAssignmentModal