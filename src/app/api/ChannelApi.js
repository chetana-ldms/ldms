const SubItemsByOrgChannel = `http://115.110.192.133:502/api/LDCChannels/v1/Channels/SubItemsByOrgChannel`
const Questions = "http://115.110.192.133:502/api/LDCChannels/v1/Channel/Questions"
const QuestionsAdd = "http://115.110.192.133:502/api/LDCChannels/v1/Channels/Questions/Add"
const QuestionsAnswerAdd ="http://115.110.192.133:502/api/LDCChannels/v1/Channels/Questions/Answer/Add"

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