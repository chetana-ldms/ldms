import React, { useEffect, useState } from 'react';
import {
  fetchFeaturesActionsAuthorizedAccessUrl,
  fetchFeaturesActionsAuthorizationConfigurationUrl,
} from '../../../../../api/securityApi';
import { notify, notifyFail } from '../components/notification/Notification';

function FeaturesActionsAuthorized({ orgId, toolId, roleId, featureId }) {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);

  console.log(actions, 'actions');

  const fetchActions = async () => {
    try {
      setLoading(true);
      const data = {
        orgId,
        toolId: Number(toolId || 0),
        roleId,
        featureId,
      };
      const response = await fetchFeaturesActionsAuthorizedAccessUrl(data);
      setActions(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching actions', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orgId && roleId && featureId) {
      fetchActions();
    }
  }, [orgId, roleId, featureId]);

  useEffect(() => {
    // Reset actions and selectAll when featureId changes
    setActions([]);
    setSelectAll(false);
  }, [featureId]);

  const handleCheckboxChange = (index) => {
    const updatedActions = [...actions];
    updatedActions[index].is_authorized = !updatedActions[index].is_authorized;
    setActions(updatedActions);

    if (updatedActions.every((action) => action.is_authorized)) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  const handleSelectAllChange = () => {
    const updatedSelectAll = !selectAll;
    setSelectAll(updatedSelectAll);

    const updatedActions = actions.map((action) => ({
      ...action,
      is_authorized: updatedSelectAll,
    }));
    setActions(updatedActions);
  };

  const handleSaveChanges = async () => {
    const payload = {
      orgId,
      toolId: Number(toolId || 0),
      roleId,
      featureId,
      accessPermissions: actions.map((action) => ({
        actionId: action.actionId,
        is_authorized: action.is_authorized,
      })),
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
    };

    try {
      const responseData = await fetchFeaturesActionsAuthorizationConfigurationUrl(payload);
      const { isSuccess, message } = responseData;
      if (isSuccess) {
        notify(message);
        fetchActions();
      } else {
        notifyFail(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='' style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <h5 className='card-title mb-5 pb-5'>Authorized Actions</h5>
      {actions && actions.length > 0 ? (
        <>
          <div className='form-check ms-5'>
            <input
              className='form-check-input'
              type='checkbox'
              id='select-all-checkbox'
              checked={selectAll}
              onChange={handleSelectAllChange}
            />
            <label className='form-check-label' htmlFor='select-all-checkbox'>
              Select All
            </label>
          </div>
          <hr />
          <ul className='list-group list-group-flush ps-2 ms-5'>
            {actions.map((action, index) => (
              <li key={index} className='list-group-item'>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id={`action-checkbox-${index}`}
                    checked={action.is_authorized}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  <label className='form-check-label' htmlFor={`action-checkbox-${index}`}>
                    {action.actionDisplayName}
                  </label>
                </div>
              </li>
            ))}
          </ul>
          <button className='btn btn-primary mt-3 float-right' onClick={handleSaveChanges}>
            Save Changes
          </button>
        </>
      ) : (
        <div>No Data Found</div>
      )}
    </div>
  );
}

export default FeaturesActionsAuthorized;
