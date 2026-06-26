import FetchWithToken from "../modules/auth/FetchWithToken"
import { API } from "../../config/apiConfig"

export const fetchResolverSearchUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.RESOLVER_SEARCH}`, {
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
export const fetchResolverDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.RESOLVER_DELETE}`, {
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
export const fetchResolverAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.RESOLVER_ADD}`, {
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
export const fetchResolverUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.RESOLVER_UPDATE}`, {
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
export const fetchResolverMitreSetMappingUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.RESOLVER_MITRE_SET_MAPPING}`, {
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
export const fetchResolverMitreMappingsUrl = async (id) => {
  try {
    const response = await FetchWithToken(
      `${API.RESOLVER_MITRE_MAPPINGS}/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchGlobalStandardFieldsUrl = async () => {
  try {
    const response = await FetchWithToken(
      `${API.GLOBAL_STANDARD_FIELDS}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}