const SubItemsByOrgChannel = `http://115.110.192.133:502/api/LDCChannels/v1/Channels/SubItemsByOrgChannel`
const Questions = "http://115.110.192.133:502/api/LDCChannels/v1/Channel/Questions"
const QuestionsAdd = "http://115.110.192.133:502/api/LDCChannels/v1/Channels/Questions/Add"
const QuestionsAnswerAdd ="http://115.110.192.133:502/api/LDCChannels/v1/Channels/Questions/Answer/Add"
const QuestionsUpdate="http://115.110.192.133:502/api/LDCChannels/v1/Channels/Questions/Update"
const QuestionsDelete="http://115.110.192.133:502/api/LDCChannels/v1/Channel/Questions/Delete"
const QuestionsAnswereUpdate="http://115.110.192.133:502/api/LDCChannels/v1/Channels/Questions/Answere/Update"
const QuestionsAnswerDelete="http://115.110.192.133:502/api/LDCChannels/v1/Channel/Questions/Answer/Delete"
const QuestionDetails="http://115.110.192.133:502/api/LDCChannels/v1/Channels/QuestionDetails"
const AnswerDetails="http://115.110.192.133:502/api/LDCChannels/v1/Channels/AnswerDetails"
const Channels="http://115.110.192.133:502/api/LDCChannels/v1/Channels"

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
  
  