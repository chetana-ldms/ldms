import React from "react";

function Controle() {
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
          <br />
          <p>Frameworks</p>
        </div>
        <div className="col-lg-9">
          <div className="sort-section row">
            <div className="col-lg-3">In Scope</div>
            <div className="col-lg-6">
              <input
                type="text"
                placeholder="Search controls by name, description, code"
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-lg-3">
              Sort By:
              <select>
                <option>Name</option>
                <option>Control code</option>
                <option>All controls</option>
                <option>Filtered view</option>
                <option>Download CSV</option>
              </select>
            </div>
          </div>
          <br />
          <div className="controls-table">
            <table className="table">
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
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Controle;
