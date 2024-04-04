import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notify, notifyFail } from "../components/notification/Notification";
import axios from "axios";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import {
  fetchRuleCatagoriesUrl,
  fetchRulesAddUrl,
} from "../../../../../api/ConfigurationApi";
import { useErrorBoundary } from "react-error-boundary";

const AddRule = () => {
  const handleError = useErrorBoundary();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ruleCategories, setRuleCatagories] = useState([]);
  const [rulesconditiontypes, setRulesconditiontypes] = useState([]);
  const ruleName = useRef();
  const ruleCatagoryID = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const ruleCategoriesResponse = await fetchRuleCatagoriesUrl(
          "Rule_Catagories"
        );
        setRuleCatagories(ruleCategoriesResponse);

        const rulesConditionTypesResponse = await fetchRuleCatagoriesUrl(
          "Rules_Condition_Types"
        );
        setRulesconditiontypes(rulesConditionTypesResponse);

        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, []);

  // Dynamic Rules Starts
  const [formFields, setFormFields] = useState([
    {
      rulesConditionTypeID: "",
      ruleConditionValues: [{ rulesConditionValue: "" }],
    },
  ]);
  const addRule = () => {
    let object = {
      rulesConditionTypeID: "",
      ruleConditionValues: [{ rulesConditionValue: "" }],
    };
    setFormFields([...formFields, object]);
  };
  const handleRule = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  };
  const removeRule = (index) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };
  const addAction = (index) => {
    let actionobject = { rulesConditionValue: "" };
    let data = [...formFields];
    let afterPush = data[index]["ruleConditionValues"].concat(actionobject);
    data[index]["ruleConditionValues"] = afterPush;
    setFormFields(data);
  };
  const handleAction = (action_event, index, act_index) => {
    let data = [...formFields];
    data[index]["ruleConditionValues"][act_index][action_event.target.name] =
      action_event.target.value;
    setFormFields(data);
  };
  const removeAction = (act_index, index) => {
    let data = [...formFields];
    let newdata = data[index]["ruleConditionValues"];
    newdata.splice(act_index, 1);
    setFormFields(data);
  };
  // Dynamic Rules Ends
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const createdUserId = Number(sessionStorage.getItem("userId"));
    const orgId = Number(sessionStorage.getItem("orgId"));
    const createdDate = new Date().toISOString();
    var data = {
      ruleName: ruleName.current.value,
      ruleCatagoryID: ruleCatagoryID.current.value,
      ruleRunAttributeName: ruleName.current.value,
      orgId,
      createdDate,
      createdUserId,
      ruleConditions: formFields,
    };

    try {
      const responseData = await fetchRulesAddUrl(data);
      const { isSuccess } = responseData;

      if (isSuccess) {
        notify("Rule Saved");
        navigate("/qradar/rules-engine/updated");
      } else {
        notifyFail("Failed to save Rule");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      {loading && <UsersListLoading />}
      <div className="card-header bg-heading">
        <h3 className="card-title align-items-start flex-column">
          <span className="white">Add New Rule</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link
              to="/qradar/rules-engine/list"
              className="white fs-15 text-underline"
            >
              <i className="fa fa-chevron-left white mg-right-5" />
              Back
            </Link>
          </div>
        </div>
      </div>
      <div className="card-body no-pad mt-5">
        <div className="row mb-6 table-filter">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="fv-row mb-0">
              <label
                htmlFor="ruleName"
                className="form-label fs-6 fw-bolder mb-3"
              >
                Rule Name
              </label>
              <input
                type="text"
                className="form-control form-control-lg form-control-solid"
                placeholder="Ex: Detect IP"
                ref={ruleName}
              />
            </div>
          </div>
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="fv-row mb-0">
              <label
                htmlFor="ruleCatagoryID"
                className="form-label fs-6 fw-bolder mb-3"
              >
                Rule Category
              </label>
              <select
                className="form-select form-select-solid"
                data-kt-select2="true"
                data-placeholder="Select option"
                data-allow-clear="true"
                required
                ref={ruleCatagoryID}
              >
                <option>Select Rule Category</option>
                {ruleCategories.map((item, index) => (
                  <option value={item.masterdataid} key={index}>
                    {item.masterdatavalue}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-lg-12 mt-5 mb-lg-0 incident-box">
            <div className="fv-row mb-0">
              <label
                htmlFor="ruleCatagoryID"
                className="form-label fs-6 fw-bolder float-left"
              >
                Rule Conditions
              </label>
              <span
                className="btn btn-new btn-small float-right mb-5"
                onClick={addRule}
              >
                Add More Conditions
              </span>
              <div className="clearfix" />
              <form onSubmit={handleSubmit}>
                {formFields.map((form, index) => {
                  return (
                    <div key={index}>
                      <div className="card-body fv-row mb-0 card pad-10">
                        <div className="row mb-6">
                          <div className="col-lg-4 mb-4 mb-lg-0">
                            <label
                              htmlFor="rulesConditionTypeID"
                              className="form-label fs-6 fw-bolder mb-3"
                            >
                              Select Rule Categgory Type
                            </label>
                            <select
                              name="rulesConditionTypeID"
                              className="form-select form-select-solid"
                              data-kt-select2="true"
                              data-placeholder="Select option"
                              data-allow-clear="true"
                              required
                              onChange={(event) => handleRule(event, index)}
                            >
                              <option>Select Rule Category</option>
                              {rulesconditiontypes.map((item, rcindex) => (
                                <option
                                  name="rulesConditionCategory"
                                  value={item.masterdataid}
                                  key={rcindex}
                                >
                                  {item.masterdatavalue}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-lg-5 mb-4 mb-lg-0 condition-text">
                            <label
                              htmlFor="ruleCatagoryID"
                              className="form-label fs-6 fw-bolder mb-3 float-left"
                            >
                              Condition Text
                            </label>
                            <span
                              className="btn btn-warning btn-small float-right"
                              onClick={() => addAction(index)}
                            >
                              Add Field
                            </span>
                            <div className="clearfix" />
                            {form.ruleConditionValues.map((act, act_index) => {
                              return (
                                <div
                                  key={act_index}
                                  className="input-group mb-3"
                                >
                                  <input
                                    name="rulesConditionValue"
                                    type="text"
                                    className="form-control form-control-solid"
                                    id="rulesConditionValue"
                                    placeholder={`Suspicious IP`}
                                    onChange={(action_event) =>
                                      handleAction(
                                        action_event,
                                        index,
                                        act_index
                                      )
                                    }
                                  />
                                  <span
                                    onClick={() =>
                                      removeAction(act_index, index)
                                    }
                                    className="btn btn-danger btn-small"
                                  >
                                    Delete
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="col-lg-2 mb-4 mb-lg-0">
                            <label
                              htmlFor="ruleCatagoryID"
                              className="form-label fs-6 fw-bolder mb-3"
                            >
                              Action
                            </label>
                            <span
                              className="form-control btn btn-danger pull-right"
                              onClick={() => removeRule(index)}
                            >
                              Remove
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </form>
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
    </div>
  );
};

export { AddRule };
