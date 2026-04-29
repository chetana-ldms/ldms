import FetchWithToken from '../modules/auth/FetchWithToken'

const risksUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/Risks/Search'
const vulnerabilitiesUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/Vulnerabilities'
const syncRisksUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/Risks/Sync'
const domainsUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/Domains'
const syncDomainsUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/Domain/Sync'
const ipsUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/Ips'
const syncIpsUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/IP/Sync'
const assetScanDetailsUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/AssetScanDetails'
const updateRisksUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/Risks/Update'
const deleteRisksUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/Risks/Delete'
const createRemediateRequestUrl =
  'http://10.41.3.232:501/api/RiskManagement/v1/CreateRemediateRequest'
const createWaiverRequestUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/CreateWaiverRequest'
const fetchWaiversRequestSearchUrl =
  'http://10.41.3.232:501/api/RiskManagement/v1/WaiversRequestSearch'
const ApproveOrRejectUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/RiskWaiver/ApproveOrReject'
const WaiverRequestDeleteUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/WaiverRequest/Delete'
const eligibleForWaiverRequestUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/Risks/EligibleForWaiverRequest'
const revokeWaiverRequestUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/RiskWaiver/Revoke'

export const fetchRisks = async (data) => {
  try {
    const response = await FetchWithToken(`${risksUrl}`, {
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
export const fetchVulnerabilities = async (data) => {
  try {
    const response = await FetchWithToken(`${vulnerabilitiesUrl}`, {
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
export const fetchSyncRisksUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${syncRisksUrl}`, {
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
export const fetchDomainsUrl = async (orgid, toolid) => {
  try {
    const response = await FetchWithToken(`${domainsUrl}?orgid=${orgid}&toolid=${toolid}`, {
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
export const fetchSyncDomainsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${syncDomainsUrl}`, {
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
export const fetchIpsUrl = async () => {
  try {
    const response = await FetchWithToken(`${ipsUrl}`, {
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
export const fetchSyncIpsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${syncIpsUrl}`, {
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
export const fetchAssetScanDetailsUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${assetScanDetailsUrl}`, {
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
export const fetchupdateRisksUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${updateRisksUrl}`, {
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
export const fetchdeleteRisksUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${deleteRisksUrl}`, {
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
export const fetchcreateRemediateRequestUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${createRemediateRequestUrl}`, {
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
export const fetchcreateWaiverRequestUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${createWaiverRequestUrl}`, {
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
export const fetchfetchWaiversRequestSearchUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${fetchWaiversRequestSearchUrl}`, {
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
export const fetchApproveOrRejectUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ApproveOrRejectUrl}`, {
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
export const fetchWaiverRequestDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${WaiverRequestDeleteUrl}`, {
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
export const fetcheligibleForWaiverRequestUrl = async (riskIds = [], toolId) => {
  try {
    const params = new URLSearchParams()
    riskIds.forEach((id) => params.append('riskIds', id))
    if (toolId) params.append('toolId', toolId)

    const response = await FetchWithToken(`${eligibleForWaiverRequestUrl}?${params.toString()}`, {
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
export const fetchrevokeWaiverRequestUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${revokeWaiverRequestUrl}`, {
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
