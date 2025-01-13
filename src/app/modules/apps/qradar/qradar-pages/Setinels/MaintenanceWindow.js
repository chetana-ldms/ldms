import React, {useEffect, useState} from 'react'
import {
  fetchUpgradeMaintenanceDetailsUpdateUrl,
  fetchUpgradeMaintenanceDetailsUrl,
} from '../../../../../api/SentinalApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {timezones} from './timezones'
import {convertTo24HourFormat, convertTo12HourFormat} from './timeUtils'

const MaintenanceWindow = () => {
  const [maintenanceWindow, setMaintenanceWindow] = useState([])
  console.log(maintenanceWindow.inheritParentConcurrencyConfig, 'maintenanceWindow')
  const [loading, setLoading] = useState(false)
  const [maintenanceType, setMaintenanceType] = useState('agent_version_change')
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [concurrencyConfig, setConcurrencyConfig] = useState(false)
  const [maintenanceConfig, setMaintenanceConfig] = useState(false)
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    timezone: 'GMT+00:00',
    days: {
      Monday: {enabled: false, type: 'All Day', customTime: {start: '', end: ''}},
      Tuesday: {enabled: true, type: 'All Day', customTime: {start: '', end: ''}},
      Wednesday: {enabled: true, type: 'All Day', customTime: {start: '', end: ''}},
      Thursday: {enabled: true, type: 'All Day', customTime: {start: '', end: ''}},
      Friday: {enabled: true, type: 'All Day', customTime: {start: '', end: ''}},
      Saturday: {enabled: true, type: 'All Day', customTime: {start: '', end: ''}},
      Sunday: {enabled: true, type: 'All Day', customTime: {start: '', end: ''}},
    },
  })
  const reload = async () => {
    const data = {
      orgId: orgId,
      toolId: toolId,
      maintenceType: maintenanceType,
      orgAccountStructureLevel: [
        {levelName: 'AccountId', levelValue: accountId || ''},
        {levelName: 'SiteId', levelValue: siteId || ''},
        {levelName: 'GroupId', levelValue: groupId || ''},
      ],
    }

    try {
      setLoading(true)
      const response = await fetchUpgradeMaintenanceDetailsUrl(data)
      const maintenanceWindowsByDay = response?.data?.maintenanceWindowsByDay || {}
      const days = Object.keys(maintenanceWindowsByDay).reduce((acc, day) => {
        const {isMaintenanceAllDay, maintenanceHours} = maintenanceWindowsByDay[day]
        acc[day] = {
          enabled: !!isMaintenanceAllDay || maintenanceHours.length > 0,
          type: isMaintenanceAllDay ? 'All Day' : 'Custom',
          customTime: maintenanceHours.length
            ? {
                start: maintenanceHours[0]?.fromTime || '',
                end: maintenanceHours[0]?.toTime || '',
              }
            : {start: '', end: ''},
        }

        return acc
      }, {})

      setMaintenanceWindow(response?.data)
      const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      allDays.forEach((day) => {
        if (!days[day]) {
          days[day] = {enabled: false, type: 'All Day', customTime: {start: '', end: ''}}
        }
      })
      setMaintenanceSettings((prev) => ({
        ...prev,
        timezone: response?.data?.timezoneGmt || 'GMT+00:00',
        days,
      }))
      setConcurrencyConfig(response?.data?.inheritParentConcurrencyConfig || false)
      setMaintenanceConfig(response?.data?.inheritParentMaintenanceConfig || false)
    } catch (error) {
      console.error('Error loading maintenance settings:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    reload()
  }, [maintenanceType])
  const handleMaintenanceTypeChange = (e) => {
    setMaintenanceType(e.target.value)
  }
  const toggleDay = (day) => {
    setMaintenanceSettings((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          enabled: !prev.days[day].enabled,
        },
      },
    }))
  }
  const handleMaxConcurrentChange = (event) => {
    const newValue = event.target.value
    setMaintenanceWindow((prev) => ({
      ...prev,
      maxConcurrent: newValue,
    }))
  }
  const handleInheritSettingsChange = (isChecked) => {
    setConcurrencyConfig(isChecked)
    setMaintenanceWindow((prev) => ({
      ...prev,
      inheritParentConcurrencyConfig: isChecked,
    }))
  }
  const handleInheritSettingsChangeMaintenance = (isChecked) => {
    setMaintenanceConfig(isChecked)
    setMaintenanceWindow((prev) => ({
      ...prev,
      inheritParentMaintenanceConfig: isChecked,
    }))
  }
  const handleSave = async () => {
    const enabledDays = Object.keys(maintenanceSettings.days).reduce((acc, day) => {
      const daySettings = maintenanceSettings.days[day];
      if (daySettings.enabled) {
        acc[day] = {
          isMaintenanceAllDay: daySettings.type === 'All Day',
          maintenanceHours:
            daySettings.type === 'Custom'
              ? [
                  {
                    fromTime: daySettings.customTime.start, // Already in 12-hour format
                    toTime: daySettings.customTime.end,   // Already in 12-hour format
                  },
                ]
              : [],
        };
      }
      return acc;
    }, {});
  
    const payload = {
      data: {
        inheritParentConcurrencyConfig: concurrencyConfig,
        inheritParentMaintenanceConfig: maintenanceConfig,
        maxConcurrent: Number(maintenanceWindow?.maxConcurrent),
        maintenanceWindowsByDay: enabledDays,
        taskType: maintenanceType,
        timezoneGmt: maintenanceSettings.timezone,
      },
      orgId,
      toolId,
      orgAccountStructureLevel: [
        { levelName: 'AccountId', levelValue: accountId || '' },
        { levelName: 'SiteId', levelValue: siteId || '' },
        { levelName: 'GroupId', levelValue: groupId || '' },
      ],
    };
  
    try {
      setLoading(true);
      const response = await fetchUpgradeMaintenanceDetailsUpdateUrl(payload);
      const { isSuccess, message } = response;
      if (isSuccess) {
        notify(message);
        reload(); // Reload the data
      } else {
        notifyFail(message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className='container'>
      <ToastContainer />
      {loading && <UsersListLoading />}
      {/* Maximum Concurrent Downloads Card */}
      <div className='card mb-1'>
        <div className='card-body p-0 m-0 px-5'>
          <div className='d-flex align-items-center py-3'>
            <label className='me-2' htmlFor='maintenanceType'>
              Maintenance Type :
            </label>
            <select
              id='maintenanceType'
              className='form-control p-0 m-0 px-2'
              style={{width: 'auto'}}
              value={maintenanceType}
              onChange={handleMaintenanceTypeChange}
            >
              <option value='agent_version_change'>Agent Version Change</option>
              <option value='agents_upgrade'>Agents Upgrade</option>
            </select>
          </div>
        </div>
      </div>
      <div className='card mb-1'>
        <div className='card-body p-0 m-0 px-5'>
          <div className='d-flex justify-content-between align-items-center'>
            <span className='text-muted'>
              {concurrencyConfig === true
                ? groupId && siteId && accountId
                  ? 'Inherited from the site level'
                  : siteId && accountId
                  ? 'Inherited from the account level'
                  : accountId
                  ? 'Inherited from the global level'
                  : `Last modified: ${getCurrentTimeZone(
                      maintenanceWindow?.concurrencyConfigUpdatedAt
                    )} by ${maintenanceWindow?.concurrencyConfigUpdatedBy}.`
                : `Last modified: ${getCurrentTimeZone(
                    maintenanceWindow?.concurrencyConfigUpdatedAt
                  )} by ${maintenanceWindow?.concurrencyConfigUpdatedBy}.`}
            </span>
          </div>
        </div>
      </div>

      <div className='card mb-4'>
        <div className='card-body p-0 m-0 px-5 py-2'>
          <div className='d-flex align-items-center'>
            <h5 className='card-title me-5'>Maximum Concurrent Downloads</h5>
            <div className='form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                id='inheritDefaultSettings'
                checked={concurrencyConfig === true}
                onChange={(e) => handleInheritSettingsChange(e.target.checked)}
              />
              <label className='form-check-label' htmlFor='inheritDefaultSettings'>
                Default Inherited Settings
              </label>
            </div>
          </div>
          <div className='form-group d-flex mt-3'>
            <div className='me-5 mt-2'>Maximum Concurrent Downloads for this Scope</div>
            <div>
              <input
                type='number'
                id='maxConcurrentDownloads'
                className='form-control'
                value={maintenanceWindow?.maxConcurrent}
                disabled={concurrencyConfig === true}
                onChange={handleMaxConcurrentChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Windows Card */}
      <div className='card mb-1'>
        <div className='card-body p-0 m-0 px-5'>
          <div className='d-flex justify-content-between align-items-center'>
            <span className='text-muted'>
              {maintenanceConfig === true
                ? groupId && siteId && accountId
                  ? 'Inherited from the site level'
                  : siteId && accountId
                  ? 'Inherited from the account level'
                  : accountId
                  ? 'Inherited from the global level'
                  : `Last modified: ${getCurrentTimeZone(
                      maintenanceWindow?.maintenanceConfigUpdatedAt
                    )} by ${maintenanceWindow?.maintenanceConfigUpdatedBy}.`
                : `Last modified: ${getCurrentTimeZone(
                    maintenanceWindow?.maintenanceConfigUpdatedAt
                  )} by ${maintenanceWindow?.maintenanceConfigUpdatedBy}.`}
            </span>
          </div>
        </div>
      </div>

      <div className='card'>
        <div className='card-body p-0 m-0 px-5 pt-3'>
          <div className='d-flex align-items-center'>
            <h5 className='card-title me-5'>Maintenance Windows Settings</h5>
            <div className='form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                id='inheritDefaultSettings'
                checked={maintenanceConfig === true}
                onChange={(e) => handleInheritSettingsChangeMaintenance(e.target.checked)}
              />
              <label className='form-check-label' htmlFor='inheritDefaultSettings'>
                Default Inherited Settings
              </label>
            </div>
          </div>
          <div className='form-group d-flex'>
            <div className='me-5 mt-2'>
              The selected time zone applies to all days in the Scope maintenance window.
            </div>
            <div>
              <select
                id='timezone'
                className='form-control'
                style={{height: 40}}
                value={maintenanceSettings.timezone}
                onChange={(e) =>
                  setMaintenanceSettings({...maintenanceSettings, timezone: e.target.value})
                }
                disabled={maintenanceConfig === true}
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            {/* Hardcode each day and bind it with backend data */}
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
              (day) => (
                <div key={day} className='form-check mb-3'>
                  <input
                    type='checkbox'
                    className='form-check-input'
                    id={day}
                    checked={maintenanceSettings.days[day]?.enabled}
                    onChange={() => toggleDay(day)}
                    disabled={maintenanceConfig == true}
                  />
                  <label htmlFor={day} className='form-check-label'>
                    {day}
                  </label>

                  {maintenanceSettings.days[day]?.enabled && (
                    <div className='d-flex align-items-center mt-2'>
                      <select
                        className='form-control mr-2 p-0 ps-2'
                        style={{width: '120px'}}
                        value={maintenanceSettings.days[day]?.type}
                        onChange={(e) =>
                          setMaintenanceSettings((prev) => ({
                            ...prev,
                            days: {
                              ...prev.days,
                              [day]: {
                                ...prev.days[day],
                                type: e.target.value,
                              },
                            },
                          }))
                        }
                        disabled={maintenanceConfig == true}
                      >
                        <option>All Day</option>
                        <option>Custom</option>
                      </select>

                      {maintenanceSettings.days[day]?.type === 'Custom' && (
                        <>
                          <input
                            type='time'
                            className='form-control mr-2'
                            style={{width: '120px'}}
                            value={convertTo24HourFormat(
                              maintenanceSettings.days[day]?.customTime?.start || '00:00'
                            )}
                            onChange={(e) =>
                              setMaintenanceSettings((prev) => ({
                                ...prev,
                                days: {
                                  ...prev.days,
                                  [day]: {
                                    ...prev.days[day],
                                    customTime: {
                                      ...prev.days[day].customTime,
                                      start: convertTo12HourFormat(e.target.value),
                                    },
                                  },
                                },
                              }))
                            }
                          />
                          <span>to</span>
                          <input
                            type='time'
                            className='form-control ml-2'
                            style={{width: '120px'}}
                            value={convertTo24HourFormat(
                              maintenanceSettings.days[day]?.customTime?.end || '00:00'
                            )}
                            onChange={(e) =>
                              setMaintenanceSettings((prev) => ({
                                ...prev,
                                days: {
                                  ...prev.days,
                                  [day]: {
                                    ...prev.days[day],
                                    customTime: {
                                      ...prev.days[day].customTime,
                                      end: convertTo12HourFormat(e.target.value),
                                    },
                                  },
                                },
                              }))
                            }
                            disabled={maintenanceConfig == true}
                          />
                        </>
                      )}
                    </div>
                  )}
               
                </div>
              )
            )}
          </div>
          <div className='d-flex justify-content-end mb-2 me-3'>
            <button className='btn btn-sm btn-primary' onClick={handleSave} disabled={loading}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceWindow
