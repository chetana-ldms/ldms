// import React, { useState, useEffect } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { UsersListLoading } from '../components/loading/UsersListLoading';
// import { ToastContainer, toast } from 'react-toastify';
// import { notify, notifyFail } from '../components/notification/Notification';
// import 'react-toastify/dist/ReactToastify.css';
// import { fetchUserDelete } from '../../../../../api/Api';
// import axios from 'axios';
// import { fetchUsersUrl } from '../../../../../api/ConfigurationApi';
// import { useErrorBoundary } from "react-error-boundary";

// const UserData = () => {
//   const handleError = useErrorBoundary();
//   const userID = Number(sessionStorage.getItem('userId'));
//   const [loading, setLoading] = useState(false);
//   const [users, setUsers] = useState([]);
//   console.log(users, 'users');
//   const handleDelete = async (item) => {
//     const userID = item.userID;
//     const deletedUserId = Number(sessionStorage.getItem('userId'));
//     const deletedDate = new Date().toISOString();
//     const data = {
//       deletedUserId,
//       deletedDate,
//       userID,
//     };
//     try {
//       setLoading(true)
//       await fetchUserDelete(data);
//       notify('User Deleted');
//       await reload();
//       setLoading(false)
//     } catch (error) {
//       handleError(error);
//       setLoading(false)
//     }
//   };

//   const reload = async () => {
//     try {
//       setLoading(true)
//       const orgId = Number(sessionStorage.getItem('orgId'));
//       const data = await fetchUsersUrl(orgId);
//       setUsers(data);
//       setLoading(false)
//     } catch (error) {
//       handleError(error);
//       setLoading(false)
//     }
//   };

//   useEffect(() => {
//     reload();
//   }, []);

//   return (
//     <div className="card">
//       <ToastContainer />
//       <div className="card-header border-0 pt-5">
//         <h3 className="card-title align-items-start flex-column">
//           <span className="card-label fw-bold fs-3 mb-1">Users</span>
//         </h3>
//         <div className="card-toolbar">
//           <div className="d-flex align-items-center gap-2 gap-lg-3">
//             {userID === 1 ? (
//               <Link to="/qradar/users-data/add" className="btn btn-danger btn-small">
//                 Add New User
//               </Link>
//             ) : (
//               <button className='btn btn-danger btn-small' disabled>
//                 Add New User
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="card-body">
//         <table className="table align-middle gs-0 gy-4 dash-table alert-table">
//           <thead>
//             <tr className="fw-bold text-muted bg-blue">
//               <th className="min-w-50px">User ID</th>
//               <th className="min-w-50px">User Name</th>
//               <th className="min-w-50px">User Role</th>
//               <th className="min-w-50px">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading && <UsersListLoading />}
//             {users.map((item, index) => {
//               if (userID === 1 || (userID === 2 && item.userID === 2)) {
//                 return (
//                   <tr key={index} className="fs-12">
//                     <td className="text-danger fw-bold">{item.userID}</td>
//                     <td>{item.name}</td>
//                     <td className="text-warning fw-bold">{item.roleName}</td>
//                     <td>
//                       {userID === 1 ? (
//                         <Link className="text-white" to={`/qradar/users-data/update/${item.userID}`}>
//                           <button className="btn btn-primary btn-small">Update</button>
//                         </Link>
//                       ) : (
//                         <button className='btn btn-primary btn-small' disabled>
//                           Update
//                         </button>
//                       )}
//                         {userID === 1 ? (
//                       <button
//                         className="btn btn-sm btn-danger btn-small ms-5"
//                         style={{ fontSize: '14px' }}
//                         onClick={() => {
//                           handleDelete(item);
//                         }}
//                       >
//                         Delete
//                       </button>
//                        ) : (
//                         <button
//                         className='btn btn-sm btn-danger btn-small ms-5'
//                         style={{ fontSize: '14px' }}
//                         disabled
//                       >
//                         Delete
//                       </button>
//                     )}
//                     </td>
//                   </tr>
//                 );
//               } else {
//                 return null; // Skip rendering for other user IDs
//               }
//             })}
//           </tbody>
//         </table>

//         {(userID !== 1 && userID !== 2) && (
//           <div className="text-center mt-4">
//             <p>No data found.</p>
//           </div>
//         )}
//         {users.length === 0 && (
//           <div className="text-center mt-4">
//             <p>No data found.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export { UserData };
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UsersListLoading } from '../components/loading/UsersListLoading';
import { ToastContainer, toast } from 'react-toastify';
import { notify, notifyFail } from '../components/notification/Notification';
import 'react-toastify/dist/ReactToastify.css';
import { fetchOrganizations, fetchUserDelete } from '../../../../../api/Api';
import axios from 'axios';
import { fetchUsersUrl } from '../../../../../api/ConfigurationApi';
import { useErrorBoundary } from "react-error-boundary";

const UserData = () => {
  const handleError = useErrorBoundary();
  const userID = Number(sessionStorage.getItem('userId'));
  const roleID = Number(sessionStorage.getItem("roleID"));
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const orgId = Number(sessionStorage.getItem('orgId'));
  const orgIdFromSession = Number(sessionStorage.getItem("orgId"));
  const [selectedOrganization, setSelectedOrganization] = useState(orgIdFromSession);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  console.log(users, 'users');
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizationsResponse = await fetchOrganizations();
        setOrganizations(organizationsResponse);
      } catch (error) {
        handleError(error);
      }
    };
    fetchData();
  }, []);
  const handleDelete = async (item) => {
    const userID = item.userID;
    const deletedUserId = Number(sessionStorage.getItem('userId'));
    const deletedDate = new Date().toISOString();
    const data = {
      deletedUserId,
      deletedDate,
      userID,
    };
    try {
      setLoading(true)
      await fetchUserDelete(data);
      notify('User Deleted');
      await reload();
      setLoading(false)
    } catch (error) {
      handleError(error);
      setLoading(false)
    }
  };

  const reload = async () => {
    try {
      setLoading(true)
      // const orgId = Number(sessionStorage.getItem('orgId'));
      const data = await fetchUsersUrl(selectedOrganization);
      setUsers(data);
      setLoading(false)
    } catch (error) {
      handleError(error);
      setLoading(false)
    }
  };

  useEffect(() => {
    reload();
  }, [selectedOrganization]);
  const handleOrganizationChange = (e) => {
    const newOrganizationId = Number(e.target.value);
    setSelectedOrganization(newOrganizationId);
    reload(); 
  };

  return (
    <div className="card">
      <ToastContainer />
    
      <div className="header-filter row">
        <div className="col-lg-2 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <h3 className="align-items-end flex-column">
              <span className="">Users:</span>
            </h3>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="row">
            <label className="form-label fw-normal fs-12 col-lg-2 lh-40 fc-gray fs-14">
              <span>Organization:</span>
            </label>
            <div className="col-lg-5">
              <select
                className="form-select form-select-solid bg-blue-light"
                data-kt-select2="true"
                data-placeholder="Select option"
                data-allow-clear="true"
                value={selectedOrganization}
                onChange={handleOrganizationChange}
              >
                {globalAdminRole=== 1 &&
                  organizations?.length > 0 &&
                  organizations.map((item, index) => (
                    <option key={index} value={item.orgID}>
                      {item.orgName}
                    </option>
                  ))}

                {globalAdminRole !== 1 &&
                  organizations?.length > 0 &&
                  organizations
                    .filter((item) => item.orgID === orgId)
                    .map((item, index) => (
                      <option key={index} value={item.orgID}>
                        {item.orgName}
                      </option>
                    ))}
              </select>
            </div>
          </div>
        </div>
        <div className="col-lg-3 fs-11 lh-40 fc-gray text-center ds-reload">
          {globalAdminRole === 1 || clientAdminRole === 1 ? (
            <Link to="/qradar/users-data/add" className="btn btn-danger btn-small">
              Add New User
            </Link>
          ) : (
            <button className='btn btn-danger btn-small' disabled>
              Add New User
            </button>
          )}
        </div>
      </div>
      <div className="card-body">
        <table className="table align-middle gs-0 gy-4 dash-table alert-table">
          <thead>
            <tr className="fw-bold text-muted bg-blue">
              <th className="min-w-50px">User ID</th>
              <th className="min-w-50px">User Name</th>
              <th className="min-w-50px">User Role</th>
              <th className="min-w-50px">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {users !== null && users !== undefined  ? (
            users.map((item, index) => {
              if (globalAdminRole === 1 || clientAdminRole === 1 || (userID === item.userID)) {
                
              return (
                <tr key={index} className="fs-12">
                  <td className="text-danger fw-bold">{item.userID}</td>
                  <td>{item.name}</td>
                  <td className="text-warning fw-bold">{item.roleName}</td>
                  <td>
                  {globalAdminRole === 1 || clientAdminRole === 1? (
                      <Link className="text-white" to={`/qradar/users-data/update/${item.userID}`}>
                        <button className="btn btn-primary btn-small">Update</button>
                      </Link>
                    ) : (
                      <button className='btn btn-primary btn-small' disabled>
                        Update
                      </button>
                    )}
                   {globalAdminRole === 1 || clientAdminRole === 1 ? (
                      <button
                        className="btn btn-sm btn-danger btn-small ms-5"
                        style={{ fontSize: '14px' }}
                        onClick={() => {
                          handleDelete(item);
                        }}
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        className='btn btn-sm btn-danger btn-small ms-5'
                        style={{ fontSize: '14px' }}
                        disabled
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
                    }

            }) ) : (
              <tr>
                <td colSpan='6' className='text-center'>No data found</td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export { UserData };

