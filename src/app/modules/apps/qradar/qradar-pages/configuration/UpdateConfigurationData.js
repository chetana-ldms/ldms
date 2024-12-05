import React, {useState, useEffect} from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import {
  fetchAllConfigurationDataDetailUrl,
  fetchAllMasterDataDetailUrl,
  fetchAllMasterDataManageUrl,
  fetchConfigurationDataManageUrl,
  fetchLDPToolsUrl,
  fetchOrganizationsUrl,
} from '../../../../../api/ConfigurationApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'

const UpdateConfigurationData = () => {
  const location = useLocation()
  const {id} = useParams()
  const [save, setSave] = useState(location.state?.save || '')
  const [masterData, setMasterData] = useState({})
  console.log(masterData, 'masterData')
  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState([])
  const [tools, setTools] = useState([])
  const navigate = useNavigate()

  const [dataType, setDataType] = useState('')
  const [dataName, setDataName] = useState('')
  const [dataValue, setDataValue] = useState('')
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

  useEffect(() => {
    reloadOrg()
    reloadTools()
  }, [])

  // Fetch master data details
  const reload = async () => {
    try {
      setLoading(true)
      const response = await fetchAllConfigurationDataDetailUrl(id)
      const masterDataDetails = response?.data[0] || {}

      setMasterData(masterDataDetails)
      setDataType(masterDataDetails.dataType || '')
      setDataName(masterDataDetails.dataName || '')
      setDataValue(masterDataDetails.dataValue || '')
    } catch (error) {
      console.error('Failed to fetch master data details:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [id])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!dataType) {
      notifyFail('Enter Data Type')
      return
    }
    if (!dataName) {
      notifyFail('Enter Data Name')
      return
    }
    if (!dataValue) {
      notifyFail('Enter Data Value')
      return
    }

    setLoading(true)

    const data = {
      dataID: masterData.dataID || 0,
      dataType,
      dataName,
      dataValue,
      userId: Number(sessionStorage.getItem('userId')),
      transactionDate: new Date().toISOString(),
    }

    try {
      const responseData = await fetchConfigurationDataManageUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        setTimeout(() => {
          navigate('/qradar/configuration-data/list')
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

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title align-items-start flex-column'>
          {save ? (
            <span className='white'>View Configuration Data</span>
          ) : (
            <span className='white'>Update Configuration Data</span>
          )}
        </h3>
        <div className='card-toolbar'>
          <Link to='/qradar/configuration-data/list' className='white fs-15 text-underline'>
            <i className='fa fa-chevron-left white mg-right-5' /> Back
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='card-body pad-10'>
          <div className='row mb-4'>
            <div className='col-lg-4'>
              <label>Data Type</label>
              <input
                type='text'
                className='form-control'
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
              />
            </div>
            <div className='col-lg-4'>
              <label>Data Name</label>
              <input
                type='text'
                className='form-control'
                value={dataName}
                onChange={(e) => setDataName(e.target.value)}
              />
            </div>
            <div className='col-lg-4'>
              <label>Data Value</label>
              <input
                type='text'
                className='form-control'
                value={dataValue}
                onChange={(e) => setDataValue(e.target.value)}
              />
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

export {UpdateConfigurationData}
