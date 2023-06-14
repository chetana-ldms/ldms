import React, { useState, useEffect } from "react";

const QA = ({ channelId, channelName }) => {
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
        <button className="btn btn-channel float-right btn-primary">
          Post a Question
        </button>
      </div>

      <div className="qa mt-5">
        <div className="row">
          <div className="col">
            <p className="question">
              <b>Q:</b> How to create a new channel?
            </p>
            <p className="answer">
              <b>A:</b> Click on 'Add new' button and the request to generate
              new channel will be processed
            </p>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col">
            <p className="question">
              <b>Q:</b> How to create a new channel?
            </p>
            <p className="answer">
              <b>A:</b> Click on 'Add new' button and the request to generate
              new channel will be processed
            </p>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col">
            <p className="question">
              <b>Q:</b> How to create a new channel?
            </p>
            <p className="answer">
              <button className="btn btn-channel btn-primary">
                Add your answer
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QA;
