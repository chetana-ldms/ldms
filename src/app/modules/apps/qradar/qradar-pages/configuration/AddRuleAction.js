import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { notify, notifyFail } from "../components/notification/Notification";
import {
  fetchRuleActionUrl,
} from "../../../../../api/ConfigurationApi";
import { fetchLDPTools, fetchMasterData } from "../../../../../api/Api";
import { useErrorBoundary } from "react-error-boundary";

const AddRuleAction = () => {
  const orgId = Number(sessionStorage.getItem("orgId"));
  const toolIds = Number(sessionStorage.getItem("toolID"));
  const handleError = useErrorBoundary();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [tools, setTools] = useState([]);
  const [masterData, setMasterData] = useState({
    actionTypes: [],
    executorTypes: [],
    dataTypes: [],
  });

  const [ruleAction, setRuleAction] = useState({
    actionName: "",
    actionCode: "",
    actionTypeId: 0,
    executorTypeId: 0,
    toolId: 0,
    // configuration: "",
    parameters: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [toolsData, actionTypes, executorTypes, dataTypes] = await Promise.all([
          fetchLDPTools(),
          fetchMasterData({ maserDataType: "action_type", orgId, toolId: toolIds }),
          fetchMasterData({ maserDataType: "executor_type", orgId, toolId: toolIds }),
          fetchMasterData({ maserDataType: "parameter_type", orgId, toolId: toolIds }),
        ]);
        setTools(toolsData || []);
        setMasterData({
          actionTypes: actionTypes || [],
          executorTypes: executorTypes || [],
          dataTypes: dataTypes || [],
        });
      } catch (error) {
        handleError(error);
      }
    };
    loadData();
  }, [orgId, toolIds]);

  const handleRuleChange = (field, value) => {
    setRuleAction((prev) => ({ ...prev, [field]: value }));
  };

  const addParameter = () => {
    setRuleAction((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        {
          parameterCode: "",
          parameterName: "",
          dataTypeId: 0,
          isRequired: false,
          defaultValue: "",
          validationRulesJson: "",
          displayOrder: prev.parameters.length + 1,
          isSensitive: false,
        },
      ],
    }));
  };

  const removeParameter = (index) => {
    setRuleAction((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index),
    }));
  };

  const handleParameterChange = (index, field, value) => {
    const newParams = [...ruleAction.parameters];
    newParams[index][field] = value;
    setRuleAction((prev) => ({ ...prev, parameters: newParams }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ruleAction.actionName || !ruleAction.actionCode) {
      notifyFail("Please enter Action Name and Code");
      return;
    }

    setLoading(true);
    const payload = {
      ...ruleAction,
      userId: Number(sessionStorage.getItem("userId")),
      actionTypeId: Number(ruleAction.actionTypeId),
      executorTypeId: Number(ruleAction.executorTypeId),
      toolId: Number(ruleAction.toolId),
    };

    try {
      const responseData = await fetchRuleActionUrl(payload);
      const { isSuccess } = responseData;

      if (isSuccess) {
        notify("Rule Action Saved");
        navigate("/qradar/rules-actions/list");
      } else {
        notifyFail("Failed to save Rule Action");
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
          <span className="white">Add New Rule Action</span>
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
      <form onSubmit={handleSubmit}>
        <div className='card-body pad-10'>
          <div className='row mb-8'>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>Action Name</label>
              <input
                type='text'
                className='form-control form-control-sm'
                value={ruleAction.actionName}
                onChange={(e) => handleRuleChange('actionName', e.target.value)}
                placeholder='Action Name'
              />
            </div>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>Action Code</label>
              <input
                type='text'
                className='form-control form-control-sm'
                value={ruleAction.actionCode}
                onChange={(e) => handleRuleChange('actionCode', e.target.value)}
                placeholder='Action Code'
              />
            </div>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>Action Type</label>
              <select
                className='form-select form-select-sm'
                value={ruleAction.actionTypeId}
                onChange={(e) => handleRuleChange('actionTypeId', e.target.value)}
              >
                <option value={0}>Select Type</option>
                {masterData.actionTypes.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>Executor Type</label>
              <select
                className='form-select form-select-sm'
                value={ruleAction.executorTypeId}
                onChange={(e) => handleRuleChange('executorTypeId', e.target.value)}
              >
                <option value={0}>Select Executor</option>
                {masterData.executorTypes.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>Tool</label>
              <select
                className='form-select form-select-sm'
                value={ruleAction.toolId}
                onChange={(e) => handleRuleChange('toolId', e.target.value)}
              >
                <option value={0}>Select Tool</option>
                {tools.map((item) => (
                  <option key={item.toolId} value={item.toolId}>
                    {item.toolName}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-12 mb-2'>
              <label className='form-label fw-bold small'>Configuration (JSON string)</label>
              <textarea
                className='form-control form-control-sm'
                rows='3'
                style={{height: 100}}
                value={ruleAction.configuration}
                onChange={(e) => handleRuleChange('configuration', e.target.value)}
                placeholder='{"key": "value"}'
              />
            </div>
          </div>

          <div className='border-top pt-5'>
            <div className='d-flex justify-content-between align-items-center mb-2'>
              <h5 className='mb-0'>Parameters</h5>
              <button type='button' className='btn btn-sm btn-primary' onClick={addParameter}>
                <i className='fa fa-plus me-2'></i> Add Parameter
              </button>
            </div>
            <div className='table-responsive'>
              <table className='table table-row-dashed align-middle gs-0 gy-3'>
                <thead>
                  <tr className='fw-bold text-muted bg-light'>
                    <th className='ps-4 min-w-100px'>Code</th>
                    <th className='min-w-100px'>Name</th>
                    <th className='min-w-100px'>Data Type</th>
                    <th className='min-w-100px'>Default Value</th>
                    <th className='min-w-80px'>Order</th>
                    <th className='min-w-50px'>Req.</th>
                    <th className='min-w-50px'>Sens.</th>
                    <th className='text-end pe-4'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ruleAction.parameters.map((param, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type='text'
                          className='form-control form-control-sm'
                          value={param.parameterCode}
                          onChange={(e) =>
                            handleParameterChange(index, 'parameterCode', e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type='text'
                          className='form-control form-control-sm'
                          value={param.parameterName}
                          onChange={(e) =>
                            handleParameterChange(index, 'parameterName', e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <select
                          className='form-select form-select-sm'
                          value={param.dataTypeId}
                          onChange={(e) =>
                            handleParameterChange(index, 'dataTypeId', Number(e.target.value))
                          }
                        >
                          <option value={0}>Type</option>
                          {masterData.dataTypes.map((item) => (
                            <option key={item.dataID} value={item.dataID}>
                              {item.dataValue}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type='text'
                          className='form-control form-control-sm'
                          value={param.defaultValue}
                          onChange={(e) =>
                            handleParameterChange(index, 'defaultValue', e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type='number'
                          className='form-control form-control-sm'
                          value={param.displayOrder}
                          onChange={(e) =>
                            handleParameterChange(index, 'displayOrder', Number(e.target.value))
                          }
                        />
                      </td>
                      <td className='text-center'>
                        <input
                          type='checkbox'
                          className='form-check-input'
                          checked={param.isRequired}
                          onChange={(e) =>
                            handleParameterChange(index, 'isRequired', e.target.checked)
                          }
                        />
                      </td>
                      <td className='text-center'>
                        <input
                          type='checkbox'
                          className='form-check-input'
                          checked={param.isSensitive}
                          onChange={(e) =>
                            handleParameterChange(index, 'isSensitive', e.target.checked)
                          }
                        />
                      </td>
                      <td className='text-end pe-4'>
                        <button
                          type='button'
                          className='btn btn-icon btn-light-danger btn-sm'
                          onClick={() => removeParameter(index)}
                        >
                          <i className='fa fa-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {ruleAction.parameters.length === 0 && (
                    <tr>
                      <td colSpan='8' className='text-center text-muted py-4'>
                        No parameters added.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className='card-footer d-flex justify-content-end pad-10'>
          <button type='submit' className='btn btn-new btn-small' disabled={loading}>
            {!loading ? 'Save Rule Action' : 'Please wait...'}
          </button>
        </div>
      </form>
    </div>
  );
};

export { AddRuleAction };
