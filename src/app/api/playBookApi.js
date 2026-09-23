import {API} from '../../config/apiConfig'
import FetchWithToken from '../modules/auth/FetchWithToken'

const playBooksCreateUrl = API.PLAYBOOKS_CREATE
const playBooksUrl = API.PLAYBOOKS
const deletePlaybookUrl = API.DELETE_PLAYBOOK
const playbookByIdUrl = API.PLAYBOOK_BY_ID
const playbookUpdateUrl = API.PLAYBOOK_UPDATE

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
