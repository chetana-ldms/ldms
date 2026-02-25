import { API } from '../../config/apiConfig'
import FetchWithToken from '../modules/auth/FetchWithToken'

const ApplicationsAndRisksUrl = API.APPLICATIONS_AND_RISKS
const ApplicationInventoryUrl = API.APPLICATION_INVENTORY
const ApplicationEndPointsUrl = API.APPLICATION_ENDPOINTS
const ApplicationCVSUrl = API.APPLICATION_CVES
const EndPointDetailsUrl = API.ENDPOINT_DETAILS
const EndPointApplicationsUrl = API.ENDPOINT_APPLICATIONS
const InventoryApplicationsEndpointsUrl = API.INVENTORY_APPLICATION_ENDPOINTS
const EndPointUpdatesUrl = API.ENDPOINT_UPDATES
const ApplicationManagementSettingsUrl = API.APPLICATION_MANAGEMENT_SETTINGS
const CVEMarkAsFalsePositiveUrl = API.CVE_MARK_FALSE_POSITIVE
const MissingCVEAddUrl = API.MISSING_CVE_ADD
const ApplicationManagementSettingsUpdateUrl = API.APPLICATION_SETTINGS_UPDATE


export const fetchApplicationsAndRisksUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ApplicationsAndRisksUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    // const applicationList = responseData.applicationList;
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchApplicationInventoryUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ApplicationInventoryUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const applicationList = responseData.applicationList
    return applicationList
  } catch (error) {
    console.log(error)
  }
}
export const fetchApplicationEndPointsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ApplicationEndPointsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const endPoints = responseData.endPoints
    return endPoints
  } catch (error) {
    console.log(error)
  }
}
export const fetchApplicationCVSUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ApplicationCVSUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const cvsList = responseData.cvsList
    return cvsList
  } catch (error) {
    console.log(error)
  }
}
export const fetchAEndPointDetailsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${EndPointDetailsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const endPoints = responseData.endPoints
    return endPoints
  } catch (error) {
    console.log(error)
  }
}
export const fetchEndPointApplicationsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${EndPointApplicationsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    // const data = responseData.data;
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchInventoryApplicationsEndpointsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${InventoryApplicationsEndpointsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const endPoints = responseData.endPoints
    return endPoints
  } catch (error) {
    console.log(error)
  }
}
export const fetchEndPointUpdatesUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${EndPointUpdatesUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const endPointUpdateList = responseData.endPointUpdateList
    return endPointUpdateList
  } catch (error) {
    console.log(error)
  }
}
export const fetchApplicationManagementSettingsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ApplicationManagementSettingsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    // const appSettings = responseData.appSettings;
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchCVEMarkAsFalsePositiveUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${CVEMarkAsFalsePositiveUrl}`, {
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
export const fetchMissingCVEAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${MissingCVEAddUrl}`, {
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
export const fetchApplicationManagementSettingsUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ApplicationManagementSettingsUpdateUrl}`, {
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
