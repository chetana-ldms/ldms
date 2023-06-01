import React, {useState} from 'react'

const DailyReports = () => {
  const [alerts, setAlerts] = useState(false)
  const [incidents, setIncidents] = useState(false)
  const [selectedReports, setSelectedReports] = useState([])

  const handleApply = () => {
    const reports = []

    if (alerts) {
      reports.push('Alert Reports')
    }

    if (incidents) {
      reports.push('Incident Reports')
    }

    setSelectedReports(reports)
  }

  return (
    <div className='daily-report'>
      <h6 className='mb-5'>Select Report</h6>
      <form>
        <div className='alert-label'>
          <input type='checkbox' checked={alerts} onChange={() => setAlerts(!alerts)} id='alerts' />

          <label htmlFor='alerts'>{''}Alert Reports</label>
        </div>
        <div className='alert-label'>
          <input
            type='checkbox'
            checked={incidents}
            onChange={() => setIncidents(!incidents)}
            id='incidents'
          />
          <label htmlFor='incidents'>Incident Reports</label>
        </div>
        <button
          type='button'
          className='btn btn-new btn-small btn-primary mt-5'
          onClick={handleApply}
        >
          Apply
        </button>
      </form>
      {selectedReports.length > 0 && (
        <div className='mt-5'>
          {selectedReports.map((report) => (
            <p className='text-blue' key={report}>
              Your daily <b className='fw-bold'>{report}</b> will be generated shortly!
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default DailyReports
