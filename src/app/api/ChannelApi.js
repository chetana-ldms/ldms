import { API } from "../../config/apiConfig"
import FetchWithToken from "../modules/auth/FetchWithToken"

const deleteUrl = API.FILE_DELETE
const uploadUrl = API.FILE_UPLOAD
const getUploadedFilesListUrl = API.GET_UPLOADED_FILES
const subItemsByOrgChannelUrl = API.SUBITEMS_BY_ORG_CHANNEL
const questionsUrl = API.QUESTIONS
const questionsAddUrl = API.QUESTIONS_ADD
const questionsAnswerAddUrl = API.QUESTIONS_ANSWER_ADD
const questionsUpdateUrl = API.QUESTIONS_UPDATE
const questionsDeleteUrl = API.QUESTIONS_DELETE
const questionsAnswerUpdateUrl = API.QUESTIONS_ANSWER_UPDATE
const questionsAnswerDeleteUrl = API.QUESTIONS_ANSWER_DELETE
const questionDetailsUrl = API.QUESTION_DETAILS
const answerDetailsUrl = API.ANSWER_DETAILS
const channelsUrl = API.CHANNELS
const channelsDeleteUrl = API.CHANNELS_DELETE
const channelsAddUrl = API.CHANNELS_ADD
const channelsUpdateUrl = API.CHANNELS_UPDATE
const channelDetailsUrl = API.CHANNEL_DETAILS
const listUrl = API.CHANNEL_LIST
const ChannelsCreateUrl = API.CHANNELS_CREATE
const FilesDownloadUrl = API.FILES_DOWNLOAD


export const fetchDelete = async (data) => {
  try {
    const response = await FetchWithToken(`${deleteUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    if (response.ok) {
      const responseData = await response.json()
      return responseData
    } else {
      throw new Error('File deletion failed')
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const fetchUpload = async (formData) => {
  try {
    const response = await fetch(`${uploadUrl}`, {
      method: 'POST',
      body: formData,
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchGetUploadedFilesListByChannelId = async (channelId) => {
  try {
    const response = await FetchWithToken(`${getUploadedFilesListUrl}?channelId=${channelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const uploadedFileList = responseData.uploadedFileList
    return uploadedFileList
  } catch (error) {
    console.log(error)
  }
}
export const fetchSubItemsByOrgChannel = async (data) => {
  try {
    const response = await FetchWithToken(`${subItemsByOrgChannelUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const channelSubItems = responseData.channelSubItems
    console.log(channelSubItems, 'channelSubItems')
    return channelSubItems
  } catch (error) {
    console.log(error)
  }
}
export const fetchQuestions = async (data) => {
  try {
    const response = await FetchWithToken(`${questionsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    const responseData = await response.json()
    const channelQAList = responseData.channelQAList
    return channelQAList
  } catch (error) {
    console.log(error)
  }
}
export const fetchQuestionsAdd = async (data) => {
  try {
    const response = await FetchWithToken(`${questionsAddUrl}`, {
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
export const fetchQuestionsAnswerAdd = async (data) => {
  try {
    const response = await FetchWithToken(`${questionsAnswerAddUrl}`, {
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
export const fetchQuestionsUpdate = async (data) => {
  try {
    const response = await FetchWithToken(`${questionsUpdateUrl}`, {
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
export const fetchQuestionsDelete = async (data) => {
  try {
    const response = await FetchWithToken(`${questionsDeleteUrl}`, {
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
export const fetchQuestionsAnswereUpdate = async (data) => {
  try {
    const response = await FetchWithToken(`${questionsAnswerUpdateUrl}`, {
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
export const fetchQuestionsAnswerDelete = async (data) => {
  try {
    const response = await FetchWithToken(`${questionsAnswerDeleteUrl}`, {
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
export const fetcQuestionDetails = async (questionId) => {
  try {
    const response = await FetchWithToken(`${questionDetailsUrl}?QuestionId=${questionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const channelQAData = responseData.channelQAData
    return channelQAData
  } catch (error) {
    console.log(error)
  }
}
export const fetchAnswerDetails = async (answerId) => {
  try {
    const response = await FetchWithToken(`${answerDetailsUrl}?AnswerId=${answerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const channelAnswerData = responseData.channelAnswerData
    return channelAnswerData
  } catch (error) {
    console.log(error)
  }
}
export const fetchChannels = async (orgId) => {
  try {
    const response = await FetchWithToken(`${channelsUrl}?orgId=${orgId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const responseData = await response.json()
    const channelsData = responseData.channelsData
    return channelsData
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const fetchChannelsDelete = async (data) => {
  try {
    const response = await FetchWithToken(`${channelsDeleteUrl}`, {
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
export const fetchChannelsAdd = async (data) => {
  try {
    const response = await FetchWithToken(`${channelsAddUrl}`, {
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
export const fetchChannelsUpdate = async (data) => {
  try {
    const response = await FetchWithToken(`${channelsUpdateUrl}`, {
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
export const fetchChannelDetails = async (channelId) => {
  try {
    const response = await FetchWithToken(`${channelDetailsUrl}?channelId=${channelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await response.json()
    const channelsData = responseData.channelsData
    return channelsData
  } catch (error) {
    console.log(error)
  }
}
export const fetchlistUrl = async (orgId) => {
  try {
    const response = await FetchWithToken(`${listUrl}?orgId=${orgId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const responseData = await response.json()
    const teams = responseData.teams
    return teams
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const fetchChannelsCreateUrl = async (data) => {
  try {
    const response = await FetchWithToken(`${ChannelsCreateUrl}`, {
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
export const fetchFilesDownloadUrl = async (fileId, CreatedUserId, orgId, channelId) => {
  try {
    const response = await FetchWithToken(`${FilesDownloadUrl}?fileId=${fileId}&Downloaduserid=${CreatedUserId}&OrgId=${orgId}&ChannelId=${channelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      return response
    } else {
      throw new Error('File download failed')
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}
// export const fetchFilesDownloadUrl = async (data) => {
//   try {
//     const response = await FetchWithToken(`${FilesDownloadUrl}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         ...data,
//       }),
//     })

//     if (response.ok) {
//       const responseData = await response.json()
//       return responseData
//     } else {
//       throw new Error('File deletion failed')
//     }
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }
