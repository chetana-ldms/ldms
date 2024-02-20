import React, { useState } from "react";
import MonitoringPopUp from "./MonitoringPopUp";

function Monitoring() {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const testData = [
    {
      id: 1,
      testName: "MFA on Identity Provider",
      lastTested: "11 hours ago",
      icon: "fa fa-users",
    },
    {
      id: 2,
      testName: "Password Manager Required",
      lastTested: "11 hours ago",
      icon: "fa fa-file-text",
    },
    {
      id: 3,
      testName: "Has a Backup Policy",
      lastTested: "11 hours ago",
      icon: "fa fa-file-text",
    },
    {
      id: 4,
      testName: "Daily Database Backup",
      lastTested: "11 hours ago",
      icon: "fa fa-file-text",
    },
  ];

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };
  return (
    <div className="compliance compliance-monitor compliance-controls">
      <h2>Monitoring</h2>
      <br />
      <div className="row monitor-card">
        <div className="col-lg-4">
          <div className="card text-center alert-warning">
            <h4>of Tests Passed</h4>
            <p>
              <i className="fa fa-percent green" /> 42%
            </p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card text-center alert-danger">
            <h4>Failed Tests</h4>
            <p>
              <i className="fa fa-minus red" /> 42%
            </p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card text-center alert-success">
            <h4>Passed Tests</h4>
            <p>
              <i className="fa fa-plus green" /> 35%
            </p>
          </div>
        </div>
      </div>
      <br />
      <hr />
      <br />
      <div className="row">
        <div className="col-lg-3 controls-left">
          <h4>Test Results</h4>
          <ul>
            <li>
              <i className="fa fa-minus-circle" />
              Failed
            </li>
            <li>
              <i className="fa fa-plus-circle" />
              Passed
            </li>
            <li>
              <i className="fa fa-exclamation-circle" />
              Error
            </li>
            <hr />
            <h4>Category</h4>
            <li>
              <i className="fa fa-compass" />
              Policy
            </li>
          </ul>
        </div>
        <div className="col-lg-9">
          <div className="sort-section row">
            <div className="col-lg-11">
              <input
                type="text"
                placeholder="Search automated tests..."
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-lg-1">
              <i className="fa fa-download green" />
            </div>
          </div>
          <br />
          <div className="controls-content">
            <div className="tab-pane fade show active" id="inScope">
              <table className="table">
                <tbody>
                  {testData.map((test) => (
                    <tr key={test.id} onClick={() => handleRowClick(test)}>
                      <td>
                        <h4>{test.testName}</h4>
                      </td>
                      <td>
                        <span className="gray">
                          Last Tested: {test.lastTested}{" "}
                          <i className={test.icon} />
                        </span>
                      </td>
                      <td>
                        <div className="float-right right-icons">
                          <button className="btn btn-danger btn-small">
                            <i className="fa fa-exclamation-circle white" /> Fix
                            Now
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <MonitoringPopUp
        showModal={showModal}
        setShowModal={setShowModal}
        selectedItem={selectedItem}
      />
    </div>
  );
}

export default Monitoring;
