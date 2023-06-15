import React, { useState, useEffect } from "react";

const InProgress = ({ channelId, channelName }) => {
  const [channelSubItems, setChannelSubItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Channel ID:", channelId);
    const orgId = Number(sessionStorage.getItem("orgId"));
    const apiUrl = `http://115.110.192.133:502/api/LDCChannels/v1/Channels/SubItemsByOrgChannel`;

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channelId, orgId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("API response:", data);
        if (Array.isArray(data.channelSubItems)) {
          setChannelSubItems(data.channelSubItems);
        } else {
          console.log("Invalid response format:", data);
          setError("Invalid response format");
        }
      })
      .catch((error) => {
        console.log("Error occurred:", error);
        setError("Error occurred while fetching channel sub-item data");
      });
  }, [channelId]);

  return (
    <div>
      <p>
        <strong>{channelName}</strong>
      </p>

      {/* Add more specific content for the Reports template */}
    </div>
  );
};

export default InProgress;
