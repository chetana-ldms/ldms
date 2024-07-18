import { useState, useEffect } from 'react';
import { fetchFeaturesActionsAuthorizedUrl } from '../../../../../api/Api';

const useFeatureActions = (orgId, toolId, roleId, featureId) => {
  const [featureActions, setFeatureActions] = useState([]);

  const fetchFeatureActions = async () => {
    try {
      const data = { orgId, toolId, roleId, featureId };
      const response = await fetchFeaturesActionsAuthorizedUrl(data);
      setFeatureActions(response.featureActions);
    } catch (error) {
      console.log(error);
    } 
  };

  useEffect(() => {
    fetchFeatureActions();
  }, [orgId, toolId, roleId, featureId]);

  return {featureActions };
};

export default useFeatureActions;
