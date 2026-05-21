import React, {useState, useEffect, useCallback} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import Select from 'react-select'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchMasterData} from '../../../../../api/Api'
import {fetchRules, fetchRuleActions} from '../../../../../api/ConfigurationApi'
import {useErrorBoundary} from 'react-error-boundary'
import {fetchResolverSearchUrl, fetchResolverUpdateUrl} from '../../../../../api/PlayBookConfigurationApi'
import { ToastContainer } from 'react-toastify'

const UpdateResolver = () => {
  const {id} = useParams()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const userId = Number(sessionStorage.getItem('userId'))
  const handleError = useErrorBoundary()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [masterData, setMasterData] = useState({
    categories: [],
    severities: [],
    strategyTypes: [],
    platforms: [],
    cloudProviders: [],
    priorities: [], // Added for resolver_priority
    logicalOperators: [],
    availableRules: [],
    availableRuleActions: [],
  })

  const [resolver, setResolver] = useState({
    resolverName: '',
    resolverCode: '',
    resolverDescription: '',
    platformId: 0,
    cloudProvideId: 0,
    categoryId: 0,
    severityId: 0,
    strategyTypeId: 0,
    autoExecute: 0, // Added field
    approvalRequired: 0, // Added field
    retryEnabled: 0, // Added field
    retryCount: 0, // Added field
    rollbackEnabled: 0, // Added field
    priority: 0,
    rules: [],
    actions: [],
    resolverId: 0, // Added resolverId for update operation
  })

  useEffect(() => {
     const loadData = async () => {
       try {
         setLoading(true)
         const [
           categories,
           severities,
           strategyTypes,
           priorities,
           platforms,
           cloudProviders,
           logicalOperators,
           rulesRes,
           actionsRes,
         ] = await Promise.all([
           fetchMasterData({maserDataType: 'resolver_category', orgId, toolId}),
           fetchMasterData({maserDataType: 'resolver_severity', orgId, toolId}),
           fetchMasterData({maserDataType: 'resolver_strategy_type', orgId, toolId}),
           fetchMasterData({maserDataType: 'resolver_priority', orgId, toolId}), // Fetch resolver_priority
           fetchMasterData({maserDataType: 'platform', orgId, toolId}),
           fetchMasterData({maserDataType: 'cloud_provider', orgId, toolId}),
           fetchMasterData({maserDataType: 'resolver_trigger_logical_operator', orgId, toolId}),
           fetchRules({orgId, toolId, active: true}), // Fetch active rules
           fetchRuleActions({orgId, toolId, active: true}), // Fetch active rule actions
         ])
 
         setMasterData({
           categories: categories || [],
           severities: severities || [],
           strategyTypes: strategyTypes || [],
           platforms: platforms || [],
           cloudProviders: cloudProviders || [],
           logicalOperators: logicalOperators || [],
           priorities: priorities || [], // Set priorities
           availableRules: Array.isArray(rulesRes?.data) ? rulesRes.data : [],
           availableRuleActions: Array.isArray(actionsRes?.data) ? actionsRes.data : [],
         })
       } catch (error) {
         handleError(error)
       } finally {
         setLoading(false)
       }
     }
     loadData()
   }, [orgId, toolId])

  useEffect(() => {
    const resolverId = Number(id)
    if (resolverId) {
      setLoading(true)
      fetchResolverSearchUrl({resolverId: resolverId})
        .then((response) => {
          if (response.isSuccess && response.data && response.data.length > 0) {
            const fetchedResolver = response.data[0]
            setResolver({
              resolverName: fetchedResolver.resolverName || '',
              resolverCode: fetchedResolver.resolverCode || '',
              resolverDescription: fetchedResolver.resolverDescription || '',
              platformId: fetchedResolver.platformId || 0,
              cloudProvideId: fetchedResolver.cloudProvideId || 0,
              categoryId: fetchedResolver.categoryId || 0,
              severityId: fetchedResolver.severityId || 0,
              strategyTypeId: fetchedResolver.strategyTypeId || 0,
              autoExecute: fetchedResolver.autoExecute || 0,
              approvalRequired: fetchedResolver.approvalRequired || 0,
              retryEnabled: fetchedResolver.retryEnabled || 0,
              retryCount: fetchedResolver.retryCount || 0,
              rollbackEnabled: fetchedResolver.rollbackEnabled || 0,
              priority: fetchedResolver.priority || 0,
              rules: fetchedResolver.rules || [],
              actions: fetchedResolver.actions || [],
              resolverId: fetchedResolver.resolverId,
            })
          } else {
            notifyFail(response.message || 'Failed to fetch resolver details.')
            navigate('/qradar/resolver/list')
          }
        })
        .catch(handleError)
        .finally(() => setLoading(false))
    }
  }, [id, navigate, handleError])

  const handleFieldChange = (field, value) => {
    setResolver((prev) => ({...prev, [field]: value}))
  }

  const addRule = () => {
    setResolver((prev) => ({
      ...prev,
      rules: [
        ...prev.rules,
        {
          ruleId: 0,
          logicalOperatorId: 0,
          evaluationOrder: prev.rules.length + 1,
          stopOnFailure: 0,
          resolverRuleId: 0,
        },
      ],
    }))
  }

  const addAction = () => {
    setResolver((prev) => ({
      ...prev,
      actions: [
        ...prev.actions,
        {
          actionId: 0,
          executionOrder: prev.actions.length + 1,
          continueOnFailure: 0,
          advancedPayloadJson: '',
          resolverActionId: 0,
        },
      ],
    }))
  }

  const handleListItemChange = (listType, index, field, value) => {
    const updatedList = [...resolver[listType]]
    updatedList[index][field] = value
    setResolver((prev) => ({...prev, [listType]: updatedList}))
  }

  const removeItem = (listType, index) => {
    setResolver((prev) => ({
      ...prev,
      [listType]: prev[listType].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const {
      resolverName,
      resolverCode,
      resolverDescription,
      platformId,
      cloudProvideId,
      categoryId,
      severityId,
      strategyTypeId,
      priority,
      retryCount,
      rules,
      actions,
    } = resolver

    if (
      !resolverName ||
      !resolverCode ||
      !resolverDescription ||
      Number(categoryId) === 0 ||
      Number(platformId) === 0 ||
      Number(cloudProvideId) === 0 ||
      Number(severityId) === 0 ||
      Number(strategyTypeId) === 0 ||
      Number(priority) === 0 ||
      (resolver.retryEnabled === 1 && Number(retryCount) === 0)
    ) {
      notifyFail('Please fill all mandatory fields.')
      return
    }

    if (rules.length === 0) {
      notifyFail('Please add at least one Associated Rule.')
      return
    }
    if (rules.some((r) => Number(r.ruleId) === 0 || Number(r.logicalOperatorId) === 0)) {
      notifyFail('Please ensure all fields for the added rules are selected.')
      return
    }

    if (actions.length === 0) {
      notifyFail('Please add at least one Associated Action.')
      return
    }
    if (actions.some((a) => Number(a.actionId) === 0)) {
      notifyFail('Please ensure all fields for the added actions are selected.')
      return
    }

    setLoading(true)
    const payload = {
      ...resolver,
      platformId: Number(resolver.platformId),
      cloudProvideId: Number(resolver.cloudProvideId),
      categoryId: Number(resolver.categoryId),
      severityId: Number(resolver.severityId),
      strategyTypeId: Number(resolver.strategyTypeId),
      autoExecute: Number(resolver.autoExecute), // Added to payload
      approvalRequired: Number(resolver.approvalRequired), // Added to payload
      resolverId: resolver.resolverId, // Include resolverId for update
      retryEnabled: Number(resolver.retryEnabled), // Added to payload
      retryCount: Number(resolver.retryCount), // Added to payload
      rollbackEnabled: Number(resolver.rollbackEnabled), // Added to payload
      priority: Number(resolver.priority),
      userId: userId,
      rules: resolver.rules.map((r) => ({
        ruleId: Number(r.ruleId),
        logicalOperatorId: Number(r.logicalOperatorId),
        evaluationOrder: Number(r.evaluationOrder),
        stopOnFailure: Number(r.stopOnFailure),
        resolverRuleId: Number(r.resolverRuleId || 0),
      })),
      actions: resolver.actions.map((a) => ({
        actionId: Number(a.actionId),
        executionOrder: Number(a.executionOrder),
        continueOnFailure: Number(a.continueOnFailure),
        advancedPayloadJson: a.advancedPayloadJson,
        resolverActionId: Number(a.resolverActionId || 0),
      })),
    }

    try {
      const response = await fetchResolverUpdateUrl(payload) // Changed to update API
      if (response.isSuccess) {
        notify('Resolver Saved Successfully')
        navigate('/qradar/resolver/list')
      } else {
        notifyFail(response.message || 'Failed to save Resolver')
      }
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: '31px',
      height: '31px',
      fontSize: '12px',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 6px',
    }),
    input: (base) => ({
      ...base,
      margin: '0',
      padding: '0',
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '31px',
    }),
    menu: (base) => ({
      ...base,
      fontSize: '12px',
      zIndex: 9999,
    }),
    menuPortal: (base) => ({...base, zIndex: 9999}),
  }

  return (
    <div className='config card'>
      <ToastContainer />
      {loading && <UsersListLoading />}
      <div className='card-header bg-heading'>
        <h3 className='card-title'>
          <span className='white'>Update Resolver</span>
        </h3>
        <div className='card-toolbar'>
          <Link to='/qradar/resolver/list' className='white fs-15 text-underline'>
            <i className='fa fa-chevron-left white mg-right-5' /> Back
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='card-body pad-10'>
          <div className='row mb-8'>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>
                Resolver Name <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-sm'
                value={resolver.resolverName}
                onChange={(e) => handleFieldChange('resolverName', e.target.value)}
                placeholder='Name'
              />
            </div>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>
                Resolver Code <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-sm'
                value={resolver.resolverCode}
                onChange={(e) => handleFieldChange('resolverCode', e.target.value)}
                placeholder='Code'
              />
            </div>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>
                Category <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                value={resolver.categoryId}
                onChange={(e) => handleFieldChange('categoryId', e.target.value)}
              >
                <option value={0}>Select Category</option>
                {masterData.categories.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>
                Platform <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                value={resolver.platformId}
                onChange={(e) => handleFieldChange('platformId', e.target.value)}
              >
                <option value={0}>Select Platform</option>
                {masterData.platforms.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>
                Cloud Provider <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                value={resolver.cloudProvideId}
                onChange={(e) => handleFieldChange('cloudProvideId', e.target.value)}
              >
                <option value={0}>Select Cloud Provider</option>
                {masterData.cloudProviders.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>Severity <span className='text-danger'>*</span></label>
              <select
                className='form-select form-select-sm'
                value={resolver.severityId}
                onChange={(e) => handleFieldChange('severityId', e.target.value)}
              >
                <option value={0}>Select Severity</option>
                {masterData.severities.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>Strategy Type <span className='text-danger'>*</span></label>
              <select
                className='form-select form-select-sm'
                value={resolver.strategyTypeId}
                onChange={(e) => handleFieldChange('strategyTypeId', e.target.value)}
              >
                <option value={0}>Select Strategy</option>
                {masterData.strategyTypes.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>
                Priority <span className='text-danger'>*</span>
              </label>
              <select
                className='form-select form-select-sm'
                value={resolver.priority}
                onChange={(e) => handleFieldChange('priority', e.target.value)}
              >
                <option value={0}>Select Priority</option>
                {masterData.priorities.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-4 mb-2'>
              <label className='form-label fw-bold small'>Retry Count <span className='text-danger'>*</span></label>
              <input
                type='number'
                className='form-control form-control-sm'
                value={resolver.retryCount}
                onChange={(e) => handleFieldChange('retryCount', e.target.value)}
              />
            </div>
            <div className='col-md-2 mb-2 d-flex align-items-center'>
              <div className='form-check form-check-solid mt-3'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  checked={resolver.autoExecute === 1}
                  onChange={(e) => handleFieldChange('autoExecute', e.target.checked ? 1 : 0)}
                />
                <label className='form-label fw-bold small'>Auto Execute</label>
              </div>
            </div>
            <div className='col-md-2 mb-2 d-flex align-items-center'>
              <div className='form-check form-check-solid mt-3'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  checked={resolver.approvalRequired === 1}
                  onChange={(e) => handleFieldChange('approvalRequired', e.target.checked ? 1 : 0)}
                />
                <label className='form-label fw-bold small'>Approval Required</label>
              </div>
            </div>
            <div className='col-md-2 mb-2 d-flex align-items-center'>
              <div className='form-check form-check-solid mt-3'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  checked={resolver.retryEnabled === 1}
                  onChange={(e) => handleFieldChange('retryEnabled', e.target.checked ? 1 : 0)}
                />
                <label className='form-label fw-bold small'>Retry Enabled</label>
              </div>
            </div>
            <div className='col-md-2 mb-2 d-flex align-items-center'>
              <div className='form-check form-check-solid mt-3'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  checked={resolver.rollbackEnabled === 1}
                  onChange={(e) => handleFieldChange('rollbackEnabled', e.target.checked ? 1 : 0)}
                />

                <label className='form-label fw-bold small'>Rollback Enabled</label>
              </div>
            </div>

            <div className='col-md-12 mb-2'>
              <label className='form-label fw-bold small'>Description <span className='text-danger'>*</span></label>
              <textarea
                className='form-control form-control-sm'
                rows='3'
                value={resolver.resolverDescription}
                onChange={(e) => handleFieldChange('resolverDescription', e.target.value)}
                placeholder='Description'
              />
            </div>
          </div>

          {/* Rules Section */}
          <div className='border-top pt-5'>
            <div className='d-flex justify-content-between align-items-center mb-2'>
              <h5 className='mb-0'>Associated Rules</h5>
              <button type='button' className='btn btn-sm btn-primary' onClick={addRule}>
                <i className='fa fa-plus me-2'></i> Add Rule
              </button>
            </div>
            <div className='table-responsive'>
              <table className='table table-row-dashed align-middle gs-0 gy-3'>
                <thead>
                  <tr className='fw-bold text-muted bg-light'>
                    <th className='ps-4 min-w-200px'>Rule</th>
                    <th className='min-w-150px'>Logical Operator</th>
                    <th className='min-w-80px'>Order</th>
                    <th className='min-w-100px text-center'>Stop on Failure</th>
                    <th className='text-end pe-4'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {resolver.rules.map((rule, idx) => (
                    <tr key={idx}>
                      <td>
                        <Select
                          options={masterData.availableRules.map((r) => ({
                            value: r.ruleId,
                            label: r.ruleName,
                          }))}
                          value={
                            rule.ruleId !== 0
                              ? {
                                  value: rule.ruleId,
                                  label: masterData.availableRules.find((r) => r.ruleId === rule.ruleId)
                                    ?.ruleName,
                                }
                              : null
                          }
                          onChange={(val) =>
                            handleListItemChange('rules', idx, 'ruleId', val ? val.value : 0)
                          }
                          menuPortalTarget={document.body}
                          placeholder='Select Rule'
                          styles={selectStyles}
                        />
                      </td>
                      <td>
                        <select
                          className='form-select form-select-sm'
                          value={rule.logicalOperatorId}
                          onChange={(e) =>
                            handleListItemChange('rules', idx, 'logicalOperatorId', e.target.value)
                          }
                        >
                          <option value={0}>Select Operator</option>
                          {masterData.logicalOperators.map((op) => (
                            <option key={op.dataID} value={op.dataID}>
                              {op.dataValue}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type='number'
                          className='form-control form-control-sm'
                          value={rule.evaluationOrder}
                          onChange={(e) =>
                            handleListItemChange('rules', idx, 'evaluationOrder', e.target.value)
                          }
                        />
                      </td>
                      <td className='text-center'>
                        <input
                          type='checkbox'
                          className='form-check-input'
                          checked={rule.stopOnFailure === 1}
                          onChange={(e) =>
                            handleListItemChange(
                              'rules',
                              idx,
                              'stopOnFailure',
                              e.target.checked ? 1 : 0
                            )
                          }
                        />
                      </td>
                      <td className='text-end pe-4'>
                        <button
                          type='button'
                          className='btn btn-icon btn-light-danger btn-sm'
                          onClick={() => removeItem('rules', idx)}
                        >
                          <i className='fa fa-times'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions Section */}
          <div className='border-top pt-5 mt-5'>
            <div className='d-flex justify-content-between align-items-center mb-2'>
              <h5 className='mb-0'>Associated Actions</h5>
              <button type='button' className='btn btn-sm btn-primary' onClick={addAction}>
                <i className='fa fa-plus me-2'></i> Add Action
              </button>
            </div>
            <div className='table-responsive'>
              <table className='table table-row-dashed align-middle gs-0 gy-3'>
                <thead>
                  <tr className='fw-bold text-muted bg-light'>
                    <th className='ps-4 min-w-200px'>Action</th>
                    <th className='min-w-80px'>Order</th>
                    <th className='min-w-100px text-center'>Cont. on Failure</th>
                    <th className='min-w-200px'>Payload (JSON)</th>
                    <th className='text-end pe-4'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {resolver.actions.map((action, idx) => (
                    <tr key={idx}>
                      <td>
                        <Select
                          options={masterData.availableRuleActions.map((ra) => ({
                            value: ra.actionId,
                            label: ra.actionName,
                          }))}
                          value={
                            action.actionId !== 0
                              ? {
                                  value: action.actionId,
                                  label: masterData.availableRuleActions.find(
                                    (ra) => ra.actionId === action.actionId
                                  )?.actionName,
                                }
                              : null
                          }
                          onChange={(val) =>
                            handleListItemChange('actions', idx, 'actionId', val ? val.value : 0)
                          }
                          menuPortalTarget={document.body}
                          placeholder='Select Action'
                          styles={selectStyles}
                        />
                      </td>
                      <td>
                        <input
                          type='number'
                          className='form-control form-control-sm'
                          value={action.executionOrder}
                          onChange={(e) =>
                            handleListItemChange('actions', idx, 'executionOrder', e.target.value)
                          }
                        />
                      </td>
                      <td className='text-center'>
                        <input
                          type='checkbox'
                          className='form-check-input'
                          checked={action.continueOnFailure === 1}
                          onChange={(e) =>
                            handleListItemChange(
                              'actions',
                              idx,
                              'continueOnFailure',
                              e.target.checked ? 1 : 0
                            )
                          }
                        />
                      </td>
                      <td>
                        <textarea
                          className='form-control form-control-sm'
                          rows='1'
                          value={action.advancedPayloadJson}
                          onChange={(e) =>
                            handleListItemChange(
                              'actions',
                              idx,
                              'advancedPayloadJson',
                              e.target.value
                            )
                          }
                          placeholder='{"key": "value"}'
                        />
                      </td>
                      <td className='text-end pe-4'>
                        <button
                          type='button'
                          className='btn btn-icon btn-light-danger btn-sm'
                          onClick={() => removeItem('actions', idx)}
                        >
                          <i className='fa fa-times'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className='card-footer d-flex justify-content-end pad-10'>
          <button type='submit' className='btn btn-new btn-small' disabled={loading}>
            {!loading ? 'Save Resolver' : 'Please wait...'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateResolver
