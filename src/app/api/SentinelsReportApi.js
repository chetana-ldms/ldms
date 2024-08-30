const SentinelReportsUrl = 'http://115.110.192.133:502/api/Alerts/v1/SentinelReports'
const SentinelReportsTypesUrl = 'http://115.110.192.133:502/api/Alerts/v1/SentinelReports/Types'
const SentinelReportTaskCreateUrl =
  'http://115.110.192.133:502/api/Alerts/v1/SentinelReport/Task/Create'
const SentinelReportDeleteUrl = 'http://115.110.192.133:502/api/Alerts/v1/SentinelReport/Delete'
const SentinelReportsTasksUrl = 'http://115.110.192.133:502/api/Alerts/v1/SentinelReports/Tasks'
const SentinelReportTaskDeleteUrl =
  'http://115.110.192.133:502/api/Alerts/v1/SentinelReport/Task/Delete'
const SentinelReportsDownloadUrl =
  'http://115.110.192.133:502/api/Alerts/v1/SentinelReports/Download'
const SentinelReportsTaskUpdateUrl =
  'http://115.110.192.133:502/api/Alerts/v1/SentinelReports/Task/Update'

export const fetchSentinelReportsUrl = async (data) => {
  try {
    const response = await fetch(`${SentinelReportsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchSentinelReportsTypesUrl = async (data) => {
  try {
    const response = await fetch(`${SentinelReportsTypesUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchSentinelReportTaskCreateUrl = async (data) => {
  try {
    const response = await fetch(`${SentinelReportTaskCreateUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchSentinelReportDeleteUrl = async (data) => {
  try {
    const response = await fetch(`${SentinelReportDeleteUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchSentinelReportsTasksUrl = async (data) => {
  try {
    const response = await fetch(`${SentinelReportsTasksUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchSentinelReportTaskDeleteUrl = async (data) => {
  try {
    const response = await fetch(`${SentinelReportTaskDeleteUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchSentinelReportsDownloadUrl = async (data) => {
  try {
    const response = await fetch(`${SentinelReportsDownloadUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchSentinelReportsTaskUpdateUrl = async (data) => {
  try {
    const response = await fetch(`${SentinelReportsTaskUpdateUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
