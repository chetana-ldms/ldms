import React, {useState, useEffect} from 'react'
import CanvasJSReact from '../reports/assets/canvasjs.react'
import {
  fetchControlsTrackingAssignmentsSummaryUrl,
  fetchControlsTrackingAssignmentsUrl,
  fetchRolesByParentRoleNameUrl,
} from '../../../../../api/ComplianceApi'
import {fetchExportDataAddUrl} from '../../../../../api/Api'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'

const CanvasJSChart = CanvasJSReact.CanvasJSChart

function ControlsTrackingAssignmentSummary() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState('')

  const [viewType, setViewType] = useState('pie') // Default view type

  const orgId = Number(sessionStorage.getItem('orgId'))

  // Fetch Roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetchRolesByParentRoleNameUrl('Compliance Roles', orgId)

        const rolesList = Array.isArray(res?.rolesList) ? res.rolesList : []

        setRoles(rolesList)

        // Select first role by default
        if (rolesList.length > 0) {
          setSelectedRole(rolesList[0].roleID)
        }
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }

    if (orgId) {
      fetchRoles()
    }
  }, [orgId])

  // Fetch Summary Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const payload = {
          orgId: orgId,
          projectId: 1,
          userRoleTypeId: Number(selectedRole),
        }

        const response = await fetchControlsTrackingAssignmentsSummaryUrl(payload)

        if (response?.data) {
          setData(response.data)
        } else {
          setData([])
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (orgId && selectedRole) {
      fetchData()
    }
  }, [orgId, selectedRole])

  // Bar Chart Options
  const barOptions = {
    animationEnabled: true,

    title: {
      text: 'Pending Controls by User',
    },

    axisX: {
      title: 'Users',
    },

    axisY: {
      title: 'Pending Controls',
    },

    data: [
      {
        type: 'column',

        dataPoints: data.map((item) => ({
          label: item.userName,
          y: item.pendingControls,
        })),
      },
    ],
  }

  // Pie Chart Options

  const pieOptions = {
    animationEnabled: true,

    title: {
      text: 'Pending Controls Distribution',
    },

    data: [
      {
        type: 'pie',

        showInLegend: true,

        indexLabel: '{label} - {y}%',

        toolTipContent: '<b>{label}</b><br/>Pending Controls: {count}<br/>Percentage: {y}%',

        dataPoints: data.map((item) => ({
          label: item.userName,
          y: item.percentage,
          count: item.pendingControls,
        })),
      },
    ],
  }
  const handleExport = (format) => {
    if (format === 'excel') {
      exportToExcel()
    } else if (format === 'pdf') {
      exportToPDF()
    }
  }
  const exportToExcel = async () => {
    try {
      const headers = ['User Name', 'Pending Controls', 'Percentage (%)']

      const rows = data.map((item) => [item.userName, item.pendingControls, item.percentage])

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

      // Create Blob
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;',
      })

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')

      link.href = url

      link.setAttribute('download', 'control_tracking_assignment_summary.csv')

      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)

      // Save export history
      await fetchExportDataAddUrl({
        createdDate: new Date().toISOString(),
        createdUserId: Number(sessionStorage.getItem('userId')),
        orgId: Number(sessionStorage.getItem('orgId')),
        exportDataType: 'Control Tracking Assignment Summary',
      })
    } catch (error) {
      console.error('CSV Export Error:', error)
    }
  }
  const exportToPDF = async () => {
    const doc = new jsPDF()

    doc.text('Control Tracking Assignment Summary', 10, 10)

    const tableHead = [['User Name', 'Pending Controls', 'Percentage']]

    const tableBody = data.map((item) => [
      item.userName,
      item.pendingControls,
      `${item.percentage}%`,
    ])

    doc.autoTable({
      startY: 20,
      head: tableHead,
      body: tableBody,
      styles: {
        fontSize: 10,
      },
    })

    doc.save('control_tracking_assignment_summary.pdf')

    await fetchExportDataAddUrl({
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'Control Tracking Assignment Summary',
    })
  }

  return (
    <div className='container-fluid'>
      {/* Header */}

      <div className='row align-items-center bg-heading p-3 mb-4 rounded'>
        {/* Title */}

        <div className='col-md-4'>
          <h4 className='text-white mb-0'>Control Tracking Assignment Summary</h4>
        </div>

        {/* View Buttons */}

        <div className='col-md-4 text-center'>
          <div className='btn-group'>
            <button
              className={`btn btn-sm btn-light-primary ${viewType === 'pie' ? 'active' : ''}`}
              onClick={() => setViewType('pie')}
            >
              Pie chart
            </button>
            <button
              className={`btn btn-sm btn-light-primary ${viewType === 'bar' ? 'active' : ''}`}
              onClick={() => setViewType('bar')}
            >
              Bar chart
            </button>
            <button
              className={`btn btn-sm btn-light-primary ${viewType === 'table' ? 'active' : ''}`}
              onClick={() => setViewType('table')}
            >
              Table chart
            </button>
          </div>
        </div>

        {/* Role Dropdown */}

        <div className='col-md-3'>
          <div className='d-flex justify-content-end align-items-center gap-2'>
            <label className='text-white fw-bold mb-0'>Role:</label>

            <select
              className='form-select form-select-sm'
              style={{width: '250px'}}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((role) => (
                <option key={role.roleID} value={role.roleID}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='col-md-1 m-0 p-0'>
          <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
            <DropdownToggle caret className='p-0 m-0 px-3 py-2'>
              Export
              <i className='fa fa-file-export link mg-left-10 ms-1 p-0 m-0' />
            </DropdownToggle>

            <DropdownMenu>
              <DropdownItem onClick={() => handleExport('excel')}>
                Export to CSV
                <i className='fa fa-file-excel link float-right' />
              </DropdownItem>

              <hr className='no-margin' />

              <DropdownItem onClick={() => handleExport('pdf')}>
                Export to PDF
                <i className='fa fa-file-pdf red float-right' />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Body */}

      {loading ? (
        <div className='text-center'>Loading...</div>
      ) : data.length > 0 ? (
        <>
          {viewType === 'bar' && <CanvasJSChart options={barOptions} />}

          {viewType === 'pie' && <CanvasJSChart options={pieOptions} />}

          {viewType === 'table' && (
            <div className='table-responsive mt-3'>
              <table className='table table-row-bordered table-row-gray-300 align-middle gs-0 gy-4'>
                <thead>
                  <tr className='fw-bold text-muted bg-blue'>
                    <th>User Name</th>

                    <th>Pending Controls</th>

                    <th>Percentage (%)</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.userName}</td>

                      <td>{item.pendingControls}</td>

                      <td>{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className='text-center'>No Pending Assignment </div>
      )}
    </div>
  )
}

export default ControlsTrackingAssignmentSummary
