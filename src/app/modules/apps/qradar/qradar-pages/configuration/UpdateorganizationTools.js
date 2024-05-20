import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notify, notifyFail } from "../components/notification/Notification";
import axios from "axios";
import {
  fetchGetToolActionsByToolURL,
  fetchLDPToolsByToolType,
  fetchOrganizationToolDetails,
  fetchOrganizationToolsUpdateUrl,
  fetchToolTypeActions,
} from "../../../../../api/ConfigurationApi";
import { fetchLDPTools, fetchMasterData } from "../../../../../api/Api";
import { fetchOrganizations } from "../../../../../api/dashBoardApi";
import { useErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import DeleteConfirmation from "../../../../../../utils/DeleteConfirmation";

const UpdateOrganizationTools = () => {
  const handleError = useErrorBoundary();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toolTypes, setToolTypes] = useState([]);
  console.log(toolTypes, "toolTypes111111111");
  const [toolName, setToolName] = useState([]);
  const [organizationList, setOrganizationList] = useState([]);
  const [toolTypeAction, setToolTypeAction] = useState({
    orgID: "",
    orgName: "",
    toolTypeId: "",
    toolTypeName: "",
    toolID: "",
    toolName: "",
    authKey: "",
    apiUrl: "",
  });
  console.log(toolTypeAction, "toolTypeAction11111");
  const [selectedToolAction, setSelectedToolAction] = useState("");
  const [toolActionTypes, setToolActionTypes] = useState([]);
  console.log(toolActionTypes, "toolActionTypescheck");
  const [enteredApiUrl, setEnteredApiUrl] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedToolType, setSelectedToolType] = useState(null);
  const [selectedToolId, setSelectedToolId] = useState(null);
  console.log(selectedToolId, "selectedToolId");
  const [initialToolActions, setInitialToolActions] = useState([]);
  console.log(initialToolActions, "initialToolActions");
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const { id } = useParams();
  const toolID = useRef();
  const orgID = useRef();
  const authKey = useRef();
  const apiUrl = useRef();
  const errors = {};
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOrganizationToolDetails(id);
        setToolTypeAction({
          ...toolTypeAction,
          orgID: data.orgID,
          orgName: data.orgName,
          toolTypeId: data.toolTypeId,
          toolTypeName: data.toolTypeName,
          toolID: data.toolID,
          toolName: data.toolName,
          authKey: data.authKey,
          // apiUrl: data.apiUrl
        });
        handleChange(data, "toolTypeName");
        setInitialToolActions(data.toolActions || []);
        toolData(data.toolID);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);
  const toolData = (ToolId) => {
    const fetchData1 = async () => {
      try {
        setLoading(true);

        const data = {
          toolId: Number(ToolId),
        };
        const response = await fetchGetToolActionsByToolURL(data);
        setToolActionTypes(response.toolAcationsList);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData1();
  };

  useEffect(() => {
    setTableData(
      initialToolActions.map((item) => ({
        orgToolActionId: item.orgToolActionId,
        toolAction: item.toolActionName,
        toolActionID: item.toolActionId,
        apiUrl: item.apiUrl,
      }))
    );
  }, [initialToolActions]);
  const handleSubmit = async (event, toolTypeAction) => {
    setLoading(true);
    if (!toolID.current.value) {
      errors.toolID = "Enter Tool";
      setLoading(false);
      return errors;
    }
    if (!orgID.current.value) {
      errors.orgID = "Enter Organization";
      setLoading(false);
      return errors;
    }
    if (!authKey.current.value) {
      errors.authKey = "Enter Auth Key";
      setLoading(false);
      return errors;
    }
    if (!tableData.length > 0) {
      errors.tableData = "Enter Table Data";
      setLoading(false);
      return errors;
    }
    // if (!apiUrl.current.value) {
    //   errors.apiUrl = 'Enter api url'
    //   setLoading(false)
    //   return errors
    // }
    event.preventDefault();
    const modifiedUserId = Number(sessionStorage.getItem("userId"));
    const modifiedDate = new Date().toISOString();
    var data = {
      toolID: toolTypeAction.toolID,
      orgID: toolTypeAction.orgID,
      authKey: toolTypeAction.authKey,
      orgToolID: Number(id),
      modifiedDate,
      modifiedUserId,
      lastReadPKID: 0,
      toolActions: tableData.map((item) => ({
        toolActionId: item.toolActionID,
        orgToolActionId: item.orgToolActionId,
        apiUrl: item.apiUrl,
        apiVerson: "string",
        getDataBatchSize: 0,
      })),
    };
    try {
      const responseData = await fetchOrganizationToolsUpdateUrl(data);
      const { isSuccess } = responseData;

      if (isSuccess) {
        notify("Organizations Tool Updated");
        setTimeout(() => {
          navigate("/qradar/organization-tools/updated");
        }, 2000);
      } else {
        notifyFail("Failed to update Organizations Tool");
      }
    } catch (error) {
      handleError(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchMasterData("Tool_Types")
      .then((typeData) => {
        setToolTypes(typeData);
      })
      .catch((error) => {
        handleError(error);
      });
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizationsResponse = await fetchOrganizations();
        setOrganizationList(organizationsResponse);
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, []);
  const handleChange = (event, field) => {
    const selectedValue = event?.target?.value;

    if (field === "authKey" || field === "apiUrl") {
      setToolTypeAction((prevState) => ({
        ...prevState,
        [field]: selectedValue,
      }));
    }

    if (field === "toolName" || field === "orgName") {
      const selectedId = event.target.options[
        event.target.selectedIndex
      ].getAttribute("data-id");
      setToolTypeAction((prevState) => ({
        ...prevState,
        [field === "toolName" ? "toolID" : "orgID"]: selectedId,
        [field]: selectedValue,
      }));
      setSelectedToolId(selectedId);
      toolData(selectedId);
    }

    if (field === "toolTypeName") {
      const selectedId = event.toolTypeId
        ? event.toolTypeId
        : event.target.options[event.target.selectedIndex].getAttribute(
            "data-id"
          );
      setSelectedToolType(selectedId);
      const fetchData = async () => {
        try {
          const data = {
            toolTypeId: Number(selectedId),
          };
          const response = await fetchLDPToolsByToolType(data);
          const result = response.ldpToolsList;
          setToolName(result);
        } catch (error) {
          handleError(error);
        }
      };
      fetchData();
      setToolTypeAction((prevState) => ({
        ...prevState,
        toolTypeId: selectedId,
        toolTypeName: selectedValue || event.toolTypeName,
      }));
    }
  };
  const handleAction = (event) => {
    event.preventDefault();

    if (!selectedToolAction || !enteredApiUrl) {
      notifyFail("Please select Tool Action and enter API URL");
      return;
    }

    const toolActionID = toolActionTypes.find(
      (item) => item.toolTypeActionName === selectedToolAction
    )?.toolActionID;

    if (isEditing) {
      const updatedTableData = [...tableData];
      const existingItem = updatedTableData[editingIndex];
      updatedTableData[editingIndex] = {
        ...existingItem,
        toolAction: selectedToolAction,
        toolActionID: toolActionID,
        apiUrl: enteredApiUrl,
      };
      setTableData(updatedTableData);
    } else {
      const existingItem = tableData.find(
        (item) =>
          item.toolAction === selectedToolAction &&
          item.apiUrl === enteredApiUrl
      );
      if (!existingItem) {
        const newToolAction = {
          toolAction: selectedToolAction,
          toolActionID: toolActionID,
          apiUrl: enteredApiUrl,
        };
        setTableData([...tableData, newToolAction]);
      } else {
        console.log("Item already exists");
      }
    }
    setSelectedToolAction("");
    setEnteredApiUrl("");
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    setShowConfirmation(true);
    setItemToDelete(index);
};
const confirmDelete = async () => {
  const updatedTableData = [...tableData];
  updatedTableData.splice(itemToDelete, 1);
  setTableData(updatedTableData);
  setShowConfirmation(false);
};

 
  const cancelDelete = () => {
    setShowConfirmation(false);
    setItemToDelete(null);
  };


  // const handleDelete = (index) => {
  //   const updatedTableData = [...tableData];
  //   updatedTableData.splice(index, 1);
  //   setTableData(updatedTableData);
  // };
  const handleEdit = (index) => {
    setEditingIndex(index);
    const editedItem = tableData[index];
    setSelectedToolAction(editedItem.toolAction);
    setEnteredApiUrl(editedItem.apiUrl);
    setIsEditing(true);
  };

  return (
    <div className="config card">
      <ToastContainer />
      <div className="card-header bg-header">
        <h3 className="card-title align-items-start flex-column">
          <span className="white">Update Organization Tool</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link to="/qradar/organization-tools/list" className="white fs-15">
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
                  htmlFor="orgID"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Organization
                </label>
                <select
                  className="form-select form-select-solid"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-allow-clear="true"
                  id="orgID"
                  value={toolTypeAction.orgName}
                  onChange={(e) => handleChange(e, "orgName")}
                  ref={orgID}
                  required
                >
                  <option value="">Select</option>
                  {organizationList.map((item, index) => (
                    <option
                      value={item.orgName}
                      key={index}
                      data-id={item.orgID}
                    >
                      {item.orgName}
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
                  Tool Type
                </label>
                <select
                  className="form-select form-select-solid"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-allow-clear="true"
                  id="toolID"
                  value={toolTypeAction?.toolTypeName}
                  onChange={(e) => handleChange(e, "toolTypeName")}
                  // ref={toolID}
                  required
                >
                  <option value="">Select</option>
                  {toolTypes?.map((item, index) => (
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
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="toolID"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Tool
                </label>
                <select
                  className="form-select form-select-solid"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-allow-clear="true"
                  id="toolID"
                  value={toolTypeAction?.toolName}
                  onChange={(e) => handleChange(e, "toolName")}
                  ref={toolID}
                  required
                >
                  <option value="">Select</option>
                  {toolName?.map((item, index) => (
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
            <div className="col-lg-4 mb-4 mt-5 mb-lg-0">
              <div className="fv-row mb-0">
                <label
                  htmlFor="authKey"
                  className="form-label fs-6 fw-bolder mb-3"
                >
                  Authentication Key
                </label>
                <input
                  type="text"
                  required
                  className="form-control form-control-lg form-control-solid"
                  id="authKey"
                  ref={authKey}
                  maxLength={4000}
                  onChange={(e) => handleChange(e, "authKey")}
                  value={toolTypeAction.authKey}
                  placeholder="Ex: xxxxxxxxxxxxxxxxx"
                />
              </div>
            </div>
            <div className="card-body pad-10 mt-5">
              <div className="row mb-6">
                <div className="col-lg-4 mb-4 mb-lg-0">
                  <div className="fv-row mb-0">
                    <label
                      htmlFor="toolTypeActionID"
                      className="form-label fs-6 fw-bolder mb-3"
                    >
                      Tool Action
                    </label>
                    <select
                      className="form-select form-select-solid"
                      data-kt-select2="true"
                      data-placeholder="Select option"
                      data-allow-clear="true"
                      value={selectedToolAction}
                      onChange={(e) => setSelectedToolAction(e.target.value)}
                      // required
                    >
                      <option value="">Select</option>
                      {toolActionTypes?.map((item, index) => (
                        <option value={item.toolTypeActionName} key={index}>
                          {item.toolTypeActionName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-lg-4 mb-4 mb-lg-0">
                  <div className="fv-row mb-0">
                    <label
                      htmlFor="apiUrl"
                      className="form-label fs-6 fw-bolder mb-3"
                    >
                      API URL
                    </label>
                    <input
                      type="text"
                      // required
                      className="form-control form-control-lg form-control-solid"
                      id="apiUrl"
                      ref={apiUrl}
                      value={enteredApiUrl}
                      maxLength={500}
                      onChange={(e) => setEnteredApiUrl(e.target.value)}
                      placeholder="Ex: https://10.100.0.102/api/siem/offences"
                    />
                  </div>
                </div>
                <div className="col-lg-4 mb-4 mb-lg-0 d-flex align-items-end justify-content-start">
                  <button
                    className="btn btn-green btn-small"
                    onClick={handleAction}
                  >
                    {isEditing ? "Update Action" : "Add Action"}
                  </button>
                </div>
              </div>
            </div>
            <div className="card-footer d-flex justify-content-end pad-10">
              <button
                type="submit"
                onClick={(e) => handleSubmit(e, toolTypeAction)}
                className="btn btn-new btn-small"
                disabled={loading}
              >
                {!loading && "Update Changes"}
                {loading && (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    Please wait...{" "}
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>

            {tableData.length > 0 && (
              <div className="card-body border-top pad-10">
                <h4>List of Tool Actions</h4>
                <table className="table alert-table fixed-table">
                  <thead>
                    <tr className="bg-blue">
                      <th className="bold w-400px">Tool Action</th>
                      <th className="bold w-400px">API URL</th>
                      <th className="bold w-200px">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.toolAction}</td>
                        <td className="wrap-txt" title="{item.apiUrl}">
                          {item.apiUrl}
                        </td>
                        <td>
                          <span
                            title="Edit"
                            onClick={() => handleEdit(index)}
                            style={{ borderRadius: "50%", marginRight: "10px" }}
                            type="button"
                          >
                            <i className="fa fa-pencil link" />
                          </span>
                          <span
                            className="ms-8"
                            title="Remove"
                            onClick={() => handleDelete(index)}
                            style={{ borderRadius: "50%" }}
                            type="button"
                          >
                            <i className="fa fa-trash red" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </form>
      {showConfirmation && (
          <DeleteConfirmation
            show={showConfirmation}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
    </div>
  );
};

export { UpdateOrganizationTools };
