import React from "react";
import { Link, useParams } from "react-router-dom";

const MasterData = () => {
  return (
    <div className="card">
      <div className="card-header no-pad">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Master Data</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link
              to="/qradar/master-data/add"
              className="btn btn-new btn-small"
            >
              Add
            </Link>
          </div>
        </div>
      </div>
      <div className="card-body pad-10">
        <table className="table align-middle gs-0 gy-4 dash-table alert-table">
          <thead>
            <tr className="fw-bold text-muted bg-blue">
              <th>Data ID</th>
              <th>Data Type</th>
              <th>Data Name</th>
              <th>Data Value</th>
              <th>Created Date</th>
              <th>Modified Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="fs-12">
              <td>0</td>
              <td>string</td>
              <td>string</td>
              <td>string</td>
              <td>28/12/2022 9:30PM</td>
              <td>28/12/2022 9:35PM</td>
              <td>
                <button className="btn btn-primary btn-circle">
                  <Link
                    className="text-white"
                    to={`/qradar/master-data/update`}
                    title="Edit"
                  >
                    <i className="fa fa-pencil white" />
                  </Link>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { MasterData };
