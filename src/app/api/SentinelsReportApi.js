const SentinelReportsUrl = process.env.REACT_APP_SENTINELREPORTS_URL
const SentinelReportsTypesUrl = process.env.REACT_APP_SENTINELREPORTS_TYPES_URL
const SentinelReportTaskCreateUrl =process.env.REACT_APP_SENTINELREPORTS_TASK_CREAT_URL
const SentinelReportDeleteUrl = process.env.REACT_APP_SENTINELREPORTS_DELETE_URL
const SentinelReportsTasksUrl = process.env.REACT_APP_SENTINELREPORTS_TASKS_URL
const SentinelReportTaskDeleteUrl =process.env.REACT_APP_SENTINELREPORTS_TASKS_DELETE_URL
const SentinelReportsDownloadUrl =process.env.REACT_APP_SENTINELREPORTS_DOWNLOAD_URL
const SentinelReportsTaskUpdateUrl =process.env.REACT_APP_SENTINELREPORTS_TASK_UPDATE_URL

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
