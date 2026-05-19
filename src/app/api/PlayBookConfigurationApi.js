import FetchWithToken from "../modules/auth/FetchWithToken"
const ResolverSearchUrl = 'http://10.41.3.232:501/api/ResolverEngine/v1/Resolver/Search'
const ResolverDeleteUrl = 'http://10.41.3.232:501/api/ResolverEngine/v1/Resolver/Delete'

export const fetchResolverSearchUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ResolverSearchUrl}`, {
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
    const response = await FetchWithToken(`${ResolverDeleteUrl}`, {
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