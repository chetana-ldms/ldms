import React, {useEffect, useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {
  fetchSentinelReportTaskCreateUrl,
  fetchSentinelReportsTaskUpdateUrl,
  fetchSentinelReportsTypesUrl,
} from '../../../../../api/SentinelsReportApi'
import {notify, notifyFail} from '../components/notification/Notification'

function ReportTaskModalEditPopup({show, onClose, refreshParent, selectedItem}) {
  console.log(selectedItem, 'selectedItem')
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const [selectedInterval, setSelectedInterval] = useState('last-30-days')
  const [selectedFromDate, setSelectedFromDate] = useState(null)
  const [selectedToDate, setSelectedToDate] = useState(null)
  const [reportName, setReportName] = useState('')
  const [reportContent, setReportContent] = useState([])
  const [selectedContent, setSelectedContent] = useState(null)
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
  useEffect(() => {
    if (selectedItem) {
      setReportName(selectedItem.name || '')
      setSelectedContent(selectedItem.insightTypes?.[0]?.report_Id_Name || '')
      setFrequency(selectedItem.scheduleType === 'manually' ? 'one-time' : 'scheduled')
      setRecipients(selectedItem.recipients?.join(', ') || '')
      setScheduleInterval(selectedItem.frequency || '')
      setSelectedDay(selectedItem.day || '')
      setReportFormats({
        pdf: selectedItem.attachmentTypes?.includes('pdf') || false,
        html: selectedItem.attachmentTypes?.includes('html') || false,
      })
      setSelectedInterval(selectedItem.isTrend ? 'last-30-days' : 'manual')
      setSelectedFromDate(selectedItem.fromDate ? new Date(selectedItem.fromDate) : null)
      setSelectedToDate(selectedItem.toDate ? new Date(selectedItem.toDate) : null)
    }
  }, [selectedItem])

  const handleIntervalChange = (e) => {
    setSelectedInterval(e.target.value)
  }

  const handleFromDateChange = (e) => {
    setSelectedFromDate(new Date(e.target.value))
  }

  const handleToDateChange = (e) => {
    setSelectedToDate(new Date(e.target.value))
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
    const data = {
      name: reportName,
      recipients: recipients ? recipients.split(',').map((email) => email.trim()) : [],
      attachmentTypes: Object.keys(reportFormats).filter((format) => reportFormats[format]),
      orgId: orgId,
      toolId: toolId,
      id: selectedItem.id,
      modifiedUserId: Number(sessionStorage.getItem('userId')),
      modifiedDate: new Date().toISOString(),
    }
    try {
      const responseData = await fetchSentinelReportsTaskUpdateUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        onClose()
        refreshParent()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal show={show} onHide={onClose} className='application-modal'>
      <Modal.Header closeButton>
        <Modal.Title>Edit Report Task</Modal.Title>
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
                    disabled
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
                      disabled
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
                      disabled
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
                        disabled
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
                        disabled
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
                      disabled
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
                      disabled
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
                      disabled
                    />
                  </div>
                  <div className='ps-2 ms-3'>
                    <label className='no-margin pr-2 semi-bold'>To Date: </label>
                    <input
                      className='date'
                      type='date'
                      value={selectedToDate ? selectedToDate.toISOString().split('T')[0] : ''}
                      onChange={handleToDateChange}
                      disabled
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
        <Button variant='secondary' onClick={onClose}>
          Close
        </Button>
        <Button variant='primary' onClick={handleCreate}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ReportTaskModalEditPopup
