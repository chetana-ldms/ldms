import React, {useEffect, useState} from 'react'
import {fetchUpgradeMaintenanceDetailsUrl} from '../../../../../api/SentinalApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'

const MaintenanceWindow = () => {
  const [maintenanceWindow, setMaintenanceWindow] = useState([])
  console.log(maintenanceWindow, 'maintenanceWindow')
  const [loading, setLoading] = useState(false)
  const [maintenanceType, setMaintenanceType] = useState('agent_version_change')
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const orgId = Number(sessionStorage.getItem('orgId'))
  const timezones = [
    {value: 'GMT+14:00', label: 'GMT+14:00'},
    {value: 'GMT+13:00', label: 'GMT+13:00'},
    {value: 'GMT+12:00', label: 'GMT+12:00'},
    {value: 'GMT+11:00', label: 'GMT+11:00'},
    {value: 'GMT+10:00', label: 'GMT+10:00'},
    {value: 'GMT+09:00', label: 'GMT+09:00'},
    {value: 'GMT+08:00', label: 'GMT+08:00'},
    {value: 'GMT+07:00', label: 'GMT+07:00'},
    {value: 'GMT+06:00', label: 'GMT+06:00'},
    {value: 'GMT+05:00', label: 'GMT+05:00'},
    {value: 'GMT+04:00', label: 'GMT+04:00'},
    {value: 'GMT+03:00', label: 'GMT+03:00'},
    {value: 'GMT+02:00', label: 'GMT+02:00'},
    {value: 'GMT+01:00', label: 'GMT+01:00'},
    {value: 'GMT+00:00', label: 'GMT+00:00'},
    {value: 'GMT-01:00', label: 'GMT-01:00'},
    {value: 'GMT-02:00', label: 'GMT-02:00'},
    {value: 'GMT-03:00', label: 'GMT-03:00'},
    {value: 'GMT-04:00', label: 'GMT-04:00'},
    {value: 'GMT-05:00', label: 'GMT-05:00'},
    {value: 'GMT-06:00', label: 'GMT-06:00'},
    {value: 'GMT-07:00', label: 'GMT-07:00'},
    {value: 'GMT-08:00', label: 'GMT-08:00'},
    {value: 'GMT-09:00', label: 'GMT-09:00'},
    {value: 'GMT-10:00', label: 'GMT-10:00'},
    {value: 'GMT-11:00', label: 'GMT-11:00'},
  ]
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

        // Set 'enabled' and 'type' based on the backend data
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
      setMaintenanceSettings((prev) => ({
        ...prev,
        timezone: response?.data?.timezoneGmt || 'GMT+00:00',
        days,
      }))
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
  const convertTo24HourFormat = (time) => {
    const [hourMinute, period] = time.split(' ')
    let [hours, minutes] = hourMinute.split(':').map(Number)

    if (period?.toLowerCase() === 'pm' && hours !== 12) {
      hours += 12
    }
    if (period?.toLowerCase() === 'am' && hours === 12) {
      hours = 0
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const hour = hours % 12 || 12

    return `${hour}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  return (
    <div className='container'>
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
              Last modified: {getCurrentTimeZone(maintenanceWindow?.concurrencyConfigUpdatedAt)} by{' '}
              {maintenanceWindow?.concurrencyConfigUpdatedBy}.
            </span>
            {maintenanceWindow?.inheritParentConcurrencyConfig === true ? (
              <button className='link btn btn-link text-decoration-none'>Change Policy</button>
            ) : (
              <button className='link btn btn-link text-decoration-none'>
                Revert To Default Inherited Settings
              </button>
            )}
          </div>
        </div>
      </div>
      <div className='card mb-4'>
        <div className='card-body p-0 m-0 px-5 py-2'>
          <h5 className='card-title'>Maximum Concurrent Downloads</h5>
          <div className='form-group d-flex'>
            <div className='me-5 mt-2'>Maximum Concurrent Downloads for this Scope</div>
            <div>
              <input
                type='number'
                id='maxConcurrentDownloads'
                className='form-control'
                value={maintenanceWindow?.maxConcurrent}
                disabled={!maintenanceWindow?.inheritParentConcurrencyConfig}
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
              Last modified: {getCurrentTimeZone(maintenanceWindow?.maintenanceConfigUpdatedAt)} by{' '}
              {maintenanceWindow?.maintenanceConfigUpdatedBy}.
            </span>
            {maintenanceWindow?.inheritParentMaintenanceConfig === true ? (
              <button className='link btn btn-link text-decoration-none'>Change Policy</button>
            ) : (
              <button className='link btn btn-link text-decoration-none'>
                Revert To Default Inherited Settings
              </button>
            )}
          </div>
        </div>
      </div>
      <div className='card'>
        <div className='card-body p-0 m-0 px-5 pt-3'>
          <h5 className='card-title'>Maintenance Windows Settings</h5>
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
                disabled={maintenanceWindow?.inheritParentMaintenanceConfig}
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
            {Object.entries(maintenanceSettings.days).map(([day, settings]) => (
              <div key={day} className='form-check mb-3'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id={day}
                  checked={settings.enabled}
                  onChange={() => toggleDay(day)}
                  disabled={maintenanceWindow?.inheritParentMaintenanceConfig}
                />
                <label htmlFor={day} className='form-check-label'>
                  {day}
                </label>

                {settings.enabled && (
                  <div className='d-flex align-items-center mt-2'>
                    <select
                      className='form-control mr-2 p-0 ps-2'
                      style={{width: '120px'}}
                      value={settings.type}
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
                      disabled={maintenanceWindow?.inheritParentMaintenanceConfig}
                    >
                      <option>All Day</option>
                      <option>Custom</option>
                    </select>

                    {settings.type === 'Custom' && (
                      <>
                        <input
                          type='time'
                          className='form-control mr-2'
                          style={{width: '120px'}}
                          value={convertTo24HourFormat(settings?.customTime?.start || '00:00')}
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
                          value={convertTo24HourFormat(settings?.customTime?.end || '00:00')}
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
                          disabled={maintenanceWindow?.inheritParentMaintenanceConfig}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceWindow
