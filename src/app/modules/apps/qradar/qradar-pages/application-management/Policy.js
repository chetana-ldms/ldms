import React, {useEffect, useState} from 'react'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {
  fetchApplicationManagementSettingsUpdateUrl,
  fetchApplicationManagementSettingsUrl,
} from '../../../../../api/ApplicationSectionApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Policy() {
  const [loading, setLoading] = useState(false)
  const [isDefaultPolicy, setIsDefaultPolicy] = useState(false)
  const [policy, setPolicy] = useState({})
  console.log(policy, 'policy')
  const orgId = Number(sessionStorage.getItem('orgId'))
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const toolId = Number(sessionStorage.getItem('toolID'))

  const fetchData = async () => {
    const data = {
      orgId: orgId,
      toolId: toolId,
      orgAccountStructureLevel: [
        {
          levelName: 'AccountId',
          levelValue: accountId || '',
        },
        {
          levelName: 'SiteId',
          levelValue: siteId || '',
        },
        {
          levelName: 'GroupId',
          levelValue: groupId || '',
        },
      ],
    }
    try {
      setLoading(true)
      const response = await fetchApplicationManagementSettingsUrl(data)
      setPolicy(response?.data)
      setIsDefaultPolicy(response?.data?.inheritedFrom !== null) // Set based on inheritedFrom
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleVulnerabilitiesScanEnabledChange = (event) => {
    setPolicy({
      ...policy,
      vulnerabilitiesScanEnabled: event.target.checked,
    })
  }

  const handleExtensiveScanEnabledChange = (event) => {
    setPolicy({
      ...policy,
      extensiveScanEnabled: event.target.checked,
    })
  }

  const handleExtensiveLinuxScanEnabledChange = (event) => {
    setPolicy({
      ...policy,
      extensiveLinuxScanEnabled: event.target.checked,
    })
  }

  const handleInheritSettingsChange = (isChecked) => {
    setIsDefaultPolicy(isChecked)
    setPolicy((prev) => ({
      ...prev,
      inheritedFrom: isChecked ? "SomeValue" : null, // Set inheritedFrom accordingly
      isDefaultPolicy: isChecked,
    }))
  }

  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      const payload = {
        orgId,
        toolId,
        orgAccountStructureLevel: [
          {
            levelName: 'AccountId',
            levelValue: accountId || '',
          },
          {
            levelName: 'SiteId',
            levelValue: siteId || '',
          },
          {
            levelName: 'GroupId',
            levelValue: groupId || '',
          },
        ],
        appManagementSettings: {
          extensiveLinuxScanEnabled: isDefaultPolicy
            ? false
            : policy.extensiveLinuxScanEnabled || false,
          extensiveScanEnabled: isDefaultPolicy ? false : policy.extensiveScanEnabled || false,
          isDefaultPolicy: isDefaultPolicy,
          vulnerabilitiesScanEnabled: isDefaultPolicy
            ? false
            : policy.vulnerabilitiesScanEnabled || false,
        },
      }
      const response = await fetchApplicationManagementSettingsUpdateUrl(payload)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        fetchData()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mt-4 application-policy'>
      <ToastContainer />
      {loading && <UsersListLoading />}
      {/* Scan Policy Card */}
      <div className='bg-white mb-1 p-2 '>
        <div className='d-flex align-items-center'>
          <div className='form-check ms-5'>
            <input
              type='checkbox'
              className='form-check-input'
              id='inheritDefaultSettings'
              checked={policy?.inheritedFrom !== null} // Reflect inheritedFrom state
              onChange={(e) => handleInheritSettingsChange(e.target.checked)}
            />
            <label className='form-check-label mt-1' htmlFor='inheritDefaultSettings'>
              Default Inherited Settings
            </label>
          </div>
        </div>
      </div>

      <div className='card mb-10 pad-10'>
        <div className='d-flex align-items-center'>
          <h2 className='text-blue'>Scan Policy</h2>
        </div>

        <div className='card-body no-pad'>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              id='vulnerabilitiesScanEnabled'
              disabled={isDefaultPolicy === true}
              checked={policy?.vulnerabilitiesScanEnabled || false}
              onChange={handleVulnerabilitiesScanEnabledChange}
            />
            <label className='form-check-label black' htmlFor='vulnerabilitiesScanEnabled'>
              Vulnerabilities and Application Scanning
            </label>
            <p className='gray'>schedule weekly scan for Wednesdays 10:30AM</p>
          </div>
        </div>
      </div>
      <div className='card pad-10 '>
        <h2 className='text-blue'>Extensive Scan</h2>
        <div className='card-body'>
          <div className='card-title'>
            <p>
              Produces a more Vulnerability assessment leveraging patch data and additional security
              sources.
            </p>
            <p>
              OS-level Vulnerability Detection is available for Windows and Linux (Requires Ranger
              Insights)
            </p>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              id='extensiveScanEnabled'
              checked={policy?.extensiveScanEnabled || false}
              disabled={isDefaultPolicy === true}
              onChange={handleExtensiveScanEnabledChange}
            />
            <label className='form-check-label black' htmlFor='extensiveScanEnabled'>
              Windows Agents
            </label>
            <p className='gray'>When updated, requires approximately 20MB download</p>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              id='extensiveLinuxScanEnabled'
              checked={policy?.extensiveLinuxScanEnabled || false}
              disabled={isDefaultPolicy === true}
              onChange={handleExtensiveLinuxScanEnabledChange}
            />
            <label className='form-check-label black' htmlFor='extensiveLinuxScanEnabled'>
              Linux Agents
            </label>
            <p className='gray'>When updated, requires approximately 35MB download</p>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-end mt-4'>
        {!groupId && (
          <button className='btn btn-primary' onClick={handleSaveChanges}>
            Save Changes
          </button>
        )}
      </div>
    </div>
  )
}

export default Policy
