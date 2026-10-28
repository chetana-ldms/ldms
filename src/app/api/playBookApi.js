import {API} from '../../config/apiConfig'
import FetchWithToken from '../modules/auth/FetchWithToken'

const playBooksCreateUrl = API.PLAYBOOKS_CREATE
const playBooksUrl = API.PLAYBOOKS
const deletePlaybookUrl = API.DELETE_PLAYBOOK
const playbookByIdUrl = API.PLAYBOOK_BY_ID
const playbookUpdateUrl = API.PLAYBOOK_UPDATE
const getExecutionHistoryUrl = "http://10.41.3.232:501/api/AutomationExecution/v1/GetExecutionHistory"
const getExecutionDetailsUrl = "http://10.41.3.232:501/api/AutomationExecution/v1/GetExecutionDetails"

export const fetchplayBooksCreateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${playBooksCreateUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    console.log(responseData, 'responseData111')
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchDelete = async (data) => {
  try {
    const response = await FetchWithToken(`${deletePlaybookUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    console.log(responseData, 'responseData111')
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchPlayBooks = async (data) => {
  try {
    const response = await FetchWithToken(`${playBooksUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    console.log(responseData, 'responseData111')
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchplaybookByIdUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${playbookByIdUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchPlaybookUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${playbookUpdateUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchgetExecutionHistoryUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${getExecutionHistoryUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchgetExecutionDetailsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${getExecutionDetailsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
