import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notify, notifyFail } from "../components/notification/Notification";
import axios from "axios";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import {
  fetchLDPToolsByToolType,
  fetchToolActionAddUrl,
  fetchToolTypeActions,
} from "../../../../../api/ConfigurationApi";
import { fetchMasterData } from "../../../../../api/Api";
import { useErrorBoundary } from "react-error-boundary";

const AddToolAction = () => {
  const handleError = useErrorBoundary();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toolTypes, setToolTypes] = useState([]);
  const [toolActionTypes, setToolActionTypes] = useState([]);
  const [ldpTools, setLdpTools] = useState([]);
  const toolID = useRef();
  const toolId = useRef();
  const toolTypeActionID = useRef();
  const errors = {};
  useEffect(() => {
    setLoading(true);
    fetchMasterData("Tool_Types")
      .then((typeData) => {
        setToolTypes(typeData);
        setLoading(false);
      })
      .catch((error) => {
        handleError(error);
      });
  }, []);
  const handleSubmit = async (event) => {
    if (!toolID.current.value) {
      errors.toolID = "Enter Tool Type";
      setLoading(false);
      return errors;
    }
    if (!toolTypeActionID.current.value) {
      errors.toolTypeActionID = "Enter Tool Action Type";
      setLoading(false);
      return errors;
    }
    setLoading(true);
    event.preventDefault();
    const createdUserId = Number(sessionStorage.getItem("userId"));
    const createdDate = new Date().toISOString();
    var data = {
      toolID: toolID.current.value,
      toolTypeActionID: toolTypeActionID.current.value,
      createdDate,
      createdUserId,
    };
    try {
      const responseData = await fetchToolActionAddUrl(data);
      const { isSuccess } = responseData;

      if (isSuccess) {
        notify("Tool Action Saved");
        navigate("/qradar/tool-actions/updated");
      } else {
        notifyFail("Failed to save Tool Action");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  let handleChangeToolType = (event) => {
    let selectedValue = event.target.value;
    const result = async () => {
      try {
        const data = {
          toolTypeId: Number(selectedValue),
        };
        const response = await fetchLDPToolsByToolType(data);
        const result = response.ldpToolsList;
        setLdpTools(result);
      } catch (error) {
        handleError(error);
      }
    };

    result();
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await fetchToolTypeActions();
        const result = response.filter(
          (item) => item.toolTypeID === Number(selectedValue)
        );
        setToolActionTypes(result);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  };
  return (
    <div className="config card">
      {loading && <UsersListLoading />}
      <div className="card-header bg-heading">
        <h3 className="card-title align-items-start flex-column">
          <span className="white">Add New Tool Action</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link
              to="/qradar/tool-actions/list"
              className="white text-underline fs-15"
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
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="toolID"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Select Tool Type
                </label>
                <select
                  className="form-select form-select-solid"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-allow-clear="true"
                  id="toolID"
                  onChange={handleChangeToolType}
                  required
                >
                  <option value="">Select</option>
                  {toolTypes.map((item, index) => (
                    <option value={item.dataID} key={index}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="toolID"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Select Tools
                </label>
                <select
                  className="form-select form-select-solid"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-allow-clear="true"
                  id="toolId"
                  ref={toolID}
                  required
                >
                  <option value="">Select</option>
                  {ldpTools.map((item, index) => (
                    <option value={item.toolId} key={index}>
                      {item.toolName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="toolTypeActionID"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Select Tool Action Type
                </label>
                <select
                  className="form-select form-select-solid"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-allow-clear="true"
                  id="toolTypeActionID"
                  ref={toolTypeActionID}
                  required
                >
                  <option value="">Select</option>
                  {toolActionTypes.map((item, index) => (
                    <option value={item.toolTypeActionID} key={index}>
                      {item.toolAction}
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

export { AddToolAction };
