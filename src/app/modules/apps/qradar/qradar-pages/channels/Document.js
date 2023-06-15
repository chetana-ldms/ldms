import React, { useState, useEffect } from "react";
import { fetchSubItemsByOrgChannel } from "../../../../../api/ChannelApi";

const Document = ({ channelId, channelName }) => {
  const [channelSubItems, setChannelSubItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const orgId = Number(sessionStorage.getItem("orgId"));
    const data = { channelId, orgId };

    fetchSubItemsByOrgChannel(data)
      .then((channelSubItems) => {
        setChannelSubItems(channelSubItems);
      })
      .catch((error) => {
        console.log(error);
        setError("Error occurred while fetching channel sub-item data");
      });
  }, [channelId]);

  return (
    <div>
      <div className="clearfix">
        <p className="float-left channel-heading">
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
          {channelSubItems !== null ? (
            channelSubItems.length > 0 ? (
              channelSubItems.map((subItem) => (
                <li
                  className="report-files mb-2"
                  key={subItem.channelSubItemId}
                >
                  <a
                    className="doc-section"
                    href={subItem.documentUrl}
                    download="Document"
                  >
                    <i className="far fa-file-pdf" />{" "}
                    <span className="text-blue">
                      {subItem.channelSubItemName} Report{" "}
                    </span>
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
            )
          ) : null}
        </ul>
      )}
      {/* Add more specific content for the Reports template */}
    </div>
  );
};

export default Document;
