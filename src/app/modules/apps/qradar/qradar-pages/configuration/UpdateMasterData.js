import React, { useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdateMasterData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const toolName = useRef();
  const toolType = useRef();
  const errors = {};
  const handleSubmit = (event) => {
    setLoading(true);
    if (!toolName.current.value) {
      errors.toolName = "Enter Tool Name";
      setLoading(false);
      return errors;
    }
    if (!toolType.current.value) {
      errors.toolType = "Enter Tool Type";
      setLoading(false);
      return errors;
    }
    event.preventDefault();
    var data = JSON.stringify({
      toolName: toolName.current.value,
      toolType: toolType.current.value,
      toolID: id,
      updatedByUser: "super_admin",
      updatedDate: "2022-12-28T17:59:17.134Z",
    });
    var config = {
      method: "post",
      url: "http://115.110.192.133:502/api/LDPlattform/v1/MasterData/Update",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
      },
      data: data,
    };
    setTimeout(() => {
      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          navigate("/qradar/master-data/updated");
        })
        .catch(function (error) {
          console.log(error);
        });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="config card">
      <div className="card-header bg-heading">
        <h3 className="card-title align-items-start flex-column">
          <span className="white">Configure New Master Data</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link
              to="/qradar/master-data/list"
              className="white fs-15 text-underline"
            >
              <i className="fa fa-chevron-left white mg-right-5" />
              Back
            </Link>
          </div>
        </div>
      </div>
      <form>
        <div className="card-body pad-10">
          <div className="row mb-6 table-filter">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="toolName"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Enter Tool Name
                </label>
                <input
                  type="text"
                  required
                  className="form-control form-control-lg form-control-solid"
                  id="toolName"
                  ref={toolName}
                  placeholder="Ex: Qradar"
                />
              </div>
            </div>
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="toolType"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Enter Tool Type
                </label>
                <input
                  type="text"
                  required
                  className="form-control form-control-lg form-control-solid"
                  id="toolType"
                  ref={toolType}
                  placeholder="Ex: SIEM"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end pad-10">
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-new btn-small"
            disabled={loading}
          >
            {!loading && "Update Changes"}
            {loading && (
              <span className="indicator-progress" style={{ display: "block" }}>
                Please wait...{" "}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export { UpdateMasterData };
