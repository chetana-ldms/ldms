import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import Pagination from '../../../../../../utils/Pagination'
import {fetchAllMasterDataUrl} from '../../../../../api/ConfigurationApi'
import {useErrorBoundary} from 'react-error-boundary'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {ToastContainer} from 'react-toastify'
import useFeatureActions from './useFeatureActions'
import Creatable from 'react-select/creatable'

const ManageMasterDataModal = ({show, handleClose, onSave}) => {
  const handleError = useErrorBoundary()
  const [tools, setTools] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [dataTypeFilter, setDataTypeFilter] = useState('')
  const [toolNameFilter, setToolNameFilter] = useState('')
  const [organizationNameFilter, setOrganizationNameFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [activePage, setActivePage] = useState(0)
  const [loading, setLoading] = useState(false)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const [dataTypeOptions, setDataTypeOptions] = useState([])
  const [dataNameOptions, setDataNameOptions] = useState([])
  const [dataValueOptions, setDataValueOptions] = useState([])
  const [organizationOptions, setOrganizationOptions] = useState([])
  const [toolNameOptions, setToolNameOptions] = useState([])

  // Selected values
  const [selectedDataType, setSelectedDataType] = useState(null)
  const [selectedDataName, setSelectedDataName] = useState(null)
  const [selectedDataValue, setSelectedDataValue] = useState(null)
  const [selectedOrganization, setSelectedOrganization] = useState(null)
  const [selectedToolName, setSelectedToolName] = useState(null)

  // Handler to add new options dynamically
  const handleCreateOption = (setOptions, options, inputValue) => {
    const newOption = {value: inputValue, label: inputValue}
    setOptions([...options, newOption])
  }

  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const reload = async () => {
    try {
      setLoading(true)
      const response = await fetchAllMasterDataUrl()
      setTools(response)
      setDataTypeOptions(response.dataType.map((type) => ({value: type, label: type})))
      setDataNameOptions(response.dataNames.map((name) => ({value: name, label: name})))
      setDataValueOptions(response.dataValues.map((value) => ({value: value, label: value})))
      setOrganizationOptions(response.organizationName.map((org) => ({value: org, label: org})))
      setToolNameOptions(response.toolName.map((tool) => ({value: tool, label: tool})))
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }
  

  useEffect(() => {
    reload()
  }, [itemsPerPage])

  const applyFilters = () => {
    let filteredTools = tools

    if (filterValue) {
      filteredTools = filteredTools.filter((item) =>
        item.searchText.toLowerCase().includes(filterValue.toLowerCase())
      )
    }

    if (dataTypeFilter) {
      filteredTools = filteredTools.filter((item) => item.dataType === dataTypeFilter)
    }

    if (toolNameFilter) {
      filteredTools = filteredTools.filter((item) => item.toolName === toolNameFilter)
    }

    if (organizationNameFilter) {
      filteredTools = filteredTools.filter(
        (item) => item.organizationName === organizationNameFilter
      )
    }

    return filteredTools
  }

  const filteredList = applyFilters()
  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
    setActivePage(0)
  }

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
    setActivePage(selected.selected)
  }

  const handleSave = () => {
    onSave()
    handleClose()
  }
  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }
  const handleEdit = () => {}

  const handleDelete = async () => {}

  return (
    <Modal show={show} onHide={handleClose} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>
          <span className='card-label fw-bold fs-3'>
            MasterData ({currentItems.length} / {filteredList.length})
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className=' config'>
          <ToastContainer />
          <div className='row mb-4'>
            <div className='col-lg-4'>
              <input
                type='text'
                placeholder='Search...'
                className='form-control'
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </div>
            <div className='col-lg-2'>
              <select
                className='form-control p-0 ps-2'
                value={dataTypeFilter}
                onChange={(e) => setDataTypeFilter(e.target.value)}
              >
                <option value=''>Data Types</option>
                {Array.from(new Set(tools.map((item) => item.dataType))).map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-lg-2'>
              <select
                className='form-control p-0 ps-2'
                value={toolNameFilter}
                onChange={(e) => setToolNameFilter(e.target.value)}
              >
                <option value=''>Tool Names</option>
                {Array.from(new Set(tools.map((item) => item.toolName))).map((tool, idx) => (
                  <option key={idx} value={tool}>
                    {tool}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-lg-2'>
              <select
                className='form-control p-0 ps-2'
                value={organizationNameFilter}
                onChange={(e) => setOrganizationNameFilter(e.target.value)}
              >
                <option value=''>Organizations</option>
                {Array.from(new Set(tools.map((item) => item.organizationName))).map((org, idx) => (
                  <option key={idx} value={org}>
                    {org}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='row mb-4'>
            <div className='col-lg-2'>
              <label>Data Type</label>
              <Creatable
                options={dataTypeOptions}
                value={selectedDataType}
                onChange={setSelectedDataType}
                onCreateOption={(inputValue) =>
                  handleCreateOption(setDataTypeOptions, dataTypeOptions, inputValue)
                }
                placeholder='create...'
                isClearable
              />
            </div>
            <div className='col-lg-2'>
              <label>Data Name</label>
              <Creatable
                options={dataNameOptions}
                value={selectedDataName}
                onChange={setSelectedDataName}
                onCreateOption={(inputValue) =>
                  handleCreateOption(setDataNameOptions, dataNameOptions, inputValue)
                }
                placeholder='create...'
                isClearable
              />
            </div>
            <div className='col-lg-2'>
              <label>Data Value</label>
              <Creatable
                options={dataValueOptions}
                value={selectedDataValue}
                onChange={setSelectedDataValue}
                onCreateOption={(inputValue) =>
                  handleCreateOption(setDataValueOptions, dataValueOptions, inputValue)
                }
                placeholder='create...'
                isClearable
              />
            </div>
            <div className='col-lg-2'>
              <label>Organization</label>
              <Creatable
                options={organizationOptions}
                value={selectedOrganization}
                onChange={setSelectedOrganization}
                onCreateOption={(inputValue) =>
                  handleCreateOption(setOrganizationOptions, organizationOptions, inputValue)
                }
                placeholder='create...'
                isClearable
              />
            </div>
            <div className='col-lg-2'>
              <label>Tool Name</label>
              <Creatable
                options={toolNameOptions}
                value={selectedToolName}
                onChange={setSelectedToolName}
                onCreateOption={(inputValue) =>
                  handleCreateOption(setToolNameOptions, toolNameOptions, inputValue)
                }
                placeholder='create...'
                isClearable
              />
            </div>
          </div>

          <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
            <thead>
              <tr>
                <th>Data Type</th>
                <th>Data Name</th>
                <th>Data Value</th>
                <th>Tool Name</th>
                <th>Organization Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <UsersListLoading />}
              {currentItems.length > 0 ? (
                currentItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.dataType}</td>
                    <td>{item.dataName}</td>
                    <td>{item.dataValue}</td>
                    <td>{item.toolName}</td>
                    <td>{item.organizationName}</td>
                    <td>
                      <span onClick={() => handleEdit()} title='Edit'>
                        <i className='fa fa-pencil cursor link' />
                      </span>
                      <span className='ms-8' onClick={() => handleDelete()} title='Delete'>
                        <i className='fa fa-trash cursor red' />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='5' className='text-center'>
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            pageCount={Math.ceil(filteredList.length / itemsPerPage)}
            handlePageClick={handlePageClick}
            itemsPerPage={itemsPerPage}
            handlePageSelect={handlePageSelect}
            forcePage={activePage}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
        <Button variant='success' onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ManageMasterDataModal
