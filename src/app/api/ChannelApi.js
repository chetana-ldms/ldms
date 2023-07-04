const deleteUrl = process.env.REACT_APP_FILE_DELETE;
const uploadUrl = process.env.REACT_APP_FILE_UPLOAD;
const getUploadedFilesListUrl = process.env.REACT_APP_GET_UPLOADED_FILES;
const subItemsByOrgChannelUrl =
  process.env.REACT_APP_SUBITEMS_BY_ORG_CHANNEL_URL;
const questionsUrl = process.env.REACT_APP_QUESTIONS_URL;
const questionsAddUrl = process.env.REACT_APP_QUESTIONS_ADD_URL;
const questionsAnswerAddUrl = process.env.REACT_APP_QUESTIONS_ANSWER_ADD_URL;
const questionsUpdateUrl = process.env.REACT_APP_QUESTIONS_UPDATE_URL;
const questionsDeleteUrl = process.env.REACT_APP_QUESTIONS_DELETE_URL;
const questionsAnswerUpdateUrl =
  process.env.REACT_APP_QUESTIONS_ANSWER_UPDATE_URL;
const questionsAnswerDeleteUrl =
  process.env.REACT_APP_QUESTIONS_ANSWER_DELETE_URL;
const questionDetailsUrl = process.env.REACT_APP_QUESTION_DETAILS_URL;
const answerDetailsUrl = process.env.REACT_APP_ANSWER_DETAILS_URL;
const channelsUrl = process.env.REACT_APP_CHANNELS_URL;
const channelsDeleteUrl = process.env.REACT_APP_CHANNELS_DELETE_URL;
const channelsAddUrl = process.env.REACT_APP_CHANNELS_ADD_URL;
const channelsUpdateUrl = process.env.REACT_APP_CHANNELS_UPDATE_URL;
const channelDetailsUrl = process.env.REACT_APP_CHANNEL_DETAILS_URL;
const listUrl = process.env.REACT_APP_CHANNEL_LIST_URL;
const ChannelsCreateUrl = process.env.REACT_APP_CHANNELS_CREATE_URL;
const FilesDownloadUrl ="http://115.110.192.133:502/api/File/v1/Files/Download"


export const fetchDelete = async (formData) => {
  try {
    const response = await fetch(`${deleteUrl}`, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchUpload = async (formData) => {
  try {
    const response = await fetch(`${uploadUrl}`, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchGetUploadedFilesListByChannelId = async (channelId) => {
  try {
    const response = await fetch(
      `${getUploadedFilesListUrl}?channelId=${channelId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = await response.json();
    const uploadedFileList = responseData.uploadedFileList;
    return uploadedFileList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchSubItemsByOrgChannel = async (data) => {
  try {
    const response = await fetch(`${subItemsByOrgChannelUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    const channelSubItems = responseData.channelSubItems;
    console.log(channelSubItems, "channelSubItems");
    return channelSubItems;
  } catch (error) {
    console.log(error);
  }
};
export const fetchQuestions = async (data) => {
  try {
    const response = await fetch(`${questionsUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    const responseData = await response.json();
    const channelQAList = responseData.channelQAList;
    return channelQAList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchQuestionsAdd = async (data) => {
  try {
    const response = await fetch(`${questionsAddUrl}`, {
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
export const fetchQuestionsAnswerAdd = async (data) => {
  try {
    const response = await fetch(`${questionsAnswerAddUrl}`, {
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
export const fetchQuestionsUpdate = async (data) => {
  try {
    const response = await fetch(`${questionsUpdateUrl}`, {
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
export const fetchQuestionsDelete = async (data) => {
  try {
    const response = await fetch(`${questionsDeleteUrl}`, {
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
export const fetchQuestionsAnswereUpdate = async (data) => {
  try {
    const response = await fetch(`${questionsAnswerUpdateUrl}`, {
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
export const fetchQuestionsAnswerDelete = async (data) => {
  try {
    const response = await fetch(`${questionsAnswerDeleteUrl}`, {
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
export const fetcQuestionDetails = async (questionId) => {
  try {
    const response = await fetch(
      `${questionDetailsUrl}?QuestionId=${questionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = await response.json();
    const channelQAData = responseData.channelQAData;
    return channelQAData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchAnswerDetails = async (answerId) => {
  try {
    const response = await fetch(`${answerDetailsUrl}?AnswerId=${answerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    const channelAnswerData = responseData.channelAnswerData;
    return channelAnswerData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchChannels = async (orgId) => {
  try {
    const response = await fetch(`${channelsUrl}?orgId=${orgId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    const channelsData = responseData.channelsData;
    return channelsData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const fetchChannelsDelete = async (data) => {
  try {
    const response = await fetch(`${channelsDeleteUrl}`, {
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
export const fetchChannelsAdd = async (data) => {
  try {
    const response = await fetch(`${channelsAddUrl}`, {
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
export const fetchChannelsUpdate = async (data) => {
  try {
    const response = await fetch(`${channelsUpdateUrl}`, {
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
export const fetchChannelDetails = async (channelId) => {
  try {
    const response = await fetch(
      `${channelDetailsUrl}?channelId=${channelId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = await response.json();
    const channelsData = responseData.channelsData;
    return channelsData;
  } catch (error) {
    console.log(error);
  }
};
export const fetchlistUrl = async (orgId) => {
  try {
    const response = await fetch(`${listUrl}?orgId=${orgId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    const teams = responseData.teams;
    return teams;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const fetchChannelsCreateUrl = async (data) => {
  try {
    const response = await fetch(`${ChannelsCreateUrl}`, {
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
export const fetchFilesDownloadUrl = async (fileId) => {
  try {
    const response = await fetch(`${FilesDownloadUrl}?fileId=${fileId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


