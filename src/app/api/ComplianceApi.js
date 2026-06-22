import FetchWithToken from "../modules/auth/FetchWithToken"

const ControlsTrackingUrl="http://10.41.3.232:501/api/Compliance/v1/Controls/Tracking"
const ControlsUpdateStatusUrl="http://10.41.3.232:501/api/Compliance/v1/Controls/UpdateStatus"
const ControlsStatusSummaryUrl="http://10.41.3.232:501/api/Compliance/v1/Controls/StatusSummary"
const ControlsDomainSummaryUrl="http://10.41.3.232:501/api/Compliance/v1/Controls/DomainSummary"
const ControlsDomainStatusSummaryUrl="http://10.41.3.232:501/api/Compliance/v1/Controls/DomainStatusSummary"
const ControlsTrackingAssignmentsUrl="http://10.41.3.232:501/api/Compliance/v1/Controls/Tracking/Assignments"
const RolesByParentRoleNameUrl="http://10.41.3.232:501/api/LDPSecurity/v1/RolesByParentRoleName"
const UsersByRoleIdUrl="http://10.41.3.232:501/api/LDPSecurity/v1/UsersByRoleId"
const ControlsTrackingAssignmentsSummaryUrl="http://10.41.3.232:501/api/Compliance/v1/Controls/Tracking/Assignments/Summary"

export const fetchControlsTrackingUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ControlsTrackingUrl}`, {
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
    const response = await FetchWithToken(`${ControlsUpdateStatusUrl}`, {
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
    const response = await FetchWithToken(`${ControlsStatusSummaryUrl}`, {
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
    const response = await FetchWithToken(`${ControlsDomainSummaryUrl}`, {
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
    const response = await FetchWithToken(`${ControlsDomainStatusSummaryUrl}`, {
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
    const response = await FetchWithToken(`${ControlsTrackingAssignmentsUrl}`, {
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
    const response = await FetchWithToken(`${RolesByParentRoleNameUrl}?parentRoleName=${encodeURIComponent(parentRoleName)}&orgId=${orgId}`, {
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
    const response = await FetchWithToken(`${UsersByRoleIdUrl}?roleid=${roleId}`, {
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
    const response = await FetchWithToken(`${ControlsTrackingAssignmentsSummaryUrl}`, {
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