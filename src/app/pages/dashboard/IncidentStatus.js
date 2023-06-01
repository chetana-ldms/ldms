import {useState, useEffect} from 'react'

function IncidentStatus() {
  const [data, setData] = useState([])
  const [alertData, setAlertData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const statusNames = alertData.map((alert) => alert.statusName)
  const alertCounts = alertData.map((alert) => alert.alertCount)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://115.110.192.133:502/api/Reports/v1/AllIncidentsSummery',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orgId: 1,
              incidentFromDate: '2022-04-13T05:43:48.828Z',
              incidentToDate: '2023-04-13T05:43:48.828Z',
            }),
          }
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Network response was not ok: ${response.status} - ${errorData.message}`)
        }

        const {data} = await response.json() // destructure the 'data' property from the response object
        setAlertData(data)
        setSelectedStatus(data[0]?.statusName || '')
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSelectChange = (event) => {
    setSelectedStatus(event.target.value)
  }

  const alertCount = alertCounts[statusNames.indexOf(selectedStatus)] || 0

  return (
    <div className='card-body'>
      <div className='row'>
        <label className='form-label fw-normal fs-12 col-lg-5 lh-40 fc-gray fs-14'>
          <span>Incident by status:</span>
        </label>
        <div className='col-lg-6 header-filter'>
          {alertData.length > 0 && (
            <select
              className='form-select form-select-solid bg-blue-light'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              value={selectedStatus}
              onChange={handleSelectChange}
            >
              {statusNames.map((statusName, index) => (
                <option key={index} value={statusName}>
                  {statusName}
                </option>
              ))}
            </select>
          )}
        </div>
        {alertData.length > 0 && (
          <div className='row bar-chart mt-8'>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {selectedStatus && (
              <>
                <div className='col-lg-3'>
                  <span className='text text-right d-block'>{selectedStatus}</span>{' '}
                </div>
                <div className='col-lg-7'>
                  <span className='bar'>{alertCount}</span>
                </div>
                <div className='col-lg-2'>
                  <span>Total</span> <span>{alertCount}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default IncidentStatus
