import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { notify, notifyFail } from "../components/notification/Notification";
import { fetchMasterData } from "../../../../../api/Api";
import { fetchRules, fetchRuleActions } from "../../../../../api/ConfigurationApi";
import { useErrorBoundary } from "react-error-boundary";
import { fetchResolverAddUrl } from "../../../../../api/PlayBookConfigurationApi";

const AddResolver = () => {
  const orgId = Number(sessionStorage.getItem("orgId"));
  const toolId = Number(sessionStorage.getItem("toolID"));
  const userId = Number(sessionStorage.getItem("userId"));
  const handleError = useErrorBoundary();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [masterData, setMasterData] = useState({
    categories: [],
    severities: [],
    strategyTypes: [],
    logicalOperators: [],
    availableRules: [],
    availableRuleActions: [],
  });

  const [resolver, setResolver] = useState({
    resolverName: "",
    resolverCode: "",
    resolverDescription: "",
    platformId: 0,
    cloudProvideId: 0,
    categoryId: 0,
    severityId: 0,
    strategyTypeId: 0,
    priority: 0,
    rules: [],
    actions: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categories, severities, strategyTypes, logicalOperators, rulesRes, actionsRes] = await Promise.all([
          fetchMasterData({ maserDataType: "resolver_category", orgId, toolId }),
          fetchMasterData({ maserDataType: "resolver_severity", orgId, toolId }),
          fetchMasterData({ maserDataType: "resolver_strategy_type", orgId, toolId }),
          fetchMasterData({ maserDataType: "resolver_trigger_logical_operator", orgId, toolId }),
          fetchRules({ orgId, toolId }),
          fetchRuleActions({ orgId, toolId }),
        ]);

        setMasterData({
          categories: categories || [],
          severities: severities || [],
          strategyTypes: strategyTypes || [],
          logicalOperators: logicalOperators || [],
          availableRules: Array.isArray(rulesRes?.data) ? rulesRes.data : [],
          availableRuleActions: Array.isArray(actionsRes?.data) ? actionsRes.data : [],
        });
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [orgId, toolId]);

  const handleFieldChange = (field, value) => {
    setResolver((prev) => ({ ...prev, [field]: value }));
  };

  const addRule = () => {
    setResolver((prev) => ({
      ...prev,
      rules: [
        ...prev.rules,
        { ruleId: 0, logicalOperatorId: 0, evaluationOrder: prev.rules.length + 1, stopOnFailure: 0 },
      ],
    }));
  };

  const addAction = () => {
    setResolver((prev) => ({
      ...prev,
      actions: [
        ...prev.actions,
        { actionId: 0, executionOrder: prev.actions.length + 1, continueOnFailure: 0, advancedPayloadJson: "" },
      ],
    }));
  };

  const handleListItemChange = (listType, index, field, value) => {
    const updatedList = [...resolver[listType]];
    updatedList[index][field] = value;
    setResolver((prev) => ({ ...prev, [listType]: updatedList }));
  };

  const removeItem = (listType, index) => {
    setResolver((prev) => ({
      ...prev,
      [listType]: prev[listType].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resolver.resolverName || !resolver.resolverCode || Number(resolver.categoryId) === 0) {
      notifyFail("Please fill mandatory fields: Name, Code, and Category");
      return;
    }

    setLoading(true);
    const payload = {
      ...resolver,
      platformId: Number(resolver.platformId),
      cloudProvideId: Number(resolver.cloudProvideId),
      categoryId: Number(resolver.categoryId),
      severityId: Number(resolver.severityId),
      strategyTypeId: Number(resolver.strategyTypeId),
      priority: Number(resolver.priority),
      userId: userId,
      rules: resolver.rules.map((r) => ({
        ...r,
        ruleId: Number(r.ruleId),
        logicalOperatorId: Number(r.logicalOperatorId),
        evaluationOrder: Number(r.evaluationOrder),
        stopOnFailure: Number(r.stopOnFailure),
      })),
      actions: resolver.actions.map((a) => ({
        ...a,
        actionId: Number(a.actionId),
        executionOrder: Number(a.executionOrder),
        continueOnFailure: Number(a.continueOnFailure),
      })),
    };

    try {
      const response = await fetchResolverAddUrl(payload);
      if (response.isSuccess) {
        notify("Resolver Saved Successfully");
        navigate("/qradar/resolver/list");
      } else {
        notifyFail(response.message || "Failed to save Resolver");
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
        <h3 className="card-title">
          <span className="white">Add New Resolver</span>
        </h3>
        <div className="card-toolbar">
          <Link to="/qradar/resolver/list" className="white fs-15 text-underline">
            <i className="fa fa-chevron-left white mg-right-5" /> Back
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-body pad-10">
          <div className="row mb-8">
            <div className="col-md-4 mb-2">
              <label className="form-label fw-bold small">Resolver Name <span className="text-danger">*</span></label>
              <input type="text" className="form-control form-control-sm" value={resolver.resolverName} onChange={(e) => handleFieldChange("resolverName", e.target.value)} placeholder="Name" />
            </div>
            <div className="col-md-4 mb-2">
              <label className="form-label fw-bold small">Resolver Code <span className="text-danger">*</span></label>
              <input type="text" className="form-control form-control-sm" value={resolver.resolverCode} onChange={(e) => handleFieldChange("resolverCode", e.target.value)} placeholder="Code" />
            </div>
            <div className="col-md-4 mb-2">
              <label className="form-label fw-bold small">Category <span className="text-danger">*</span></label>
              <select className="form-select form-select-sm" value={resolver.categoryId} onChange={(e) => handleFieldChange("categoryId", e.target.value)}>
                <option value={0}>Select Category</option>
                {masterData.categories.map((item) => (
                  <option key={item.dataID} value={item.dataID}>{item.dataValue}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-2">
              <label className="form-label fw-bold small">Severity</label>
              <select className="form-select form-select-sm" value={resolver.severityId} onChange={(e) => handleFieldChange("severityId", e.target.value)}>
                <option value={0}>Select Severity</option>
                {masterData.severities.map((item) => (
                  <option key={item.dataID} value={item.dataID}>{item.dataValue}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-2">
              <label className="form-label fw-bold small">Strategy Type</label>
              <select className="form-select form-select-sm" value={resolver.strategyTypeId} onChange={(e) => handleFieldChange("strategyTypeId", e.target.value)}>
                <option value={0}>Select Strategy</option>
                {masterData.strategyTypes.map((item) => (
                  <option key={item.dataID} value={item.dataID}>{item.dataValue}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-2">
              <label className="form-label fw-bold small">Priority</label>
              <input type="number" className="form-control form-control-sm" value={resolver.priority} onChange={(e) => handleFieldChange("priority", e.target.value)} />
            </div>
            <div className="col-md-12 mb-2">
              <label className="form-label fw-bold small">Description</label>
              <textarea className="form-control form-control-sm" rows="3" value={resolver.resolverDescription} onChange={(e) => handleFieldChange("resolverDescription", e.target.value)} placeholder="Description" />
            </div>
          </div>

          {/* Rules Section */}
          <div className="border-top pt-5">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Associated Rules</h5>
              <button type="button" className="btn btn-sm btn-primary" onClick={addRule}>
                <i className="fa fa-plus me-2"></i> Add Rule
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-row-dashed align-middle gs-0 gy-3">
                <thead>
                  <tr className="fw-bold text-muted bg-light">
                    <th className="ps-4 min-w-200px">Rule</th>
                    <th className="min-w-150px">Logical Operator</th>
                    <th className="min-w-80px">Order</th>
                    <th className="min-w-100px text-center">Stop on Failure</th>
                    <th className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {resolver.rules.map((rule, idx) => (
                    <tr key={idx}>
                      <td>
                        <select className="form-select form-select-sm" value={rule.ruleId} onChange={(e) => handleListItemChange("rules", idx, "ruleId", e.target.value)}>
                          <option value={0}>Select Rule</option>
                          {masterData.availableRules.map((r) => (
                            <option key={r.ruleId} value={r.ruleId}>{r.ruleName}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select className="form-select form-select-sm" value={rule.logicalOperatorId} onChange={(e) => handleListItemChange("rules", idx, "logicalOperatorId", e.target.value)}>
                          <option value={0}>Select Operator</option>
                          {masterData.logicalOperators.map((op) => (
                            <option key={op.dataID} value={op.dataID}>{op.dataValue}</option>
                          ))}
                        </select>
                      </td>
                      <td><input type="number" className="form-control form-control-sm" value={rule.evaluationOrder} onChange={(e) => handleListItemChange("rules", idx, "evaluationOrder", e.target.value)} /></td>
                      <td className="text-center"><input type="checkbox" className="form-check-input" checked={rule.stopOnFailure === 1} onChange={(e) => handleListItemChange("rules", idx, "stopOnFailure", e.target.checked ? 1 : 0)} /></td>
                      <td className="text-end pe-4"><button type="button" className="btn btn-icon btn-light-danger btn-sm" onClick={() => removeItem("rules", idx)}><i className="fa fa-times"></i></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions Section */}
          <div className="border-top pt-5 mt-5">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Associated Actions</h5>
              <button type="button" className="btn btn-sm btn-primary" onClick={addAction}>
                <i className="fa fa-plus me-2"></i> Add Action
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-row-dashed align-middle gs-0 gy-3">
                <thead>
                  <tr className="fw-bold text-muted bg-light">
                    <th className="ps-4 min-w-200px">Action</th>
                    <th className="min-w-80px">Order</th>
                    <th className="min-w-100px text-center">Cont. on Failure</th>
                    <th className="min-w-200px">Payload (JSON)</th>
                    <th className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {resolver.actions.map((action, idx) => (
                    <tr key={idx}>
                      <td>
                        <select className="form-select form-select-sm" value={action.actionId} onChange={(e) => handleListItemChange("actions", idx, "actionId", e.target.value)}>
                          <option value={0}>Select Action</option>
                          {masterData.availableRuleActions.map((ra) => (
                            <option key={ra.actionId} value={ra.actionId}>{ra.actionName}</option>
                          ))}
                        </select>
                      </td>
                      <td><input type="number" className="form-control form-control-sm" value={action.executionOrder} onChange={(e) => handleListItemChange("actions", idx, "executionOrder", e.target.value)} /></td>
                      <td className="text-center"><input type="checkbox" className="form-check-input" checked={action.continueOnFailure === 1} onChange={(e) => handleListItemChange("actions", idx, "continueOnFailure", e.target.checked ? 1 : 0)} /></td>
                      <td><textarea className="form-control form-control-sm" rows="1" value={action.advancedPayloadJson} onChange={(e) => handleListItemChange("actions", idx, "advancedPayloadJson", e.target.value)} placeholder='{"key": "value"}' /></td>
                      <td className="text-end pe-4"><button type="button" className="btn btn-icon btn-light-danger btn-sm" onClick={() => removeItem("actions", idx)}><i className="fa fa-times"></i></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end pad-10">
          <button type="submit" className="btn btn-new btn-small" disabled={loading}>
            {!loading ? "Save Resolver" : "Please wait..."}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddResolver;