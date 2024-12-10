import React, {useState, useEffect} from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import {
  fetchAllMasterDataDetailUrl,
  fetchAllMasterDataManageUrl,
  fetchLDPToolsUrl,
  fetchOrganizationsUrl,
  fetchAllMasterDataUrl
} from '../../../../../api/ConfigurationApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import CreatableSelect from 'react-select/creatable'

const UpdateMasterData = () => {
  const location = useLocation()
  const {id} = useParams()
  const [save, setSave] = useState(location.state?.save || '')
  const [masterData, setMasterData] = useState({})
  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState([])
  const [tools, setTools] = useState([])
  const navigate = useNavigate()

  const [dataTypeOptions, setDataTypeOptions] = useState([])
  const [dataNameOptions, setDataNameOptions] = useState([])
  const [dataValueOptions, setDataValueOptions] = useState([])
  const [selectedDataType, setSelectedDataType] = useState('')
  const [selectedDataName, setSelectedDataName] = useState('')
  const [selectedDataValue, setSelectedDataValue] = useState('')
  const [toolType, setToolType] = useState('')
  const [organizationName, setOrganizationName] = useState('')

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

  const reloadMasterData = async () => {
    try {
      const response = await fetchAllMasterDataUrl()
      const data = response?.masterDataList || []

      // Set Data Type Options
      const dataTypes = [...new Set(data.map((item) => item.dataType))]
      setDataTypeOptions(dataTypes.map((type) => ({label: type, value: type})))

      // Filter Data Name and Data Value options based on selected Data Type
      if (selectedDataType) {
        const filteredData = data.filter(item => item.dataType === selectedDataType)

        const dataNames = [...new Set(filteredData.map((item) => item.dataName))]
        setDataNameOptions(dataNames.map((name) => ({label: name, value: name})))

        const dataValues = [...new Set(filteredData.map((item) => item.dataValue))]
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
    reloadOrg()
    reloadTools()
  }, [])

  useEffect(() => {
    reloadMasterData()
  }, [selectedDataType])  // Reload options when selectedDataType changes

  // Fetch master data details
  const reload = async () => {
    try {
      setLoading(true)
      const response = await fetchAllMasterDataDetailUrl(id)
      const masterDataDetails = response?.masterDataList[0] || {}

      // Set form values
      setMasterData(masterDataDetails)
      setSelectedDataType(masterDataDetails.dataType || '')
      setSelectedDataName(masterDataDetails.dataName || '')
      setSelectedDataValue(masterDataDetails.dataValue || '')
      setToolType(masterDataDetails.toolId || '')
      setOrganizationName(masterDataDetails.orgId || '')
    } catch (error) {
      console.error('Failed to fetch master data details:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [id])

  // Handle form submission
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
      dataID: masterData.dataID || 0,
      dataType: selectedDataType,
      dataName: selectedDataName,
      dataValue: selectedDataValue,
      toolId: Number(toolType),
      orgId: Number(organizationName),
      userId: Number(sessionStorage.getItem('userId')),
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
      console.error('Failed to update master data:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (toolType) {
      setOrganizationName('');
    }
  }, [toolType]);
  
  useEffect(() => {
    if (organizationName) {
      setToolType(''); 
    }
  }, [organizationName]);

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title align-items-start flex-column'>
          {save ? (
            <span className='white'>View Master Data</span>
          ) : (
            <span className='white'>Update Master Data</span>
          )}
        </h3>
        <div className='card-toolbar'>
          <Link to='/qradar/master-data/list' className='white fs-15 text-underline'>
            <i className='fa fa-chevron-left white mg-right-5' /> Back
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='card-body pad-10'>
          <div className='row mb-4'>
            <div className='col-lg-4'>
              <label>Data Type</label>
              <CreatableSelect
                options={dataTypeOptions}
                value={{label: selectedDataType, value: selectedDataType}}
                onChange={(selectedOption) => setSelectedDataType(selectedOption.value)}
                onCreateOption={(inputValue) => {
                  const newOption = {label: inputValue, value: inputValue}
                  setDataTypeOptions((prev) => [...prev, newOption])
                  setSelectedDataType(inputValue) // Set the new value as selected
                }}
                placeholder='Create or select...'
                isClearable
              />
            </div>
            <div className='col-lg-4'>
              <label>Data Name</label>
              <CreatableSelect
                options={dataNameOptions}
                value={{label: selectedDataName, value: selectedDataName}}
                onChange={(selectedOption) => setSelectedDataName(selectedOption.value)}
                onCreateOption={(inputValue) => {
                  const newOption = {label: inputValue, value: inputValue}
                  setDataNameOptions((prev) => [...prev, newOption])
                  setSelectedDataName(inputValue) // Set the new value as selected
                }}
                placeholder='Create or select...'
                isClearable
              />
            </div>
            <div className='col-lg-4'>
              <label>Data Value</label>
              <CreatableSelect
                options={dataValueOptions}
                value={{label: selectedDataValue, value: selectedDataValue}}
                onChange={(selectedOption) => setSelectedDataValue(selectedOption.value)}
                onCreateOption={(inputValue) => {
                  const newOption = {label: inputValue, value: inputValue}
                  setDataValueOptions((prev) => [...prev, newOption])
                  setSelectedDataValue(inputValue) // Set the new value as selected
                }}
                placeholder='Create or select...'
                isClearable
              />
            </div>
          </div>
          <div className='row mb-4'>
            <div className='col-lg-4'>
              <label>Tool Name</label>
              <select
                className='form-control'
                value={toolType}
                onChange={(e) => setToolType(e.target.value)}
              >
                <option value=''>Select Tool Type</option>
                {tools.map((tool, idx) => (
                  <option key={idx} value={tool.toolId}>
                    {tool.toolName}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-lg-4'>
              <label>Organization</label>
              <select
                className='form-control'
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              >
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
          <button
            type='submit'
            className='btn btn-new btn-small'
            style={{display: loading || save ? 'none' : 'inline-block'}}
            disabled={loading}
          >
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

export {UpdateMasterData}
