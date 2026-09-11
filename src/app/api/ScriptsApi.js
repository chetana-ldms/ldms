import FetchWithToken from "../modules/auth/FetchWithToken"
import { API } from "../../config/apiConfig"
const CREATE_ACTION_PARAMETER_URL = "http://10.41.3.232:501/api/ActionParameter/v1/CreateActionParameter"
const GET_ACTION_PARAMETERS_URL = "http://10.41.3.232:501/api/ActionParameter/v1/GetActionParameters"
const GET_ACTION_PARAMETER_DETAIL_URL = "http://10.41.3.232:501/api/ActionParameter/v1/GetActionParameterDetail"
const UPDATE_ACTION_PARAMETER_URL = "http://10.41.3.232:501/api/ActionParameter/v1/UpdateActionParameter"
const DELETE_ACTION_PARAMETER_URL = "http://10.41.3.232:501/api/ActionParameter/v1/DeleteActionParameter"

const CREATE_PLAYBOOK_NODE_URL = "http://10.41.3.232:501/api/PlaybookNode/v1/CreatePlaybookNode"
const GET_PLAYBOOK_NODES_URL = "http://10.41.3.232:501/api/PlaybookNode/v1/GetPlaybookNodes"
const GET_PLAYBOOK_NODE_DETAIL_URL = "http://10.41.3.232:501/api/PlaybookNode/v1/GetPlaybookNodeDetail"
const UPDATE_PLAYBOOK_NODE_URL = "http://10.41.3.232:501/api/PlaybookNode/v1/UpdatePlaybookNode"
const DELETE_PLAYBOOK_NODE_URL = "http://10.41.3.232:501/api/PlaybookNode/v1/DeletePlaybookNode"

export const fetchScriptSearchUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.SCRIPT_SEARCH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchScriptAddUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.SCRIPT_ADD}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchScriptUpdateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.SCRIPT_UPDATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchScriptDeleteUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.SCRIPT_DELETE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchScriptGetByIdUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${API.SCRIPT_GET_BY_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}

export const fetchCREATE_ACTION_PARAMETER_URL = async (data) => {
  try {
    const response = await FetchWithToken(`${CREATE_ACTION_PARAMETER_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchGET_ACTION_PARAMETERS_URL = async (data) => {
  try {
    const response = await FetchWithToken(`${GET_ACTION_PARAMETERS_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchGET_ACTION_PARAMETER_DETAIL_URL = async (data) => {
  try {
    const response = await FetchWithToken(`${GET_ACTION_PARAMETER_DETAIL_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchUPDATE_ACTION_PARAMETER_URL = async (data) => {
  try {
    const response = await FetchWithToken(`${UPDATE_ACTION_PARAMETER_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchDELETE_ACTION_PARAMETER_URL = async (data) => {
  try {
    const response = await FetchWithToken(`${DELETE_ACTION_PARAMETER_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}

export const fetchCREATE_PLAYBOOK_NODE_URL = async (data) => {
  try {
    const response = await FetchWithToken(`${CREATE_PLAYBOOK_NODE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchGET_PLAYBOOK_NODES_URL = async (data) => {
  try {
    const response = await FetchWithToken(`${GET_PLAYBOOK_NODES_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchGET_PLAYBOOK_NODE_DETAIL_URL = async (data) => {
  try {
    const response = await FetchWithToken(`${GET_PLAYBOOK_NODE_DETAIL_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchUPDATE_PLAYBOOK_NODE_URL = async (data) => {
  try {
    const response = await FetchWithToken(`${UPDATE_PLAYBOOK_NODE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchDELETE_PLAYBOOK_NODE_URL = async (data) => {
  try {
    const response = await FetchWithToken(`${DELETE_PLAYBOOK_NODE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}