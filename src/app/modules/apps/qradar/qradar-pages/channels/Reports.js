import React, { useState, useEffect } from "react";
import { fetchSubItemsByOrgChannel } from "../../../../../api/ChannelApi";

const Reports = ({ channelId, channelName }) => {
  const [channelSubItems, setChannelSubItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const orgId = Number(sessionStorage.getItem("orgId"));
    const data = { channelId, orgId };

    fetchSubItemsByOrgChannel(data)
      .then((subItems) => {
        setChannelSubItems(subItems);
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
        {/* <button className="btn btn-new float-right btn-primary">
          Add Channel to Teams
        </button> */}
      </div>

      {error ? (
        <p>Error occurred while fetching data</p>
      ) : (
        <div className="channel-report">
          {/* Generate Report */}
          <div className="generate-report">
            {channelSubItems.length > 0 ? (
              channelSubItems.map((subItem) => (
                <div
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
                  <button className="btn btn-new btn-primary">
                    Generate Report
                  </button>
                </div>
              ))
            ) : (
              <div>Loading...</div>
            )}
          </div>

          {/* Download Report */}
          <div className="download-report mt-10">
            <p>
              <strong>Download Report:</strong>{" "}
            </p>
            {channelSubItems.length > 0 ? (
              channelSubItems.map((subItem) => (
                <div
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
                    {/* <i className="fas fa-download"></i> */}
                  </a>
                  <button className="btn btn-new">
                    <a href={subItem.documentUrl} download="Document">
                      <i className="fas fa-download"></i>
                    </a>
                  </button>
                </div>
              ))
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      )}
      {/* Add more specific content for the Reports template */}
    </div>
  );
};

export default Reports;
