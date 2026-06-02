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
import RuleActionConfigurationModal from './RuleActionConfigurationModal'; // Import the new component
import { ToastContainer } from "react-toastify";

const AddRuleAction = () => {
  const orgId = Number(sessionStorage.getItem("orgId"));
  const toolIds = Number(sessionStorage.getItem("toolID"));
  const handleError = useErrorBoundary();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    configuration: "",
    parameters: [],
  });

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [actionTypes, executorTypes, dataTypes] = await Promise.all([
          fetchMasterData({ maserDataType: "action_type", orgId, toolId: toolIds }),
          fetchMasterData({ maserDataType: "executor_type", orgId, toolId: toolIds }),
          fetchMasterData({ maserDataType: "global_data_type", orgId, toolId: toolIds }),
        ]);
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
          parameterId: 0,
          parameterCode: "",
          parameterName: "",
          dataTypeId: 0,
          isRequired: false,
          defaultValue: "",
          validationRulesJson: "",
          displayOrder: prev.parameters.length + 1,
          isSensitive: false,
          isDeleted: false,
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
    if (
      !ruleAction.actionName ||
      !ruleAction.actionCode ||
      Number(ruleAction.actionTypeId) === 0 ||
      Number(ruleAction.executorTypeId) === 0
    ) {
      notifyFail("Please fill all mandatory fields: Name, Code, Type, and Executor");
      return;
    }

    if (ruleAction.parameters.length === 0) {
      notifyFail("Please add at least one Parameter.");
      return;
    }
    if (ruleAction.parameters.some((p) => !p.parameterCode || !p.parameterName || Number(p.dataTypeId) === 0)) {
      notifyFail("Please ensure all fields (Code, Name, and Data Type) for added parameters are filled.");
      return;
    }

    setLoading(true);
    const payload = {
      actionId: 0,
      actionName: ruleAction.actionName,
      actionCode: ruleAction.actionCode,
      executorTypeId: Number(ruleAction.executorTypeId),
      toolId: 0,
      userId: Number(sessionStorage.getItem("userId")),
      // configuration: ruleAction.configuration,
      parameters: ruleAction.parameters.map((param) => ({
        parameterId: param.parameterId || 0,
        parameterCode: param.parameterCode,
        parameterName: param.parameterName,
        dataTypeId: Number(param.dataTypeId),
        isRequired: param.isRequired,
        defaultValue: param.defaultValue,
        validationRulesJson: param.validationRulesJson,
        displayOrder: Number(param.displayOrder),
        isSensitive: param.isSensitive,
        isDeleted: param.isDeleted || false,
      })),
      actionTypeId: Number(ruleAction.actionTypeId),
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

  const handleSaveConfig = (newConfig) => {
    handleRuleChange('configuration', newConfig);
    setIsConfigModalOpen(false);
  };

  return (
    <div className="config card">
       <ToastContainer />
      {loading && <UsersListLoading />}
      <div className="card-header bg-heading">
        <h3 className="card-title align-items-start flex-column">
          <span className="white">Add New Action</span>
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
              <label className='form-label fw-bold small'>Action Name <span className='text-danger'>*</span></label>
              <input
                type='text'
                className='form-control form-control-sm'
                value={ruleAction.actionName}
                onChange={(e) => handleRuleChange('actionName', e.target.value)}
                placeholder='Action Name'
              />
            </div>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>Action Code <span className='text-danger'>*</span></label>
              <input
                type='text'
                className='form-control form-control-sm'
                value={ruleAction.actionCode}
                onChange={(e) => handleRuleChange('actionCode', e.target.value)}
                placeholder='Action Code'
              />
            </div>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>Action Type <span className='text-danger'>*</span></label>
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
              <label className='form-label fw-bold small'>Executor Type <span className='text-danger'>*</span></label>
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
            <div className='col-md-12 mb-2'>
              <label className='form-label fw-bold small'>Configuration (JSON string)</label>
              <div className="input-group">
                <textarea
                  className='form-control form-control-sm'
                  rows='3'
                  style={{height: 100}}
                  value={ruleAction.configuration}
                  onChange={(e) => handleRuleChange('configuration', e.target.value)}
                  placeholder='{"key": "value"}'
                />
                <div className="input-group-append d-flex flex-column gap-1 ms-2">
                   <button 
                    type="button" 
                    className="btn btn-sm btn-icon btn-light-primary" 
                    onClick={() => setIsConfigModalOpen(true)}
                    title="Add/Edit Configuration"
                   >
                     <i className="fa fa-plus" />
                   </button>
                   <button 
                    type="button" 
                    className="btn btn-sm btn-icon btn-light-danger" 
                    onClick={() => handleRuleChange('configuration', '')}
                    title="Remove Configuration"
                   >
                     <i className="fa fa-trash" />
                   </button>
                </div>
              </div>
            </div>
          </div>

          <div className='border-top pt-5'>
            <div className='d-flex justify-content-between align-items-center mb-2'>
              <h5 className='mb-0'>Parameters <span className='text-danger'>*</span></h5>
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
                           <i className='fa fa-times' />
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
            {!loading ? 'Save' : 'Please wait...'}
          </button>
        </div>
      </form>

      <RuleActionConfigurationModal
        show={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        currentConfiguration={ruleAction.configuration}
        onSave={handleSaveConfig}
      />
    </div>
  );
};

export { AddRuleAction };
