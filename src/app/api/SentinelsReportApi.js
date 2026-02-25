import {API} from '../../config/apiConfig'
import FetchWithToken from '../modules/auth/FetchWithToken'

const SentinelReportsUrl = API.SENTINEL_REPORTS
const SentinelReportsTypesUrl = API.SENTINEL_REPORT_TYPES
const SentinelReportTaskCreateUrl = API.SENTINEL_REPORT_TASK_CREATE
const SentinelReportDeleteUrl = API.SENTINEL_REPORT_DELETE
const SentinelReportsTasksUrl = API.SENTINEL_REPORT_TASKS
const SentinelReportTaskDeleteUrl = API.SENTINEL_REPORT_TASK_DELETE
const SentinelReportsDownloadUrl = API.SENTINEL_REPORT_DOWNLOAD
const SentinelReportsTaskUpdateUrl = API.SENTINEL_REPORT_TASK_UPDATE

export const fetchSentinelReportsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${SentinelReportsUrl}`, {
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
    const response = await FetchWithToken(`${SentinelReportsTypesUrl}`, {
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
    const response = await FetchWithToken(`${SentinelReportTaskCreateUrl}`, {
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
    const response = await FetchWithToken(`${SentinelReportDeleteUrl}`, {
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
    const response = await FetchWithToken(`${SentinelReportsTasksUrl}`, {
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
    const response = await FetchWithToken(`${SentinelReportTaskDeleteUrl}`, {
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
    const response = await FetchWithToken(`${SentinelReportsDownloadUrl}`, {
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
    const response = await FetchWithToken(`${SentinelReportsTaskUpdateUrl}`, {
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
