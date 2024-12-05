import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import {
  fetchAllMasterDataManageUrl,
  fetchAllMasterDataUrl,
  fetchLDPToolsUrl,
  fetchOrganizationsUrl,
} from '../../../../../api/ConfigurationApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import CreatableSelect from 'react-select/creatable'

const AddMasterData = () => {
  const userID = Number(sessionStorage.getItem('userId'))
  const [masterData, setMasterData] = useState([])
  console.log(masterData, 'masterData')
  const [dataTypeOptions, setDataTypeOptions] = useState([])
  const [dataNameOptions, setDataNameOptions] = useState([])
  const [dataValueOptions, setDataValueOptions] = useState([])
  const [selectedDataType, setSelectedDataType] = useState(null)
  const [selectedDataName, setSelectedDataName] = useState(null)
  const [selectedDataValue, setSelectedDataValue] = useState(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState([])
  console.log(organizations, 'organizations')
  const [tools, setTools] = useState([])
  console.log(tools, 'tools')
  const dataType = useRef()
  const toolType = useRef()
  const organizationName = useRef()
  const dataName = useRef()
  const dataValue = useRef()

  const reloadMasterData = async () => {
    try {
      const response = await fetchAllMasterDataUrl()
      const data = response?.masterDataList || []
      setMasterData(data)

      // Set Data Type Options
      const dataTypes = [...new Set(data.map((item) => item.dataType))];
      setDataTypeOptions(dataTypes.map((type) => ({label: type, value: type})))

      // Filter Data Name and Data Value options based on Data Type
      if (selectedDataType) {
        const filteredData = data.filter(item => item.dataType === selectedDataType.value)

        const dataNames = [...new Set(filteredData.map((item) => item.dataName))];
        setDataNameOptions(dataNames.map((name) => ({label: name, value: name})))

        const dataValues = [...new Set(filteredData.map((item) => item.dataValue))];
        setDataValueOptions(dataValues.map((value) => ({label: value, value: value})))
      } else {
        setDataNameOptions([])
        setDataValueOptions([])
      }
    } catch (error) {
      console.error('Failed to fetch master data:', error)
    }
  }

  useEffect(() => {
    reloadMasterData()
  }, [selectedDataType])  // Reload data whenever selectedDataType changes

  const reloadOrg = async () => {
    try {
      const response = await fetchOrganizationsUrl()
      setOrganizations(response)
    } catch (error) {
      console.error('Failed to fetch organizations:', error)
    }
  }

  const reloadTools = async () => {
    try {
      const response = await fetchLDPToolsUrl()
      setTools(response)
    } catch (error) {
      console.error('Failed to fetch tools:', error)
    }
  }

  useEffect(() => {
    reloadOrg()
    reloadTools()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedDataType) {
      notifyFail('Enter Data Type')
      return
    }
    if (!selectedDataValue) {
      notifyFail('Enter Data Value')
      return
    }
    setLoading(true)

    const data = {
      dataID: 0,
      dataType: selectedDataType.value,
      dataName: selectedDataName ? selectedDataName.value : '',
      dataValue: selectedDataValue.value,
      toolId: Number(toolType.current.value),
      orgId: Number(organizationName.current.value),
      userId: userID,
      transactionDate: new Date().toISOString(),
    }

    try {
      const responseData = await fetchAllMasterDataManageUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        setTimeout(() => {
          navigate('/qradar/master-data/list')
        }, 2000)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='white'>Add Master Data</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/master-data/list' className='white fs-15 text-underline'>
              <i className='fa fa-chevron-left white mg-right-5' />
              Back
            </Link>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='card-body pad-10'>
          <div className='row mb-4'>
            <div className='col-lg-4'>
              <label>Data Type</label>
              <CreatableSelect
                options={dataTypeOptions}
                value={selectedDataType}
                onChange={setSelectedDataType}
                onCreateOption={(inputValue) => {
                  const newOption = {label: inputValue, value: inputValue}
                  setDataTypeOptions((prev) => [...prev, newOption])
                  setSelectedDataType(newOption) 
                }}
                placeholder='Create or select...'
                isClearable
              />
            </div>

            <div className='col-lg-4'>
              <label>Data Name</label>
              <CreatableSelect
                options={dataNameOptions}
                value={selectedDataName}
                onChange={setSelectedDataName}
                onCreateOption={(inputValue) => {
                  const newOption = {label: inputValue, value: inputValue}
                  setDataNameOptions((prev) => [...prev, newOption])
                  setSelectedDataName(newOption)
                }}
                placeholder='Create or select...'
                isClearable
              />
            </div>

            <div className='col-lg-4'>
              <label>Data Value</label>
              <CreatableSelect
                options={dataValueOptions}
                value={selectedDataValue}
                onChange={setSelectedDataValue}
                onCreateOption={(inputValue) => {
                  const newOption = {label: inputValue, value: inputValue}
                  setDataValueOptions((prev) => [...prev, newOption])
                  setSelectedDataValue(newOption)
                }}
                placeholder='Create or select...'
                isClearable
              />
            </div>
          </div>
          <div className='row mb-4'>
            <div className='col-lg-4'>
              <label>Tool Name</label>
              <select className='form-control' ref={toolType}>
                <option value=''>Select Tool Name</option>
                {tools.map((tool, idx) => (
                  <option key={idx} value={tool.toolId}>
                    {tool.toolName}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-lg-4'>
              <label>Organization</label>
              <select className='form-control' ref={organizationName}>
                <option value=''>Select Organization</option>
                {organizations.map((org, idx) => (
                  <option key={idx} value={org.orgID}>
                    {org.orgName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className='card-footer d-flex justify-content-end pad-10'>
          <button type='submit' className='btn btn-new btn-small' disabled={loading}>
            {!loading && 'Save Changes'}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export {AddMasterData}
