import { React, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import EventTrackingPopUp from "./EventTrackingPopUp";

function EventTracking() {
  const [showModal, setShowModal] = useState(false);

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
                <tr onClick={() => handleRowClick()}>
                  <td>
                    <span className="initial">AR</span> Arunachalam R
                  </td>
                  <td>Feb 14, 2024 @9:30:31 AM</td>
                  <td>Evidence</td>
                  <td>-</td>
                  <td>-</td>
                  <td>Evidence Created</td>
                  <td>
                    Arunachalam created new evidence
                    <i className="fa fa-chevron-right float-right" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="initial">CS</span> Chetana S
                  </td>
                  <td>Nov 20, 2024 @7:20:05 AM</td>
                  <td>Company</td>
                  <td>-</td>
                  <td>-</td>
                  <td>Company Roles Updated</td>
                  <td>
                    Chetana granted/revoked role access to users within the
                    company. <i className="fa fa-chevron-right float-right" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="initial">AR</span> Arunachalam R
                  </td>
                  <td>Feb 14, 2024 @9:30:31 AM</td>
                  <td>Evidence</td>
                  <td>-</td>
                  <td>-</td>
                  <td>Evidence Created</td>
                  <td>
                    Arunachalam created new evidence
                    <i className="fa fa-chevron-right float-right" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="initial">CS</span> Chetana S
                  </td>
                  <td>Nov 20, 2024 @7:20:05 AM</td>
                  <td>Company</td>
                  <td>-</td>
                  <td>-</td>
                  <td>Company Roles Updated</td>
                  <td>
                    Chetana granted/revoked role access to users within the
                    company. <i className="fa fa-chevron-right float-right" />
                  </td>
                </tr>
              </tbody>
            </table>
            <EventTrackingPopUp showModal={showModal} setShowModal={setShowModal} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventTracking;
