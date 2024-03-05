import React from "react";

function InventoryComponent() {
  return (
    <div className="application-section mg-top-20 mg-btm-20">
      <div className="header-filter mg-btm-20">
        <form>
          <select className="form-select">
            <option>Select filter</option>
          </select>
        </form>
      </div>
      <div className="actions">
        <div className="row">
          <div className="col-lg-6">
            <button className="btn btn-new btn-small float-left">
              Actions <i className="fa fa-chevron-down white" />
            </button>
            <div className="float-left mg-left-20">
              <span className="fs-12 gray mg-right-10 inline-block">
                Last Scanned:
              </span>{" "}
              <span>Feb 28, 2024 9:30 AM</span>
              <br />
              <span className="fs-12 gray mg-right-10 inline-block">
                Next Scanned:
              </span>{" "}
              <span>Feb 28, 2024 9:30 AM</span>
            </div>
          </div>
          <div className="col-lg-6 text-right">
            <span className="gray inline-block mg-righ-20">530 Items</span>
            <span className="inline-block mg-left-10">
              <select className="form-select form-select-sm">
                <option>50 Results</option>
              </select>
            </span>
            <span className="inline-block mg-left-10">
              <select className="form-select form-select-sm">
                <option>Columns</option>
              </select>
            </span>
            <span className="inline-block mg-left-10 link">
              Export <i className="fas fa-file-export link" />
            </span>
          </div>
        </div>
        <table className="table alert-table mg-top-20">
          <thead>
            <tr>
              <th>Name</th>
              <th>Vendor</th>
              <th>Number of Versions</th>
              <th>Number of Endpoints</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>text</td>
              <td>text</td>
              <td>text</td>
              <td>text</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryComponent;
