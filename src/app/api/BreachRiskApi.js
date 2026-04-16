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
