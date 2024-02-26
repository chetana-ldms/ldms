import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import EventTrackingPopUp from "./EventTrackingPopUp";

function EventTracking() {
  const [showModal, setShowModal] = useState(false);

  const eventData = [
    {
      id: 1,
      user: "Arunachalam R",
      timestamp: "Feb 14, 2024 @9:30:31 AM",
      category: "Evidence",
      connection: "-",
      result: "-",
      type: "Evidence Created",
      description: "Arunachalam created new evidence",
    },
    {
      id: 2,
      user: "Chetana S",
      timestamp: "Nov 20, 2024 @7:20:05 AM",
      category: "Company",
      connection: "-",
      result: "-",
      type: "Company Roles Updated",
      description:
        "Chetana granted/revoked role access to users within the company.",
    },
    {
      id: 3,
      user: "Arunachalam R",
      timestamp: "Feb 14, 2024 @9:30:31 AM",
      category: "Evidence",
      connection: "-",
      result: "-",
      type: "Evidence Created",
      description: "Arunachalam created new evidence",
    },
    {
      id: 4,
      user: "Chetana S",
      timestamp: "Nov 20, 2024 @7:20:05 AM",
      category: "Company",
      connection: "-",
      result: "-",
      type: "Company Roles Updated",
      description:
        "Chetana granted/revoked role access to users within the company.",
    },
  ];

  const handleRowClick = (item) => {
    setShowModal(true);
  };

  return (
    <div className="compliance">
      <h2>Events</h2>
      <div className="row">
        <div className="col-lg-12">
          <div className="compliance-controls">
            <form>
              <select>
                <option>All Categories</option>
              </select>
              {"   "}
              <select>
                <option>All Types</option>
              </select>
              {"  "}
              <select>
                <option>All Users</option>
              </select>
            </form>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-lg-12">
          <div className="table">
            <table className="table">
              <thead>
                <tr className="bold">
                  <th>User</th>
                  <th>Timestamp</th>
                  <th>Category</th>
                  <th>Connection</th>
                  <th>Result</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {eventData.map((event) => (
                  <tr key={event.id} onClick={() => handleRowClick(event)}>
                    <td>
                      <span className="initial">
                        {event.user
                          .split(" ")
                          .map((name) => name.charAt(0))
                          .join("")}
                      </span>{" "}
                      {event.user}
                    </td>
                    <td>{event.timestamp}</td>
                    <td>{event.category}</td>
                    <td>{event.connection}</td>
                    <td>{event.result}</td>
                    <td>{event.type}</td>
                    <td>
                      {event.description}
                      <i className="fa fa-chevron-right float-right" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <EventTrackingPopUp
              showModal={showModal}
              setShowModal={setShowModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventTracking;
