import React, { useState } from "react";

const Controle = () => {
  const [activeTab, setActiveTab] = useState("inScope");

  return (
    <div className="compliance-controls">
      <h2>Controls In Scope</h2>
      <div className="row">
        <div className="col-lg-12">
          <div className="float-right">
            <button className="btn btn-primary btn-new btn-small">
              Create New Control
            </button>
          </div>
        </div>
      </div>
      <br />
      <hr />
      <div className="row">
        <div className="col-lg-3 controls-left">
          <h4>All Controls</h4>
          <hr />
          <h4>Frameworks</h4>
          <ul>
            <li>
              <i className="fa fa-compass" />
              CCM
            </li>
            <li>
              <i className="fa fa-compass" />
              CCPA
            </li>
            <li>
              <i className="fa fa-compass" />
              CMMC
            </li>
            <li>
              <i className="fa fa-compass" />
              COBIT
            </li>
          </ul>
        </div>
        <div className="col-lg-9">
          <div className="sort-section row">
            <div className="col-lg-3 d-flex ">
              <ul className="nav nav-tabs p-0 border-0 fs-8">
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "inScope" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("inScope")}
                  >
                    In Scope
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "outScope" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("outScope")}
                  >
                    Out of Scope
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <input
                type="text"
                placeholder="Search controls by name, description, code"
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-lg-3">
              <select placeholder="Sort By:">
                <option>Sort By:</option>
                <option>Name</option>
                <option>Control code</option>
                <option>All controls</option>
                <option>Filtered view</option>
                <option>Download CSV</option>
              </select>
            </div>
          </div>
          <br />
          <div className="controls-content">
            {activeTab === "inScope" && (
              <div className="tab-pane fade show active" id="inScope">
                <table className="table">
                  <tbody>
                    <tr>
                      <td>
                        <div className="checkbox">
                          <input type="checkbox" />
                          <i className="fa fa-check-square" />
                        </div>
                      </td>
                      <td>Description</td>
                      <td>
                        <div className="float-right right-icons">
                          <i className="fa fa-paperclip" />
                          <i className="fa fa-indent" />
                          <i className="fa fa-users" />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="checkbox">
                          <input type="checkbox" />
                          <i className="fa fa-check-square" />
                        </div>
                      </td>
                      <td>Description</td>
                      <td>
                        <div className="float-right right-icons">
                          <i className="fa fa-paperclip" />
                          <i className="fa fa-indent" />
                          <i className="fa fa-users" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "outScope" && (
              <div className="tab-pane fade show active" id="outScope">
                <table className="table">
                  <tbody>
                    <tr>
                      <td>
                        <div className="checkbox">
                          <input type="checkbox" />
                          <i className="fa fa-check-square" />
                        </div>
                      </td>
                      <td>Description Change</td>
                      <td>
                        <div className="float-right right-icons">
                          <i className="fa fa-paperclip" />
                          <i className="fa fa-indent" />
                          <i className="fa fa-users" />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="checkbox">
                          <input type="checkbox" />
                          <i className="fa fa-check-square" />
                        </div>
                      </td>
                      <td>Description Change</td>
                      <td>
                        <div className="float-right right-icons">
                          <i className="fa fa-paperclip" />
                          <i className="fa fa-indent" />
                          <i className="fa fa-users" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controle;
