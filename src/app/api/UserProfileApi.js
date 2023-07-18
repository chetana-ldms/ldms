

const ChangePasswordUrl= process.env.REACT_APP_CHANGE_PASSWORD_URL
const ResetPasswordUrl=process.env.REACT_APP_RESET_PASSWORD_URL

export const fetchChangePasswordUrl = async (data) => {
    try {
      const response = await fetch(`${ChangePasswordUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchResetPasswordUrl = async (data) => {
    try {
      const response = await fetch(`${ResetPasswordUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };