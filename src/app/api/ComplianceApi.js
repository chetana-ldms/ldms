import FetchWithToken from "../modules/auth/FetchWithToken"
import { API } from "../../config/apiConfig"

export const fetchControlsTrackingUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.CONTROLS_TRACKING}`, {
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
export const fetchControlsUpdateStatusUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.CONTROLS_UPDATE_STATUS}`, {
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
export const fetchControlsStatusSummaryUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.CONTROLS_STATUS_SUMMARY}`, {
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
export const fetchControlsDomainSummaryUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.CONTROLS_DOMAIN_SUMMARY}`, {
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
export const fetchControlsDomainStatusSummaryUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.CONTROLS_DOMAIN_STATUS_SUMMARY}`, {
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
export const fetchControlsTrackingAssignmentsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.CONTROLS_TRACKING_ASSIGNMENTS}`, {
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
export const fetchRolesByParentRoleNameUrl = async (parentRoleName, orgId) => {
  try {
    const response = await FetchWithToken(`${API.ROLES_BY_PARENT_ROLE_NAME}?parentRoleName=${encodeURIComponent(parentRoleName)}&orgId=${orgId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchUsersByRoleIdUrl = async (roleId) => {
  try {
    const response = await FetchWithToken(`${API.USERS_BY_ROLE_ID}?roleid=${roleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchControlsTrackingAssignmentsSummaryUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.CONTROLS_TRACKING_ASSIGNMENTS_SUMMARY}`, {
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