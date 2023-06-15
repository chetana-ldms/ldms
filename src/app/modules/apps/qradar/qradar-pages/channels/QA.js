import React, { useState, useEffect } from "react";

const QA = ({ channelId, channelName }) => {
  const [channelQAList, setChannelQAList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Channel ID:", channelId);
    const orgId = Number(sessionStorage.getItem("orgId"));
    const apiUrl = `http://115.110.192.133:502/api/LDCChannels/v1/Channel/Questions`;

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
        if (Array.isArray(data.channelQAList)) {
          setChannelQAList(data.channelQAList);
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
        {channelQAList.map((item) => (
          <div className="row" key={item.id}>
            <div className="col">
              <p className="question">
                <b>Q:</b> {item.questionDescription}
              </p>
              {item.answerDescription && (
                <p className="answer">
                  <b>A:</b> {item.answerDescription}
                </p>
              )}
              {!item.answerDescription && (
                <p className="answer">
                  <button className="btn btn-channel btn-primary">
                    Add your answer
                  </button>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QA;
