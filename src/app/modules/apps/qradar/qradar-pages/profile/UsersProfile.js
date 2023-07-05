import React, { useState, useEffect } from "react";
import axios from "axios";

function UsersProfile() {
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const response = await axios.post(
          "http://115.110.192.133:502/api/LDPSecurity/v1/Users?OrgId=1",
          null,
          { headers: { accept: "application/json" } }
        );

        const { usersList } = response.data;
        setUserProfiles(usersList);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };

    fetchUserProfiles();
  }, []);

  return (
    <>
      <h1>Users Profile</h1>
      <div className="alert-table">
        <table className="table users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Role</th>
              <th align="right"></th>
            </tr>
          </thead>
          <tbody>
            {userProfiles.map((profile) => (
              <tr key={profile.userID}>
                <td>{profile.userID}</td>
                <td>{profile.name}</td>
                <td>{profile.roleName}</td>
                <td align="right">
                  <span className="btn btn-small btn-new btn-primary">
                    Change pwd <i className="fa fa-pencil" />
                  </span>{" "}
                  <span className="btn btn-small btn-new btn-primary">
                    Reset pwd <i className="fa fa-pencil" />
                  </span>{" "}
                  <span className="btn btn-small btn-danger">
                    Delete <i className="fa fa-trash" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UsersProfile;
