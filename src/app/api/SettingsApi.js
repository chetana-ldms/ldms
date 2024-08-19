const SitesUrl = process.env.REACT_APP_SITES_URL
const SiteActionUrl = 'http://115.110.192.133:502/api/Alerts/v1/Agent/SiteAction'
const SoftwarePackagesUrl = 'http://115.110.192.133:502/api/Alerts/v1/SoftwarePackages'

export const fetchSitesUrl = async (data) => {
  try {
    const response = await fetch(`${SitesUrl}`, {
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
    const response = await fetch(`${SiteActionUrl}`, {
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
    const response = await fetch(`${SoftwarePackagesUrl}`, {
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
