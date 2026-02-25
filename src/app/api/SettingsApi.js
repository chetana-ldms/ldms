import {API} from '../../config/apiConfig'
import FetchWithToken from '../modules/auth/FetchWithToken'

const SitesUrl = API.SITES
const SiteActionUrl = API.AGENT_SITE_ACTION
const SoftwarePackagesUrl = API.SOFTWARE_PACKAGES
const SitesCreateUrl = API.SITE_CREATE
const SitesUpdateUrl = API.SITE_UPDATE

export const fetchSitesUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${SitesUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const result = responseData.data
    return result
  } catch (error) {
    console.log(error)
  }
}
export const fetchSiteActionUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${SiteActionUrl}`, {
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
export const fetchSoftwarePackagesUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${SoftwarePackagesUrl}`, {
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
export const fetchSitesCreateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${SitesCreateUrl}`, {
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
export const fetchSitesUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${SitesUpdateUrl}`, {
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
