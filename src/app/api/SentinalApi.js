import FetchWithToken from "../modules/auth/FetchWithToken"

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
const GroupsCreateUrl=process.env.REACT_APP_GROUPS_CREATE_URL
const UpgradePoliciesUrl= process.env.REACT_APP_SENTINEL_UPGRADE_POLICIES_URL
const AvailablePackagesUrl= process.env.REACT_APP_SENTINEL_UPGRADE_POLICY_AVAILABLE_PACKAGES_URL
const UpgradePolicyUrl= process.env.REACT_APP_SENTINEL_UPGRADE_POLICY_URL
const ParentUpgradePoliciesUrl=process.env.REACT_APP_SENTINEL_PARENT_UPGRADE_POLICIES_URL
const UpgradePolicyActionsUrl=process.env.REACT_APP_SENTINEL_UPGRADE_POLICY_ACTIONS_URL
const UpgradePoliciesSetInheritingUrl =process.env.REACT_APP_SENTINEL_UPGRADE_POLICIES_SETINHERITING_URL
const UpgradePoliciesDeActivateUrl =process.env.REACT_APP_SENTINEL_UPGRADE_POLICIES_DEACTIVATE_URL
const TagsUrl =process.env.REACT_APP_SENTINEL_TAGS_URL
const TagAddUrl =process.env.REACT_APP_SENTINEL_TAG_ADD_URL
const TagUpdateUrl =process.env.REACT_APP_SENTINEL_TAG_UPDATE_URL
const TagsDeleteUrl =process.env.REACT_APP_SENTINEL_TAGS_DELETE_URL
const TagsActionsUrl =process.env.REACT_APP_SENTINEL_ENDPOINT_TAGS_ACTIONS_URL
const UpgradeMaintenanceDetailsUrl="http://10.41.3.232:501/api/Alerts/v1/Sentinel/UpgradeMaintenanceDetails"
const UpgradeMaintenanceDetailsUpdateUrl ="http://10.41.3.232:501/api/Alerts/v1/Sentinel/UpgradeMaintenanceDetails/Update"

export const fetchExclusionListUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${ExclusionListUrl}`, {
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
      const response = await FetchWithToken(`${BlokckedListUrl}`, {
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
      const response = await FetchWithToken(`${AccountDetailsUrl}`, {
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
      const response = await FetchWithToken(`${PolicyDetailsUrl}`, {
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
      const response = await FetchWithToken(`${blockedListItemDeleteUrl}`, {
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
      const response = await FetchWithToken(`${AddToblockListUrl}`, {
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
      const response = await FetchWithToken(`${blockedListItemUpdateUrl}`, {
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
      const response = await FetchWithToken(`${AddToExclusionListUrl}`, {
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
      const response = await FetchWithToken(`${ExcludedListItemDeleteUrl}`, {
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
      const response = await FetchWithToken(`${ExcludedListItemUpdateUrl}`, {
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
      const response = await FetchWithToken(`${GroupActionUrl}`, {
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
      const response = await FetchWithToken(`${GroupsUrl}`, {
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
      const response = await FetchWithToken(`${SoftwarePackagesUpdateUrl}`, {
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
      const response = await FetchWithToken(`${BlockedListImportUrl}`, {
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
      const response = await FetchWithToken(`${BlockedListImportReportUrl}`, {
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
      const response = await FetchWithToken(`${ExclusionItemsImportUrl}`, {
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
      const response = await FetchWithToken(`${ExclusionItemsImportReportUrl}`, {
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
  export const fetchGroupsCreateUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${GroupsCreateUrl}`, {
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
  export const fetchUpgradePoliciesUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${UpgradePoliciesUrl}`, {
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
  export const fetchAvailablePackagesUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${AvailablePackagesUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
  
      const responseData = await response.json();
      const result = responseData.data.packages
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  export const fetchUpgradePolicyUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${UpgradePolicyUrl}`, {
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
  export const fetchParentUpgradePoliciesUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${ParentUpgradePoliciesUrl}`, {
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
  export const fetchUpgradePolicyActionsUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${UpgradePolicyActionsUrl}`, {
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
  export const fetchUpgradePoliciesSetInheritingUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${UpgradePoliciesSetInheritingUrl}`, {
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
  export const fetchUpgradePoliciesDeActivateUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${UpgradePoliciesDeActivateUrl}`, {
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
  export const fetchTagsUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${TagsUrl}`, {
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
  export const fetchTagAddUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${TagAddUrl}`, {
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
  export const fetchTagUpdateUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${TagUpdateUrl}`, {
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
  export const fetchTagsDeleteUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${TagsDeleteUrl}`, {
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
  export const fetchTagsActionsUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${TagsActionsUrl}`, {
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
  export const fetchUpgradeMaintenanceDetailsUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${UpgradeMaintenanceDetailsUrl}`, {
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
  export const fetchUpgradeMaintenanceDetailsUpdateUrl = async (data) => {
    try {
      const response = await FetchWithToken(`${UpgradeMaintenanceDetailsUpdateUrl}`, {
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