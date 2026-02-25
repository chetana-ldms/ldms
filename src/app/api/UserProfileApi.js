import { API } from '../../config/apiConfig'
import FetchWithToken from '../modules/auth/FetchWithToken'

const ChangePasswordUrl = API.CHANGE_PASSWORD
const ResetPasswordUrl = API.RESET_PASSWORD

export const fetchChangePasswordUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ChangePasswordUrl}`, {
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
export const fetchResetPasswordUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ResetPasswordUrl}`, {
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
