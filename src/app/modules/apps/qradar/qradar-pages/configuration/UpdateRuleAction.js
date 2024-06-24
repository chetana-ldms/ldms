import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { notify, notifyFail } from "../components/notification/Notification";
import {
  fetchLDPToolsByToolType,
  fetchRuleActionDetails,
  fetchRuleActionUpdateUrl,
  fetchToolActions,
} from "../../../../../api/ConfigurationApi";
import { fetchLDPTools, fetchMasterData } from "../../../../../api/Api";
import { useErrorBoundary } from "react-error-boundary";

const UpdateRuleAction = () => {
  const orgId = Number(sessionStorage.getItem("orgId"));
  const toolIds = Number(sessionStorage.getItem('toolID'))
  const handleError = useErrorBoundary();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toolTypeActions, setToolTypeActions] = useState([]);
  const [toolAcations, setToolAcations] = useState([]);
  const [tools, setTools] = useState([]);
  const [toolTypes, setToolTypes] = useState([]);
  const [toolTypeAction, setToolTypeAction] = useState({
    ruleActionName: "",
    toolTypeName: "",
    toolTypeID: "",
    toolName: "",
    toolID: "",
    toolActionName: "",
    toolActionID: "",
  });

  // const [ruleCatagories, setRuleCatagories] = useState([])
  // const [rulesconditiontypes, setRulesconditiontypes] = useState([])
  const ruleActionName = useRef();
  const toolTypeID = useRef();
  const toolId = useRef();
  const toolActionID = useRef();
  const errors = {};
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRuleActionDetails(id);
        setToolTypeAction({
          ...toolTypeAction,
          ruleActionName: data.ruleActionName,
          toolTypeName: data.toolTypeName,
          toolTypeID: data.toolTypeID,
          toolName: data.toolName,
          toolID: data.toolID,
          toolActionName: data.toolActionName,
          toolActionID: data.toolActionID,
        });
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLDPTools();
        setTools(data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchToolActions();
        setToolTypeActions(data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, []);
  const handleChange = (event, field) => {
    const selectedValue = event.target.value;

    if (field === "ruleActionName") {
      setToolTypeAction((prevState) => ({
        ...prevState,
        [field]: selectedValue,
      }));
    }

    if (field === "toolName" || field === "toolActionName") {
      const selectedId = event.target.options[
        event.target.selectedIndex
      ].getAttribute("data-id");
      setToolTypeAction((prevState) => ({
        ...prevState,
        [field === "toolName" ? "toolID" : "toolActionID"]: selectedId,
        [field]: selectedValue,
      }));
    }

    if (field === "toolTypeName") {
      const selectedId = event.target.options[
        event.target.selectedIndex
      ].getAttribute("data-id");
      const fetchData = async () => {
        try {
          const data = {
            toolTypeId: Number(selectedId),
          };
          const response = await fetchLDPToolsByToolType(data);
          const result = response.ldpToolsList;
          setTools(result);
        } catch (error) {
          handleError(error);
        }
      };

      fetchData();
      setToolTypeAction((prevState) => ({
        ...prevState,
        dataID: selectedId,
        toolTypeName: selectedValue,
      }));
    }
  };

  useEffect(() => {
    const fetchToolTypesData = async () => {
      const data = {
        maserDataType: 'Tool_Types',
        orgId: orgId,
        toolId: toolIds,
      };
  
      try {
        const typeData = await fetchMasterData(data);
        setToolTypes(typeData);
      } catch (error) {
        handleError(error);
      }
    };
  
    fetchToolTypesData();
  }, []);
  
  const handleSubmit = async (event) => {
    setLoading(true);
    if (!ruleActionName.current.value) {
      errors.ruleActionName = "Enter Rule Action Name";
      setLoading(false);
      return errors;
    }
    if (!toolTypeID.current.value) {
      errors.toolTypeID = "Select Tool Type";
      setLoading(false);
      return errors;
    }
    if (!toolId.current.value) {
      errors.toolId = "Select Tool";
      setLoading(false);
      return errors;
    }
    if (!toolActionID.current.value) {
      errors.toolActionID = "Select Tool Action";
      setLoading(false);
      return errors;
    }
    event.preventDefault();
    const modifieduserid = Number(sessionStorage.getItem("userId"));
    const orgId = Number(sessionStorage.getItem("orgId"));
    const modifieddate = new Date().toISOString();
    var data = {
      ruleActionName: toolTypeAction.ruleActionName,
      toolTypeID: toolTypeAction.toolTypeID,
      toolID: toolTypeAction.toolID,
      toolActionID: toolTypeAction.toolActionID,
      ruleGenerelActionID: 0,
      ruleActionID: id,
      orgId,
      modifieddate,
      modifieduserid,
    };
    try {
      const responseData = await fetchRuleActionUpdateUrl(data);
      const { isSuccess } = responseData;

      if (isSuccess) {
        notify("Rule Action Updated");
        navigate("/qradar/rules-actions/updated");
      } else {
        notifyFail("Failed to update Rule Action");
      }
    } catch (error) {
      handleError(error);
    }
    setLoading(false);
  };

  return (
    <div className="config card">
      {loading && <UsersListLoading />}
      <div className="card-header bg-heading">
        <h3 className="card-title align-items-start flex-column">
          <span className="white">Update Rule Action</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link
              to="/qradar/rules-actions/list"
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
            <div className="col-lg-6 mb-8 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="ruleName"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Rule Action Name
                </label>
                <input
                  type="text"
                  required
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Ex: FreshDesk_CreateTicket"
                  value={toolTypeAction.ruleActionName}
                  onChange={(e) => handleChange(e, "ruleActionName")}
                  ref={ruleActionName}
                />
              </div>
            </div>
            <div className="col-lg-6 mb-8 mb-lg-0">
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
                  value={toolTypeAction.toolTypeName}
                  onChange={(e) => handleChange(e, "toolTypeName")}
                  // onChange={handleChangeToolType}
                  required
                >
                  <option value="">Select Tool Type</option>
                  {toolTypes.map((item, index) => (
                    <option
                      value={item.dataValue}
                      key={index}
                      data-id={item.dataID}
                    >
                      {item.dataValue}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <br />

            <div className="col-lg-6 mb-4 mb-lg-0 mt-5">
              <div className="fv-row mb-0">
                <label
                  htmlFor="toolID"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Select Tool
                </label>
                <select
                  className="form-select form-select-solid"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-allow-clear="true"
                  id="toolID"
                  value={toolTypeAction.toolName}
                  onChange={(e) => handleChange(e, "toolName")}
                  ref={toolId}
                  required
                >
                  <option value="">Select Tool</option>
                  {tools.map((item, index) => (
                    <option
                      value={item.toolName}
                      key={index}
                      data-id={item.toolId}
                    >
                      {item.toolName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-lg-6 mb-4 mt-5 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="toolActionID"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Select Tool Action
                </label>
                <select
                  className="form-select form-select-solid"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-allow-clear="true"
                  id="toolActionID"
                  value={toolTypeAction.toolActionName}
                  onChange={(e) => handleChange(e, "toolActionName")}
                  ref={toolActionID}
                  required
                >
                  <option value="">Select Tool Action</option>
                  {toolTypeActions.map((item, index) => (
                    <option
                      value={item.toolTypeActionName}
                      key={index}
                      data-id={item.toolActionID}
                    >
                      {item.toolTypeActionName}
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

export { UpdateRuleAction };
