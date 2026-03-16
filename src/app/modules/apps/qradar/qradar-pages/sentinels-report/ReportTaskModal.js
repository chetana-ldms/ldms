import React, {useEffect, useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {
  fetchSentinelReportTaskCreateUrl,
  fetchSentinelReportsTypesUrl,
} from '../../../../../api/SentinelsReportApi'
import {notify, notifyFail} from '../components/notification/Notification'

function ReportTaskModal({show, handleClose, refreshParent}) {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const [selectedInterval, setSelectedInterval] = useState('last-30-days')
  const [selectedFromDate, setSelectedFromDate] = useState(null)
  const [selectedToDate, setSelectedToDate] = useState(null)
  const [reportName, setReportName] = useState('')
  const [grouptName, setGrouptName] = useState('')
  const [reportContent, setReportContent] = useState([])
  console.log(reportContent, 'reportContent')
  const [selectedContent, setSelectedContent] = useState(null)
  console.log(selectedContent, 'selectedContent')
  const [frequency, setFrequency] = useState('one-time')
  const [recipients, setRecipients] = useState('')
  const [scheduleInterval, setScheduleInterval] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [reportFormats, setReportFormats] = useState({pdf: false, html: false})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          orgId: orgId,
          toolId: toolId,
        }
        const response = await fetchSentinelReportsTypesUrl(data)
        setReportContent(response.data.insightTypes)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [orgId, toolId])

  const handleIntervalChange = (e) => {
    setSelectedInterval(e.target.value)
  }

  const handleFromDateChange = (e) => {
    const value = e.target.value
    setSelectedFromDate(value ? new Date(value) : null)
  }

  const handleToDateChange = (e) => {
    const value = e.target.value
    setSelectedToDate(value ? new Date(value) : null)
  }

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value)
    if (e.target.value === 'one-time') {
      setSelectedInterval('last-30-days')
    }
  }

  const handleScheduleIntervalChange = (e) => {
    setScheduleInterval(e.target.value)
  }

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value)
  }

  const handleReportFormatChange = (e) => {
    setReportFormats({
      ...reportFormats,
      [e.target.name]: e.target.checked,
    })
  }
  const handleCreate = async () => {
    if (!reportName) {
      notifyFail('Enter Report Name')
      return
    }
    if (!selectedContent) {
      notifyFail('Enter Report Content')
      return
    }
    if (frequency === 'scheduled') {
      if (!scheduleInterval) {
        notifyFail('Interval is required for scheduled reports')
        return
      }
      if (scheduleInterval === 'weekly' && !selectedDay) {
        notifyFail('Day of the Week is required for weekly scheduled reports')
        return
      }
    }
    if (selectedInterval === 'manual') {
      if (!selectedFromDate) {
        notifyFail('From Date is required for manual reports')
        return
      }
      if (!selectedToDate) {
        notifyFail('To Date is required for manual reports')
        return
      }
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedFromDate > selectedToDate) {
        notifyFail('From Date should not be greater than To Date')
        return
      }
      // if (selectedFromDate >= today) {
      //   notifyFail("From Date should be less than today's date");
      //   return;
      // }
      const adjustedToDate = new Date(selectedToDate)
      adjustedToDate.setHours(0, 0, 0, 0)

      if (adjustedToDate > today) {
        notifyFail("To Date should be less than or equal to today's date")
        return
      }
    }
    const selectObject = reportContent
      .filter((item) => item.report_Id_Name === selectedContent)
      .map((item) => {
        // If selectedContent matches 'group_exec_insights', set the value of 'group_name'
        if (selectedContent === 'group_exec_insights') {
          const updatedItem = {...item}
          updatedItem.report_Args = updatedItem.report_Args.map((arg) => {
            if (arg.name === 'group_name') {
              return {...arg, value: grouptName} // Assign grouptName to the value field
            }
            return arg
          })
          return updatedItem
        }
        return item
      })
    console.log(selectObject, 'selectObject')
    const data = {
      scope: siteId ? 'site' : 'Account',
      name: reportName,
      insightTypes: selectObject,
      scheduleType: frequency === 'one-time' ? 'manually' : 'scheduled',
      recipients: recipients ? recipients.split(',').map((email) => email.trim()) : [],
      isTrend:
        frequency !== 'one-time' ? false : selectedInterval === 'last-30-days' ? true : false,
      toDate: selectedToDate ? selectedToDate.toISOString() : null,
      fromDate: selectedFromDate ? selectedFromDate.toISOString() : null,
      frequency:
        scheduleInterval === 'weekly'
          ? 'weekly'
          : scheduleInterval === 'monthly'
          ? 'monthly'
          : 'manually',
      day: selectedDay || null,
      attachmentTypes: Object.keys(reportFormats).filter((format) => reportFormats[format]),
      orgId: orgId,
      toolId: toolId,
      createdUserId: Number(sessionStorage.getItem('userId')),
      createdDate: new Date().toISOString(),
      orgAccountStructureLevel: [
        {
          levelName: 'AccountId',
          levelValue: accountId || '',
        },
        {
          levelName: 'SiteId',
          levelValue: siteId || '',
        },
      ],
    }
    try {
      const responseData = await fetchSentinelReportTaskCreateUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        closeButton()
        refreshParent()
        setReportName('')
        setSelectedContent('')
        setSelectedInterval('one-time')
        setSelectedFromDate(null)
        setSelectedToDate(null)
        setFrequency('one-time')
        setScheduleInterval('weekly')
        setSelectedDay(null)
        setReportFormats({pdf: false, html: false})
        setRecipients('')
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const closeButton = () => {
    handleClose()
    refreshParent()
    setReportName('')
    setSelectedContent('')
    setSelectedInterval('one-time')
    setSelectedFromDate(null)
    setSelectedToDate(null)
    setFrequency('one-time')
    setScheduleInterval('weekly')
    setSelectedDay(null)
    setReportFormats({pdf: false, html: false})
    setRecipients('')
  }

  return (
    <Modal
      backdrop='static'
      keyboard={false}
      show={show}
      onHide={closeButton}
      className='application-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title>New Report Task</Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className='card-body'>
            <div className='row mb-6 table-filter'>
              <div className='col-lg-4 mb-4 mb-lg-0'>
                <div className='form-group'>
                  <label htmlFor='reportName'>
                    Report Name <sup className='red'>*</sup>
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='reportName'
                    placeholder='Enter report name'
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>
              </div>
              <div className='col-lg-4 mb-4 mb-lg-0'>
                <div className='form-group'>
                  <label htmlFor='reportContent'>
                    Report Content <sup className='red'>*</sup>
                  </label>
                  <select
                    className='form-control'
                    id='reportContent'
                    value={selectedContent}
                    onChange={(e) => setSelectedContent(e.target.value)}
                  >
                    <option value=''>Select</option>
                    {reportContent?.map((item) => (
                      <option key={item.report_Id_Name} value={item.report_Id_Name}>
                        {item.display_Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedContent === 'group_exec_insights' && (
                <div className='col-lg-4 mb-4 mb-lg-0'>
                  <div className='form-group'>
                    <label htmlFor='grouptName'>
                      Group Name <sup className='red'>*</sup>
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='grouptName'
                      placeholder='Enter Group name'
                      value={grouptName}
                      onChange={(e) => setGrouptName(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className='row'>
              <div className='col-lg-12'>
                <label>Frequency</label>
                <div className='d-flex'>
                  <div className='d-flex align-items-center mr-3'>
                    <input
                      type='radio'
                      name='frequency'
                      id='oneTime'
                      value='one-time'
                      checked={frequency === 'one-time'}
                      onChange={handleFrequencyChange}
                    />
                    <label className='form-check-label ms-2' htmlFor='oneTime'>
                      One-time report
                    </label>
                  </div>
                  <div className='d-flex align-items-center ms-5'>
                    <input
                      type='radio'
                      name='frequency'
                      id='scheduled'
                      value='scheduled'
                      checked={frequency === 'scheduled'}
                      onChange={handleFrequencyChange}
                    />
                    <label className='form-check-label ms-2' htmlFor='scheduled'>
                      Scheduled report
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {frequency === 'one-time' && (
              <div className='row mt-3'>
                <div className='col-lg-12'>
                  <label>Interval</label>
                  <div className='d-flex'>
                    <div className='d-flex align-items-center mr-3'>
                      <input
                        type='radio'
                        name='interval'
                        id='last30Days'
                        value='last-30-days'
                        checked={selectedInterval === 'last-30-days'}
                        onChange={handleIntervalChange}
                      />
                      <label className='form-check-label ms-2' htmlFor='last30Days'>
                        Last 30 days
                      </label>
                    </div>
                    <div className='d-flex align-items-center ms-5'>
                      <input
                        type='radio'
                        name='interval'
                        id='manual'
                        value='manual'
                        checked={selectedInterval === 'manual'}
                        onChange={handleIntervalChange}
                      />
                      <label className='form-check-label ms-2' htmlFor='manual'>
                        Manual
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className='row mt-3'>
              <div className='col-lg-6'>
                {frequency === 'scheduled' && (
                  <div className='form-group'>
                    <label htmlFor='scheduleInterval'>Interval</label>
                    <select
                      className='form-control'
                      id='scheduleInterval'
                      value={scheduleInterval}
                      onChange={handleScheduleIntervalChange}
                    >
                      <option value=''>Select</option>
                      <option value='weekly'>Weekly</option>
                      <option value='monthly'>First of every month</option>
                    </select>
                  </div>
                )}
              </div>
              <div className='col-lg-6'>
                {frequency === 'scheduled' && scheduleInterval === 'weekly' && (
                  <div className='form-group'>
                    <label htmlFor='dayOfWeek'>Day of the Week</label>
                    <select
                      className='form-control'
                      id='dayOfWeek'
                      value={selectedDay}
                      onChange={handleDayChange}
                    >
                      <option value=''>Select</option>
                      <option value='monday'>Monday</option>
                      <option value='tuesday'>Tuesday</option>
                      <option value='wednesday'>Wednesday</option>
                      <option value='thursday'>Thursday</option>
                      <option value='friday'>Friday</option>
                      <option value='saturday'>Saturday</option>
                      <option value='sunday'>Sunday</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            {selectedInterval === 'manual' && frequency !== 'scheduled' && (
              <div className='row mt-3'>
                <div className='col-lg-12 d-flex'>
                  <div className='ps-2'>
                    <label className='no-margin pr-2 semi-bold'>From Date: </label>
                    <input
                      className='date'
                      type='date'
                      value={selectedFromDate ? selectedFromDate.toISOString().split('T')[0] : ''}
                      onChange={handleFromDateChange}
                    />
                  </div>
                  <div className='ps-2 ms-3'>
                    <label className='no-margin pr-2 semi-bold'>To Date: </label>
                    <input
                      className='date'
                      type='date'
                      value={selectedToDate ? selectedToDate.toISOString().split('T')[0] : ''}
                      onChange={handleToDateChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
        <div className='card-body'>
          <div className='form-group'>
            <label htmlFor='recipients'>Recipients (Optional)</label>
            <textarea
              className='form-control'
              id='recipients'
              placeholder='Type recipient emails, separated by commas'
              rows={3}
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
            />
          </div>
          {recipients && (
            <div className='form-group mt-3 '>
              <label>Report Format</label>
              <div className='d-flex'>
                <div className='form-check mr-5 d-flex align-items-center'>
                  <input
                    type='checkbox'
                    className='form-check-input'
                    id='pdfFormat'
                    name='pdf'
                    checked={reportFormats.pdf}
                    onChange={handleReportFormatChange}
                  />
                  <label className='form-check-label' htmlFor='pdfFormat'>
                    PDF
                  </label>
                </div>
                <div className='form-check d-flex align-items-center'>
                  <input
                    type='checkbox'
                    className='form-check-input'
                    id='htmlFormat'
                    name='html'
                    checked={reportFormats.html}
                    onChange={handleReportFormatChange}
                  />
                  <label className='form-check-label' htmlFor='htmlFormat'>
                    HTML
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={closeButton}>
          Close
        </Button>
        <Button variant='primary' onClick={handleCreate}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ReportTaskModal
