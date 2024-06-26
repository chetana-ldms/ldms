import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { notify, notifyFail } from "../components/notification/Notification";
import { fetchMasterData } from "../../../../../api/Api";
import { fetchToolTypeActionAddUrl } from "../../../../../api/ConfigurationApi";
import { useErrorBoundary } from "react-error-boundary";

const AddToolTypeAction = () => {
  const handleError = useErrorBoundary();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toolTypes, setToolTypes] = useState([]);
  const toolTypeID = useRef();
  const toolAction = useRef();
  const errors = {};

  useEffect(() => {
    fetchMasterData("Tool_Types")
      .then((typeData) => {
        setToolTypes(typeData);
      })
      .catch((error) => {
        handleError(error);
      });
  }, []);

  const handleSubmit = async (event) => {
    setLoading(true);
    if (!toolAction.current.value) {
      errors.toolAction = "Select Tool Action";
      setLoading(false);
      return errors;
    }
    if (!toolTypeID.current.value) {
      errors.toolTypeID = "Select Tool Type";
      setLoading(false);
      return errors;
    }

    event.preventDefault();
    const createdUserId = Number(sessionStorage.getItem("userId"));
    const createdDate = new Date().toISOString();
    var data = {
      toolTypeID: toolTypeID.current.value,
      toolAction: toolAction.current.value,
      createdDate,
      createdUserId,
    };
    try {
      const responseData = await fetchToolTypeActionAddUrl(data);
      const { isSuccess } = responseData;

      if (isSuccess) {
        notify(" Tool Type Action Saved");
        navigate("/qradar/tool-type-actions/list");
      } else {
        notifyFail("Failed to save  Tool Type Action");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="config card">
      {loading && <UsersListLoading />}
      <div className="card-header bg-heading">
        <h3 className="card-title align-items-start flex-column">
          <span className="white">Add Tool Type Action</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link
              to="/qradar/tool-type-actions/list"
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
                  htmlFor="toolAction"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Enter Tool Type Action
                </label>
                <input
                  type="text"
                  required
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Ex: CreateTicket"
                  ref={toolAction}
                />
              </div>
            </div>
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="toolTypeID"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Select Tool Type
                </label>
                <select
                  className="form-select form-select-solid"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-allow-clear="true"
                  id="toolTypeID"
                  ref={toolTypeID}
                  required
                >
                  <option value="">Select Tool Type</option>
                  {toolTypes.map((item, index) => (
                    <option value={item.dataID} key={index}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
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
            {!loading && "Save Changes"}
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

export { AddToolTypeAction };
