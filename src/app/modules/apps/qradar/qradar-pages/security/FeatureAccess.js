import { useEffect, useRef, useState } from 'react';
import { notifyFail, notify } from '../components/notification/Notification';
import {
  fetchOrganizationRolesUrl,
} from '../../../../../api/securityApi';
import FeaturesActionsAuthorized from './FeaturesActionsAuthorized';

function FeatureAccess({ featureAccess, orgId, toolId }) {
  const [filterValue, setFilterValue] = useState('');
  const [clickedItem, setClickedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const roleRef = useRef();
  console.log(featureAccess, "featureAccess")

  useEffect(() => {
    const reload = async () => {
      try {
        setLoading(true);
        const response = await fetchOrganizationRolesUrl(orgId);
        setRoles(response);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      reload();
    }, 300);
    return () => clearTimeout(timer);
  }, [orgId]);

  useEffect(() => {
    setClickedItem(null);
  }, [featureAccess]);

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleItemClick = (item) => {
    if (!roleRef.current.value) {
      notifyFail('Select roles');
      return;
    }
    setClickedItem(item);
  };

  const handleRoleChange = () => {
    setClickedItem(null);
  };

  const filteredList = filterValue
    ? featureAccess.filter((item) =>
        item.featureName.toLowerCase().includes(filterValue.toLowerCase())
      )
    : featureAccess;

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6'>
          <div className='card border border-2'>
            <div className='card-body p-3'>
              <div className='col-lg-12 d-flex align-items-center mb-5'>
                <label htmlFor='mobileNo' className='form-label fs-6 fw-bolder col-lg-3'>
                  Roles <sup className='red'>*</sup>:
                </label>
                <select
                  className='form-select form-select-solid bg-blue-white col-lg-9'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  ref={roleRef}
                  onChange={handleRoleChange} 
                >
                  <option value=''>Select</option>
                  {roles !== null &&
                    roles?.map((item, index) => (
                      <option key={index} value={item.roleID}>
                        {item.roleName}
                      </option>
                    ))}
                </select>
              </div>
              <div className='col-lg-12 mb-3'>
                <input
                  type='text'
                  placeholder='Search...'
                  className='form-control'
                  value={filterValue}
                  onChange={handleFilterChange}
                />
              </div>

              <div className='card' style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <ul className='list-group list-group-flush'>
                  {filteredList.map((item, index) => (
                    <li
                      key={index}
                      className={`list-group-item cursor-pointer ${
                        clickedItem === item ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      {item.featureDisplayName}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <div className='card border border-2'>
            <div className='card-body'>
              {clickedItem ? (
                <FeaturesActionsAuthorized
                  roleId={roleRef.current.value}
                  orgId={orgId}
                  toolId={toolId}
                  featureId={clickedItem.featureId}
                />
              ) : (
                <h5 className='card-title'>Authorized Actions</h5>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureAccess;
