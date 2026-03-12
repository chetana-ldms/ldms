import FetchWithToken from '../modules/auth/FetchWithToken'

const risksUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/Risks'
const vulnerabilitiesUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/Vulnerabilities'
const syncRisksUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/Risks/Sync'
const domainsUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/Domains'
const syncDomainsUrl = 'http://10.41.3.232:501/api/RiskManagement/v1/Domain/Sync'

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
export const fetchSyncRisksUrl= async (data) => {
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
export const fetchDomainsUrl = async () => {
  try {
    const response = await FetchWithToken(`${domainsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchSyncDomainsUrl= async (data) => {
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
