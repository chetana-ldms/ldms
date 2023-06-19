import React from "react";

export const ProfileData = ({ graphData }) => {
  if (!graphData) {
    return null; // Return null or display a loading indicator if graphData is null
  }

  const { givenName, surname, jobTitle, officeLocation } = graphData;

  return (
    <div>
      <h2>Profile Information</h2>
      <p>
        <b>First Name:</b> {givenName}
      </p>
      <p>
        <b>Last Name:</b> {surname}
      </p>
      <p>
        <b>Job Title:</b> {jobTitle}
      </p>
      <p>
        <b>Office Location:</b> {officeLocation}
      </p>
    </div>
  );
};
