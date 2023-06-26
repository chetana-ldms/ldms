const Delete="http://182.71.241.246:502/api/File/v1/Files/Delete"
const Upload="http://182.71.241.246:502/api/File/v1/Files/Upload"
const GetUploadedFilesListByChannelId="http://182.71.241.246:502/api/File/v1/Files/GetUploadedFilesListByChannelId"
const SubItemsByOrgChannel = `http://182.71.241.246:502/api/LDCChannels/v1/Channels/SubItemsByOrgChannel`
const Questions = "http://182.71.241.246:502/api/LDCChannels/v1/Channel/Questions"
const QuestionsAdd = "http://182.71.241.246:502/api/LDCChannels/v1/Channels/Questions/Add"
const QuestionsAnswerAdd ="http://182.71.241.246:502/api/LDCChannels/v1/Channels/Questions/Answer/Add"
const QuestionsUpdate="http://182.71.241.246:502/api/LDCChannels/v1/Channels/Questions/Update"
const QuestionsDelete="http://182.71.241.246:502/api/LDCChannels/v1/Channel/Questions/Delete"
const QuestionsAnswereUpdate="http://182.71.241.246:502/api/LDCChannels/v1/Channels/Questions/Answere/Update"
const QuestionsAnswerDelete="http://182.71.241.246:502/api/LDCChannels/v1/Channel/Questions/Answer/Delete"
const QuestionDetails="http://182.71.241.246:502/api/LDCChannels/v1/Channels/QuestionDetails"
const AnswerDetails="http://182.71.241.246:502/api/LDCChannels/v1/Channels/AnswerDetails"
const Channels="http://182.71.241.246:502/api/LDCChannels/v1/Channels"
const ChannelsDelete="http://182.71.241.246:502/api/LDCChannels/v1/Channels/Delete"
const ChannelsAdd="http://182.71.241.246:502/api/LDCChannels/v1/Channels/Add"
const ChannelsUpdate= "http://182.71.241.246:502/api/LDCChannels/v1/Channels/Update"
const ChannelDetails="http://182.71.241.246:502/api/LDCChannels/v1/ChannelDetails"

export const fetchDelete = async (formData) => {
  try {
    const response = await fetch(`${Delete}`, {
      method: 'POST',
      body: formData,
    });
  
    const responseData = await response.json();
    return responseData
  } catch (error) {
    console.log(error)
  }
}
export const fetchUpload = async (formData) => {
  try {
      const response = await fetch(`${Upload}`, {
          method: 'POST',
          body: formData,
      });

      const responseData = await response.json();
      return responseData
  } catch (error) {
      console.log(error)
  }
}
export const fetchGetUploadedFilesListByChannelId = async (channelId) => {
  try {
    const response = await fetch(`${GetUploadedFilesListByChannelId}?channelId=${channelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json();
    const uploadedFileList = responseData.uploadedFileList;
    return uploadedFileList;
  } catch (error) {
    console.log(error);
  }
};
export const fetchSubItemsByOrgChannel = async (data) => {
    try {
        const response = await fetch(`${SubItemsByOrgChannel}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            }),
        });

        const responseData = await response.json();
        const channelSubItems = responseData.channelSubItems
        console.log(channelSubItems, "channelSubItems")
        return channelSubItems
    } catch (error) {
        console.log(error)
    }
}
export const fetchQuestions = async (data) => {
    try {
        const response = await fetch(`${Questions}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            }),
        });

        const responseData = await response.json();
        const channelQAList = responseData.channelQAList
        return channelQAList
    } catch (error) {
        console.log(error)
    }
}
export const fetchQuestionsAdd = async (data) => {
    try {
        const response = await fetch(`${QuestionsAdd}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            }),
        });

        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.log(error)
    }
}
export const fetchQuestionsAnswerAdd = async (data) => {
    try {
        const response = await fetch(`${QuestionsAnswerAdd}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            }),
        });

        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.log(error)
    }
}
export const fetchQuestionsUpdate = async (data) => {
    try {
        const response = await fetch(`${QuestionsUpdate}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            }),
        });

        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.log(error)
    }
}
export const fetchQuestionsDelete = async (data) => {
    try {
        const response = await fetch(`${QuestionsDelete}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            }),
        });

        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.log(error)
    }
}
export const fetchQuestionsAnswereUpdate = async (data) => {
    try {
        const response = await fetch(`${QuestionsAnswereUpdate}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            }),
        });

        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.log(error)
    }
}
export const fetchQuestionsAnswerDelete = async (data) => {
    try {
        const response = await fetch(`${QuestionsAnswerDelete}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data
            }),
        });

        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.log(error)
    }
}
export const fetcQuestionDetails = async (questionId) => {
    try {
      const response = await fetch(`${QuestionDetails}?QuestionId=${questionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();
      const channelQAData = responseData.channelQAData;
      return channelQAData;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchAnswerDetails = async (answerId) => {
    try {
      const response = await fetch(`${AnswerDetails}?AnswerId=${answerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${Channels}?orgId=${orgId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${ChannelsDelete}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data
        }),
      });
    
      const responseData = await response.json();
      return responseData
    } catch (error) {
      console.log(error)
    }
  }
  export const fetchChannelsAdd = async (data) => {
    try {
      const response = await fetch(`${ChannelsAdd}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data
        }),
      });
    
      const responseData = await response.json();
      return responseData
    } catch (error) {
      console.log(error)
    }
  }
  export const fetchChannelsUpdate = async (data) => {
    try {
      const response = await fetch(`${ChannelsUpdate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data
        }),
      });
    
      const responseData = await response.json();
      return responseData
    } catch (error) {
      console.log(error)
    }
  }
  export const fetchChannelDetails = async (channelId) => {
    try {
      const response = await fetch(`${ChannelDetails}?channelId=${channelId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();
      const channelsData = responseData.channelsData;
      return channelsData;
    } catch (error) {
      console.log(error);
    }
  };
  
  