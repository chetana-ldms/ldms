const ChangePasswordUrl= "http://115.110.192.133:502/api/LDPSecurity/v1/User/ChangePassword"
const ResetPasswordUrl="http://115.110.192.133:502/api/LDPSecurity/v1/User/ResetPassword"

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