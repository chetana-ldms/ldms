
const ExclusionListUrl =process.env.REACT_APP_EXCLUSION_LIST_URL
const BlokckedListUrl =process.env.REACT_APP_BLOCKEDLIST_URL
const AccountDetailsUrl =process.env.REACT_APP_ACCOUNT_DETAILS_URL
const PolicyDetailsUrl = process.env.REACT_APP_POLICY_DETAILS_URL
const blockedListItemDeleteUrl= process.env.REACT_APP_BLOCKEDLISTITEM_DELETE_URL
const AddToblockListUrl= process.env.REACT_APP_ADDTOBLOCKLIST_URL
const blockedListItemUpdateUrl = process.env.REACT_APP_BLOCKEDLISTITEM_UPDATE_URL
const AddToExclusionListUrl= process.env.REACT_APP_ADDTOEXCLUSIONLIST_URL
const ExcludedListItemDeleteUrl=process.env.REACT_APP_EXCLUSDEDLISTITEM_DELETE_URL
const ExcludedListItemUpdateUrl=process.env.REACT_APP_EXCLUSDEDLISTITEM_UPDATE_URL
const GroupActionUrl= process.env.REACT_APP_AGENT_GROUPACTION_URL
const GroupsUrl= process.env.REACT_APP_GROUPS_URL
const SoftwarePackagesUpdateUrl =process.env.REACT_APP_SOFTWAREPACKAGES_UPDATE_URL
const BlockedListImportUrl =process.env.REACT_APP_BLOCKEDLIST_IMPORT_URL
const BlockedListImportReportUrl = process.env.REACT_APP_BLOCKEDLIST_IMPORTREPORT_URL
const ExclusionItemsImportUrl =process.env.REACT_APP_EXCLUSIONITEMS_IMPORT_URL
const ExclusionItemsImportReportUrl=process.env.REACT_APP_EXCLUSIONITEMS_IMPORTREPORT_URL

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
      // const exclusionList = responseData.exclusionList;
      return responseData;
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
      // const blockedItemList = responseData.blockedItemList;
      return responseData;
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
  export const fetchblockedListItemDeleteUrl = async (data) => {
    try {
      const response = await fetch(`${blockedListItemDeleteUrl}`, {
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
  export const fetchAddToblockListUrl = async (data) => {
    try {
      const response = await fetch(`${AddToblockListUrl}`, {
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
  export const fetchblockedListItemUpdateUrl = async (data) => {
    try {
      const response = await fetch(`${blockedListItemUpdateUrl}`, {
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
  export const fetchAddToExclusionListUrl = async (data) => {
    try {
      const response = await fetch(`${AddToExclusionListUrl}`, {
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
  export const fetchExcludedListItemDeleteUrl = async (data) => {
    try {
      const response = await fetch(`${ExcludedListItemDeleteUrl}`, {
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
  export const fetchExcludedListItemUpdateUrl = async (data) => {
    try {
      const response = await fetch(`${ExcludedListItemUpdateUrl}`, {
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
  export const fetchGroupActionUrl = async (data) => {
    try {
      const response = await fetch(`${GroupActionUrl}`, {
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
  export const fetchGroupsUrl = async (data) => {
    try {
      const response = await fetch(`${GroupsUrl}`, {
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
  export const fetchSoftwarePackagesUpdateUrl = async (data) => {
    try {
      const response = await fetch(`${SoftwarePackagesUpdateUrl}`, {
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
  export const fetchBlockedListImportUrl = async (formData) => {
    try {
      const response = await fetch(`${BlockedListImportUrl}`, {
        method: 'POST',
        body: formData,
      })
  
      const responseData = await response.json()
      return responseData
    } catch (error) {
      console.log(error)
    }
  }
  export const fetchBlockedListImportReportUrl = async (data) => {
    try {
      const response = await fetch(`${BlockedListImportReportUrl}`, {
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
  export const fetchExclusionItemsImportUrl = async (formData) => {
    try {
      const response = await fetch(`${ExclusionItemsImportUrl}`, {
        method: 'POST',
        body: formData,
      })
  
      const responseData = await response.json()
      return responseData
    } catch (error) {
      console.log(error)
    }
  }
  export const fetchExclusionItemsImportReportUrl = async (data) => {
    try {
      const response = await fetch(`${ExclusionItemsImportReportUrl}`, {
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