import React, {useState, useEffect, memo} from 'react'
import {fetchMasterData} from '../../../../../api/Api'
import {fetchRulesUpdateUrl, fetchRuleDetails} from '../../../../../api/ConfigurationApi'
import {fetchAlertFieldsUrl} from '../../../../../api/AlertFieldsApi'
import {uid} from './AddRule' // Assuming uid is available or defined here
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import Select from 'react-select'

const sel = 'form-select form-select-sm'
const inp = 'form-control form-control-sm'

const cs = {
  border: '1px solid #d1d5db',
  padding: '4px 6px',
  verticalAlign: 'middle',
  fontSize: 12,
}

const hs = {
  ...cs,
  background: '#dbeafe',
  fontWeight: 700,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  color: '#1e40af',
}

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: '30px',
    height: '30px',
    fontSize: '12px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: '30px',
    padding: '0 6px',
  }),
  input: (provided) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '30px',
  }),
  menu: (provided) => ({
    ...provided,
    fontSize: '12px',
    zIndex: 9999,
  }),
}

const EMPTY_CONDITION = () => ({
  tempKey: uid(),
  fieldTypeId: 0,
  operatorId: 0,
  value: '',
  order: 1,
  conditionJoinOperatorId: 0,
})

const EMPTY_GROUP = () => ({
    tempGroupKey: uid(),
    groupOperatorId: 1, // Default to AND, as it's no longer user-configurable at the group level
    conditions: [EMPTY_CONDITION()],
    groupJoinOperatorId: 0,
    subGroups: [],
  })

const RenderGroup = memo(({
  group,
  gIdx,
  sIdx = null,
  isSub = false,
  masterData,
  rule,
  addCondition,
  setGroupJoinOp,
  addSubGroup,
  removeGroup,
  setCondField,
  removeCondition,
  fields,
}) => {
  const activeKey = group.tempGroupKey

  const lastCond = group.conditions[group.conditions.length - 1]
  const isConditionJoinerSet = lastCond ? lastCond.conditionJoinOperatorId !== 0 : true

  const label = isSub
    ? `Sub Group ${gIdx + 1}.${sIdx + 1}`
    : `Group ${gIdx + 1}`

  return (
    <div
      className={`mb-1 p-1 rounded border ${
        isSub
          ? 'ms-1 border-primary bg-white'
          : 'bg-light border-gray-300'
      }`}
    >
      {/* Toolbar */}

      <div className='d-flex align-items-center gap-3 mb-4 flex-wrap'>
        <span className='fw-bold text-gray-800 me-2'>
          {label}
        </span>

        <button
          type='button'
          className='btn btn-sm btn-outline-info'
          disabled={!isConditionJoinerSet}
          onClick={() => addCondition(activeKey)}
        >
          <i className='fa fa-plus me-1' />
          Condition
        </button>

        <button
          type='button'
          className='btn btn-sm btn-outline-success'
          disabled={!isConditionJoinerSet}
          onClick={() => addSubGroup(activeKey)}
        >
          <i className='fa fa-folder-plus me-1' />
          Sub Group
        </button>

        {/* Joiner for top-level groups */}
        {!isSub && (
          <div className='d-flex align-items-center gap-2 border-start ps-3 ms-2'>
            <label className='small fw-bold mb-0 text-nowrap'>
              Logical Operator <span className='text-danger'>*</span>
            </label>
            <select
              className={`${sel} w-100px`}
              value={group.groupJoinOperatorId}
              onChange={e =>
                setGroupJoinOp(activeKey, e.target.value)
              }
            >
              <option value={0}>Select</option>
              {masterData.groupOperators.map(i => (
                <option key={i.dataID} value={i.dataID}>
                  {i.dataValue}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type='button'
          className='btn btn-sm btn-outline-danger ms-auto'
          disabled={!isSub && rule.groups.length === 1}
          onClick={() => removeGroup(activeKey)}
        >
          <i className='fa fa-trash' />
        </button>
      </div>

      {/* Table */}

      <table
        style={{borderCollapse: 'collapse', width: '100%'}}
        className='mb-4'
      >
        <thead>
          <tr>
            <th style={{...hs, width: '40%'}}>Field Name</th>
            <th style={{...hs, width: '20%'}}>Op</th>
            <th style={{...hs, width: '30%'}}>Value</th>
            <th style={{...hs, width: '15%'}}>Logical Operator <span className='text-danger'>*</span></th>
            <th style={{...hs, width: '10%'}}>Action</th>
          </tr>
        </thead>

        <tbody>
          {group.conditions.map((cond, cIdx) => (
            <tr key={cond.tempKey}>
              {/* Field */}
              <td style={cs}>
                <Select
                  options={fields.map((i) => ({value: i.fieldId, label: i.displayName}))}
                  value={
                    fields.find((i) => i.fieldId === cond.fieldTypeId)
                      ? {
                          value: cond.fieldTypeId,
                          label: fields.find((i) => i.fieldId === cond.fieldTypeId).displayName,
                        }
                      : null
                  }
                  onChange={(val) => setCondField(activeKey, cIdx, 'fieldTypeId', val ? Number(val.value) : 0)}
                  placeholder='Select Field'
                  isClearable
                  styles={customSelectStyles}
                />
              </td>

              {/* Operator */}
              <td style={cs}>
                <Select
                  options={masterData.operators.map((i) => ({value: i.dataID, label: i.dataValue}))}
                  value={
                    masterData.operators.find((i) => i.dataID === cond.operatorId)
                      ? {
                          value: cond.operatorId,
                          label: masterData.operators.find((i) => i.dataID === cond.operatorId)
                            .dataValue,
                        }
                      : null
                  }
                  onChange={(val) => setCondField(activeKey, cIdx, 'operatorId', val ? Number(val.value) : 0)}
                  placeholder='Op'
                  isClearable
                  styles={customSelectStyles}
                />
              </td>

              {/* Value */}
              <td style={cs}>
                <input className={inp} type='text' value={cond.value} placeholder='Enter Value'
                  onChange={e => setCondField(activeKey, cIdx, 'value', e.target.value)}
                />
              </td>

              {/* Condition Joiner */}
              <td style={cs}>
                <select
                  className={sel}
                  value={cond.conditionJoinOperatorId}
                  onChange={e =>
                    setCondField(
                      activeKey,
                      cIdx,
                      'conditionJoinOperatorId',
                      Number(e.target.value),
                    )
                  }
                >
                  <option value={0}>Select</option>
                  {masterData.groupOperators.map(i => (
                    <option key={i.dataID} value={i.dataID}>
                      {i.dataValue}
                    </option>
                  ))}
                </select>
              </td>

              {/* Delete */}
              <td style={{...cs, textAlign: 'center'}}>
                <button type='button' className='btn btn-sm btn-icon btn-light-danger'
                  disabled={group.conditions.length === 1 && (!group.subGroups || group.subGroups.length === 0)}
                  onClick={() => removeCondition(activeKey, cIdx)}
                >
                  <i className='fa fa-times' />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SubGroups */}
      {group.subGroups?.map((sub, ssIdx) => (
        <RenderGroup
          key={sub.tempGroupKey}
          group={sub}
          gIdx={gIdx}
          sIdx={ssIdx}
          isSub={true}
          masterData={masterData}
          rule={rule}
          addCondition={addCondition}
          setGroupJoinOp={setGroupJoinOp}
          addSubGroup={addSubGroup}
          removeGroup={removeGroup}
          setCondField={setCondField}
          removeCondition={removeCondition}
          fields={fields}
        />
      ))}
    </div>
  )
})

function UpdateRule() {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const userId = Number(sessionStorage.getItem('userId'))
  const navigate = useNavigate()
  const {id} = useParams()

  const [masterData, setMasterData] = useState({
    operators: [],
    groupOperators: [],
    severities: [],
    scenarios: [],
    priorities: [],
    fieldSourceTypes: [],
  })

  const [fields, setFields] = useState([])

  const [rule, setRule] = useState({
    ruleName: '',
    ruleCode: '',
    priority: 0,
    severityId: 0,
    scenarioId: 0,
    fieldSourceTypeId: 0,
    groups: [EMPTY_GROUP()],
    expressionText: '',
    orgId,
    toolId,
    userId,
    createdDate: '', // Will be set by API or fetched
  })

  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const [save, setSave] = useState(location.state?.save || '')
  useEffect(() => {
    setSave(location.state?.save || '')
  }, [location.state])

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [ops, gOps, sevs, scens, prio, sourceTypes] = await Promise.all([
          fetchMasterData({maserDataType: 'condition_operator', orgId, toolId}),
          fetchMasterData({maserDataType: 'logical_operator', orgId, toolId}),
          fetchMasterData({maserDataType: 'rule_severity', orgId, toolId}),
          fetchMasterData({maserDataType: 'rule_scenario', orgId, toolId}),
          fetchMasterData({maserDataType: 'rule_priority', orgId, toolId}),
          fetchMasterData({maserDataType: 'field_source_type', orgId, toolId}),
        ])
        setMasterData({
          operators: ops || [],
          groupOperators: gOps || [],
          severities: sevs || [],
          scenarios: scens || [],
          priorities: prio || [],
          fieldSourceTypes: sourceTypes || [],
        })
      } catch (error) {
        console.error('Error fetching rule detail master data:', error)
      }
    }
    loadMasterData()
  }, [orgId, toolId])

  // Helper to recursively add tempGroupKey for UI management
  const mapFetchedGroupToState = (group) => {
    const newGroup = {
      ...group,
      tempGroupKey: uid(), // Ensure unique keys for React
      groupOperatorId: group.groupOperatorId || 1, // Default to AND if not set
      groupJoinOperatorId: group.groupJoinOperatorId || 0, // Default to 0 for mandatory selection
    }
    if (newGroup.conditions) {
      newGroup.conditions = newGroup.conditions.map((cond) => ({
        ...cond,
        tempKey: uid(), // Use tempKey for conditions
        conditionJoinOperatorId: cond.conditionJoinOperatorId || 0, // Default to 0 for mandatory selection
      }))
    }
    if (newGroup.subGroups && newGroup.subGroups.length > 0) {
      newGroup.subGroups = newGroup.subGroups.map((sub) => mapFetchedGroupToState(sub))
    }
    return newGroup
  }

  useEffect(() => {
    const loadRuleDetails = async () => {
      if (id) {
        try {
          const data = await fetchRuleDetails({ruleID: Number(id)})
          if (data) {
            setRule((prev) => ({
              ...prev,
              ruleName: data.ruleName || '',
              ruleCode: data.ruleCode || '',
              priority: data.priority || 0,
              severityId: data.severityId || 0,
              scenarioId: data.scenarioId || 0, // Ensure scenarioId is correctly set
              fieldSourceTypeId: data.fieldSourceTypeId || 0,
              groups: (data.groups || []).map((group) => mapFetchedGroupToState(group)),
              expressionText: data.expressionText || '',
              createdDate: data.createdDate || new Date().toISOString(), // Keep original createdDate
            }))
          }
        } catch (error) {
          console.error('Error fetching rule details:', error)
          notifyFail('Failed to load rule details.')
        }
      }
    }
    loadRuleDetails()
  }, [id, orgId, toolId, userId, masterData]) // masterData dependency to ensure labels are ready for expression generation

  useEffect(() => {
    const fetchFields = async () => {
      if (rule.fieldSourceTypeId !== 0) {
        try {
          const response = await fetchAlertFieldsUrl({fieldSourceTypeId: rule.fieldSourceTypeId})
          setFields(response?.data || [])
        } catch (error) {
          console.error('Error fetching alert fields:', error)
        }
      } else {
        setFields([])
      }
    }
    fetchFields()
  }, [rule.fieldSourceTypeId])

  useEffect(() => {
    const exprForGroup = g => {
      const groupOpLabel = masterData.groupOperators.find(o => o.dataID === g.groupOperatorId)?.dataValue || 'AND'
      const items = []
      const conditionsToProcess = Array.isArray(g.conditions) ? g.conditions : [];
      const subGroupsToProcess = Array.isArray(g.subGroups) ? g.subGroups : [];

      // Collect conditions
      conditionsToProcess.forEach((c, i) => {
        const f = fields.find(x => x.fieldId === c.fieldTypeId)?.displayName || 'Field'
        const o = masterData.operators.find(x => x.dataID === c.operatorId)?.dataValue || 'Op'
        const str = `(${f} ${o} ${c.value || "''"})`
        const joiner = masterData.groupOperators.find(op => op.dataID === c.conditionJoinOperatorId)?.dataValue || 'AND'
        
        items.push({ str, joiner })
      })

      // Collect subGroups
      subGroupsToProcess.forEach(sub => {
        const str = exprForGroup(sub)
        if (str) {
          items.push({ str, joiner: groupOpLabel })
        }
      })

      // If no items, return empty string
      if (items.length === 0) return ''

      // Build flat string using the joiners
      let expr = ''
      items.forEach((item, i) => {
        expr += item.str
        if (i < items.length - 1) {
          expr += ` ${item.joiner} `
        }
      })

      return `(${expr})`
    }

    let finalExpr = ''
    const groupsToProcess = rule.groups || []
    groupsToProcess.forEach((g, i) => {
      const groupStr = exprForGroup(g)
      if (groupStr && groupStr !== '()') {
        finalExpr += groupStr
        if (i < groupsToProcess.length - 1) {
          const joiner = masterData.groupOperators.find(o => o.dataID === g.groupJoinOperatorId)?.dataValue || 'AND'
          finalExpr += ` ${joiner} `
        }
      }
    })

    setRule((prev) => ({...prev, expressionText: finalExpr}))
  }, [rule.groups, masterData, fields])

  const handleRuleChange = (field, value) => {
    setRule((prev) => ({...prev, [field]: value}))
  }

  const updateNestedGroup = (groups, key, callback) => {
    return groups.map((g) => {
      if (g.tempGroupKey === key) {
        return callback(g)
      }
      if (g.subGroups && g.subGroups.length > 0) {
        return {...g, subGroups: updateNestedGroup(g.subGroups, key, callback)}
      }
      return g
    })
  }

  const handleGroupChange = (groupKey, field, value) => {
    setRule((prev) => ({
      ...prev,
      groups: updateNestedGroup(prev.groups, groupKey, (g) => ({...g, [field]: value})),
    }))
  }

  const setGroupJoinOp = (key, v) =>
    setRule(p => ({
      ...p,
      groups: updateNestedGroup(p.groups, key, g => ({
        ...g,
        groupJoinOperatorId: Number(v),
      })),
    }))
  const setCondField = (groupKey, conditionIndex, field, value) => {
    setRule((prev) => ({
      ...prev,
      groups: updateNestedGroup(prev.groups, groupKey, (g) => {
        const newConds = [...g.conditions]
        newConds[conditionIndex] = {...newConds[conditionIndex], [field]: value}
        return {...g, conditions: newConds}
      }),
    }))
  }

  const addGroup = () => {
    setRule(p => ({...p, groups: [...p.groups, EMPTY_GROUP()]}))
  }

  const addCondition = (groupKey) => {
    setRule((prev) => ({
      ...prev,
      groups: updateNestedGroup(prev.groups, groupKey, (g) => ({
        ...g,
        conditions: [
          ...g.conditions,
          {
            fieldTypeId: 0,
            operatorId: 0,
            ...EMPTY_CONDITION(),
          },
        ],
      })),
    }))
  }

  const addSubGroup = (groupKey) => {
    setRule(p => ({...p, groups: updateNestedGroup(p.groups, groupKey, g => ({...g, subGroups: [...(g.subGroups || []), EMPTY_GROUP()]}))}))
  }

  const removeGroup = (groupKey) => {
    const filterGroups = (groups) => {
      return groups
        .filter((g) => g.tempGroupKey !== groupKey)
        .map((g) => ({
          ...g,
          subGroups: g.subGroups ? filterGroups(g.subGroups) : [],
        }))
    }
    setRule((prev) => ({
      ...prev,
      groups: filterGroups(prev.groups),
    }))
  }

  const removeCondition = (groupKey, conditionIndex) => {
    setRule((prev) => ({
      ...prev,
      groups: updateNestedGroup(prev.groups, groupKey, (g) => ({
        ...g,
        conditions: g.conditions.filter((_, idx) => idx !== conditionIndex),
      })),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate mandatory fields
    if (!rule.ruleName) {
      notifyFail('Rule Name is mandatory.')
      return
    }
    if (!rule.ruleCode) {
      notifyFail('Rule Code is mandatory.')
      return
    }
    if (rule.priority === 0) {
      notifyFail('Priority is mandatory.')
      return
    }
    if (rule.severityId === 0) {
      notifyFail('Severity is mandatory.')
      return
    }
    if (rule.scenarioId === 0) {
      notifyFail('Scenario is mandatory.')
      return
    }
    if (rule.fieldSourceTypeId === 0) {
      notifyFail('Field Source Type is mandatory.')
      return
    }

    // Validate Condition Groups (at least one group must exist)
    if (!rule.groups || rule.groups.length === 0) {
      notifyFail('At least one Condition Group is mandatory.')
      return
    }

    // Recursive validation for groups and conditions
    const validateGroupContent = (groups, isTopLevel = false) => {
      if (!groups || groups.length === 0) {
        return true; // An empty sub-group list is valid if no conditions are expected.
      }

      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        // Use tempGroupKey for more specific identification in nested groups
        const groupLabel = isTopLevel ? `Group ${i + 1}` : `Sub Group (Key: ${group.tempGroupKey.substring(0, 5)}...)`;

        // Check if group has any content (conditions or sub-groups)
        if ((!group.conditions || group.conditions.length === 0) && (!group.subGroups || group.subGroups.length === 0)) {
          notifyFail(`'${groupLabel}' must contain at least one condition or sub-group.`);
          return false;
        }

        // Validate conditions within the current group
        for (let j = 0; j < group.conditions.length; j++) {
          const cond = group.conditions[j];
          if (Number(cond.fieldTypeId) === 0) {
            notifyFail(`Please select a 'Field Name' for a condition in '${groupLabel}'.`);
            return false;
          }
          if (Number(cond.operatorId) === 0) {
            notifyFail(`Please select an 'Operator' for a condition in '${groupLabel}'.`);
            return false;
          }
          if (!cond.value || String(cond.value).trim() === '') { // Ensure value is not just whitespace
            notifyFail(`Please enter a 'Value' for a condition in '${groupLabel}'.`);
            return false;
          }
          // Validate condition logical operator if it's not the last condition in its list
          if (j < group.conditions.length - 1 && Number(cond.conditionJoinOperatorId) === 0) {
            notifyFail(`Please select a 'Logical Operator' for all conditions in '${groupLabel}'.`);
            return false;
          }
        }

        // Validate sub-groups recursively
        if (group.subGroups && group.subGroups.length > 0) {
          if (!validateGroupContent(group.subGroups, false)) { // Pass false for isTopLevel
            return false; // Propagate failure from sub-group
          }
        }

        // Validate group logical operator if it's not the last group in its level
        if (i < groups.length - 1 && Number(group.groupJoinOperatorId) === 0) {
          notifyFail(`Please select a 'Logical Operator' to join '${groupLabel}' with the next group.`);
          return false;
        }
      }
      return true;
    };

    if (!validateGroupContent(rule.groups, true)) { // Start validation from top-level groups
      return; // Validation failed, stop submission
    }

    try {
      const mapGroup = (group) => ({
        groupOperatorId: group.groupOperatorId,
        groupJoinOperatorId: group.groupJoinOperatorId,
        conditions: (group.conditions || []).map(c => ({fieldTypeId: c.fieldTypeId, operatorId: c.operatorId, conditionJoinOperatorId: c.conditionJoinOperatorId, value: c.value, order: c.order,})),
        subGroups: (group.subGroups || []).map((sub) => mapGroup(sub)),
      })
      const payload = {
        ruleId: Number(id),
        ruleName: rule.ruleName,
        ruleCode: rule.ruleCode,
        priority: rule.priority,
        severityId: rule.severityId,
        scenarioId: rule.scenarioId,
        fieldSourceTypeId: rule.fieldSourceTypeId,
        groups: rule.groups.map((group) => mapGroup(group)),
        expressionText: rule.expressionText,
        orgId: rule.orgId,
        toolId: rule.toolId,
        userId: rule.userId,
        modifiedDate: new Date().toISOString(),
      }
      const response = await fetchRulesUpdateUrl(payload)
      if (response.isSuccess) {
        notify(response.message || 'Rule added successfully')
        navigate('/qradar/rules-engine/list')
      } else {
        notifyFail(response.message || 'Failed to add rule')
      }
    } catch (error) {
      console.error('Error adding rule:', error)
      notifyFail('An unexpected error occurred')
    }
  }

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title align-items-start flex-column'>
          {save ? (
            <span className='white'>View Rule</span>
          ) : (
            <span className='white'>Update Rule</span>
          )}
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/rules-engine/list' className='white fs-15 text-underline'>
              <i className='fa fa-chevron-left white mg-right-5' />
              Back
            </Link>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='card mb-4'>
          <div className='card-body px-5 py-2'>
            <div className='row g-3'>
              <div className='col-md-4'>
                <div className='mb-3'>
                  <label className='form-label fw-bold small'>Rule Name <span className='text-danger'>*</span></label>
                  <input
                    className='form-control form-control-sm'
                    type='text'
                    value={rule.ruleName}
                    onChange={(e) => handleRuleChange('ruleName', e.target.value)}
                  />
                </div>
              </div>
              <div className='col-md-4'>
                <div className='mb-3'>
                  <label className='form-label fw-bold small'>Rule Code <span className='text-danger'>*</span></label>
                  <input
                    className='form-control form-control-sm'
                    type='text'
                    value={rule.ruleCode}
                    onChange={(e) => handleRuleChange('ruleCode', e.target.value)}
                  />
                </div>
              </div>
              <div className='col-md-4'>
                <div className='mb-3'>
                  <label className='form-label fw-bold small'>Priority <span className='text-danger'>*</span></label>
                  <select
                    className='form-select form-select-sm'
                    value={rule.priority}
                    onChange={(e) => handleRuleChange('priority', Number(e.target.value))}
                  >
                    <option value={0}>Select Priority</option>
                    {masterData.priorities.map((item) => (
                      <option key={item.dataID} value={item.dataID}>
                        {item.dataValue}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className='row g-3'>
              <div className='col-md-4'>
                <div className='mb-3'>
                  <label className='form-label fw-bold small'>Severity <span className='text-danger'>*</span></label>
                  <select
                    className='form-select form-select-sm'
                    value={rule.severityId}
                    onChange={(e) => handleRuleChange('severityId', Number(e.target.value))}
                  >
                    <option value={0}>Select Severity</option>
                    {masterData.severities.map((item) => (
                      <option key={item.dataID} value={item.dataID}>
                        {item.dataValue}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='col-md-4'>
                <div className='mb-3'>
                  <label className='form-label fw-bold small'>Scenario <span className='text-danger'>*</span></label>
                  <select
                    className='form-select form-select-sm'
                    value={rule.scenarioId}
                    onChange={(e) => handleRuleChange('scenarioId', Number(e.target.value))}
                  >
                    <option value={0}>Select Scenario</option>
                    {masterData.scenarios.map((item) => (
                      <option key={item.dataID} value={item.dataID}>
                        {item.dataValue}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='col-md-4'>
                <div className='mb-3'>
                  <label className='form-label fw-bold small'>Field Source Type <span className='text-danger'>*</span></label>
                  <select
                    className='form-select form-select-sm'
                    value={rule.fieldSourceTypeId}
                    onChange={(e) => handleRuleChange('fieldSourceTypeId', Number(e.target.value))}
                  >
                    <option value={0}>Select Source Type</option>
                    {masterData.fieldSourceTypes.map((item) => (
                      <option key={item.dataID} value={item.dataID}>
                        {item.dataValue}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='card-body px-5 py-2'>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <h5 className='mb-0'>Condition Groups</h5>
            <span className='text-danger'>*</span>
            <button
              type='button'
              className='btn btn-sm btn-primary'
              onClick={addGroup}
              disabled={
                rule.groups.length > 0 &&
                rule.groups[rule.groups.length - 1].groupJoinOperatorId === 0
              }
            >

              Add Group
            </button>
          </div>
            {rule.groups.map((group, gIdx) => (
              <RenderGroup
                key={group.tempGroupKey}
                group={group}
                gIdx={gIdx}
                masterData={masterData}
                rule={rule}
                addCondition={addCondition}
                setGroupJoinOp={setGroupJoinOp}
                addSubGroup={addSubGroup}
                removeGroup={removeGroup}
                setCondField={setCondField}
                removeCondition={removeCondition}
                fields={fields}
              />
            ))}
          </div>

        <div className='card mb-4'>
          <div className='card-body px-5 py-2'>
            <div className='mb-3'>
              <label className='form-label fw-bold small'>Expression Text</label>
              <textarea
                className='form-control form-control-sm'
                rows={6}
                style={{height: '200px'}} // Set a fixed height for better visibility
                value={rule.expressionText}
                onChange={(e) => handleRuleChange('expressionText', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className='text-end mt-2 me-5 mb-5 '>
          <button
            className='btn btn-primary'
            type='submit'
            style={{display: loading || save ? 'none' : 'inline-block'}}
          >
            Save Rule
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateRule
