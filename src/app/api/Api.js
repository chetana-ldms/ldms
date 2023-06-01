const MasterData = "http://115.110.192.133:502/api/LDPlattform/v1/MasterData";

const Organizations = "http://115.110.192.133:502/api/LDPlattform/v1/Organizations";

const Authenticate = "http://115.110.192.133:502/api/LDPSecurity/v1/User/Authenticate";




export const fetchMasterData = async (maserDataType) => {

  try {

    const response = await fetch(`${MasterData}`, {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

      },

      body: JSON.stringify({

        maserDataType: maserDataType

      }),

    });

 

    const responseData = await response.json();

    return responseData.masterData.map(obj => obj.dataValue);

  } catch (error) {

    console.log(error)

  }

}




export const fetchAuthenticate = async (userName, password, orgId) => {

  try {

    const response = await fetch(`${Authenticate}`, {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

      },

      body: JSON.stringify({

        userName: userName,

        password: password,

        orgId : orgId

      }),

    });

 

    const responseData = await response.json();

    return responseData;

  } catch (error) {

    console.log(error)

  }

}

export const fetchOrganizations = async () => {

  try {

    const response = await fetch(`${Organizations}`, {

      method: 'GET',

      headers: {

        'Content-Type': 'application/json',

      }

    });

    const responseData = await response.json();

    return responseData.organizationList




  } catch (error) {

    console.log(error)

  }

}