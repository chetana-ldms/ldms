import { React, useState } from "react";
import { Modal, Button } from "react-bootstrap";

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
            <Modal
              className="modal"
              show={showModal}
              onHide={() => setShowModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  <h2>Audit Event</h2>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h4>Event Details</h4>
                <div>
                  <span className="initial">AR</span> Arunachalam
                  <span>arunachalam@lancesoft.com</span>
                </div>
                <br />
                <div>
                  <p className="bold no-margin">Timestamp:</p>
                  <p>Feb 14, 2024 @9:30:31 AM</p>
                </div>
                <br />
                <div>
                  <p className="bold no-margin">Description:</p>
                  <p>Arunachalam created new evidence.</p>
                </div>
                <br />
                <div>
                  <p className="bold no-margin">Response:</p>
                  <p className="link">Show raw evidence</p>
                  <div className="card pad-10 mg-btm-10">
                    <div className="row">
                      <div className="col-lg-8">
                        <p className="bold no-margin">
                          Raw Evidence and Event Details .pdf
                        </p>
                        <p className="no-margin">
                          Get a .pdf file that contains raw evidence along with
                          event details
                        </p>
                      </div>
                      <div className="col-lg-4">
                        <button className="btn btn-border btn-small float-right">
                          <i className="fa fa-download link" /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card pad-10">
                    <div className="row">
                      <div className="col-lg-8">
                        <p className="bold no-margin">Raw Evidence .txt</p>
                        <p className="no-margin">
                          Get a .txt file that only shows raw evidence
                        </p>
                      </div>
                      <div className="col-lg-4">
                        <button className="btn btn-border btn-small float-right">
                          <i className="fa fa-download link" /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <div>
                  <h4>Notes</h4>
                  <p className="no-margin gray">Add a new message</p>
                  <textarea className="form-textarea"></textarea>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventTracking;
