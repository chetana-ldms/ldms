import React, { useState, useEffect } from "react";

const Document = ({ channelId, channelName }) => {
  const [channelSubItems, setChannelSubItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Channel ID:", channelId);
    const apiUrl = `http://115.110.192.133:502/api/LDCChannels/v1/Channels/SubItemsbyChannelId?channelId=${channelId}`;

    fetch(apiUrl)
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
      <div className="clearfix">
        <p className="float-left">
          <strong>{channelName}</strong>
        </p>
        <button className="float-right btn btn-channel btn-primary">
          Upload Document
        </button>
      </div>
      {error ? (
        <p>Error occurred while fetching data</p>
      ) : (
        <ul className="channel-report">
          {channelSubItems.length > 0 ? (
            channelSubItems.map((subItem) => (
              <li className="report-files mb-2" key={subItem.channelSubItemId}>
                <a
                  className="doc-section"
                  href={subItem.documentUrl}
                  download="Document"
                >
                  <i className="far fa-file-pdf" />{" "}
                  <span className="text-blue">
                    {subItem.channelSubItemName} Report{" "}
                  </span>
                  {/* <i className="fas fa-download"></i> */}
                </a>
                <button className="btn btn-new">
                  <a href={subItem.documentUrl} download="Document">
                    <i className="fas fa-download"></i>
                  </a>
                </button>
              </li>
            ))
          ) : (
            <li>Loading...</li>
          )}
        </ul>
      )}
      {/* Add more specific content for the Reports template */}
    </div>
  );
};

export default Document;
