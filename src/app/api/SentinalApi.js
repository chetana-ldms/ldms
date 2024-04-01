
const ExclusionListUrl ="http://115.110.192.133:502/api/SentinalOne/v1/Exclusion/List"
const BlokckedListUrl ="http://115.110.192.133:502/api/SentinalOne/v1/BlokckedList"
const AccountDetailsUrl ="http://115.110.192.133:502/api/SentinalOne/v1/Account/Details"
const PolicyDetailsUrl = "http://115.110.192.133:502/api/SentinalOne/v1/Policy/Details"

export const fetchExclusionListUrl = async (data) => {
    try {
      const response = await fetch(`${ExclusionListUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const exclusionList = responseData.exclusionList;
      return exclusionList;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchBlokckedListUrl = async (data) => {
    try {
      const response = await fetch(`${BlokckedListUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const blockedItemList = responseData.blockedItemList;
      return blockedItemList;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchAccountDetailsUrl = async (data) => {
    try {
      const response = await fetch(`${AccountDetailsUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const accounts = responseData.accounts;
      return accounts;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchPolicyDetailsUrl = async (data) => {
    try {
      const response = await fetch(`${PolicyDetailsUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const result = responseData.data;
      return result;
    } catch (error) {
      console.log(error);
    }
  };