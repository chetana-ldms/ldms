import React, {useState, useEffect, memo} from 'react'
import {fetchMasterData} from '../../../../../api/Api'
import {fetchRulesAddUrl} from '../../../../../api/ConfigurationApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import {Link, useNavigate} from 'react-router-dom'

export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

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

/* ───────────────────────────────────────────── */
/* Render Group Component */
/* ───────────────────────────────────────────── */

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
                <select
                  className={sel}
                  value={cond.fieldTypeId}
                  onChange={e =>
                    setCondField(
                      activeKey,
                      cIdx,
                      'fieldTypeId',
                      Number(e.target.value),
                    )
                  }
                >
                  <option value={0}>Select Field</option>

                  {masterData.fieldTypes.map(i => (
                    <option key={i.dataID} value={i.dataID}>
                      {i.dataValue}
                    </option>
                  ))}
                </select>
              </td>

              {/* Operator */}

              <td style={cs}>
                <select
                  className={sel}
                  value={cond.operatorId}
                  onChange={e =>
                    setCondField(
                      activeKey,
                      cIdx,
                      'operatorId',
                      Number(e.target.value),
                    )
                  }
                >
                  <option value={0}>Op</option>

                  {masterData.operators.map(i => (
                    <option key={i.dataID} value={i.dataID}>
                      {i.dataValue}
                    </option>
                  ))}
                </select>
              </td>

              {/* Value */}

              <td style={cs}>
                <input
                  className={inp}
                  type='text'
                  value={cond.value}
                  placeholder='Enter Value'
                  onChange={e =>
                    setCondField(
                      activeKey,
                      cIdx,
                      'value',
                      e.target.value,
                    )
                  }
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

                <button
                  type='button'
                  className='btn btn-sm btn-icon btn-light-danger'
                  disabled={
                    group.conditions.length === 1 &&
                    (!group.subGroups ||
                      group.subGroups.length === 0)
                  }
                  onClick={() =>
                    removeCondition(activeKey, cIdx)
                  }
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
        />
      ))}
    </div>
  )
})

/* ───────────────────────────────────────────── */
/* Main Component */
/* ───────────────────────────────────────────── */

function AddRule() {

  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const userId = Number(sessionStorage.getItem('userId'))

  const navigate = useNavigate()

  const [masterData, setMasterData] = useState({
    operators: [],
    groupOperators: [],
    fieldTypes: [],
    severities: [],
    scenarios: [],
    priorities: [],
  })

  const [expressionText, setExpressionText] = useState('')

  const [rule, setRule] = useState({
    ruleName: '',
    ruleCode: '',
    priority: 0,
    severityId: 0,
    scenarioId: 0,
    groups: [EMPTY_GROUP()],
    orgId,
    toolId,
    userId,
    createdDate: new Date().toISOString(),
  })

  const handleRuleChange = (field, value) => {
    setRule((prev) => ({...prev, [field]: value}))
  }


  /* Load Master Data */

  useEffect(() => {

    const load = async () => {

      try {

        const [
          ops,
          gOps,
          fTypes,
          sevs,
          scens,
          prio,
        ] = await Promise.all([
          fetchMasterData({
            maserDataType: 'rule_operator',
            orgId,
            toolId,
          }),

          fetchMasterData({
            maserDataType: 'rule_group_operator',
            orgId,
            toolId,
          }),

          fetchMasterData({
            maserDataType: 'rule_field_type',
            orgId,
            toolId,
          }),

          fetchMasterData({
            maserDataType: 'rule_severity',
            orgId,
            toolId,
          }),

          fetchMasterData({
            maserDataType: 'rule_scenario',
            orgId,
            toolId,
          }),

          fetchMasterData({
            maserDataType: 'rule_priority',
            orgId,
            toolId,
          }),
        ])

        setMasterData({
          operators: ops || [],
          groupOperators: gOps || [],
          fieldTypes: fTypes || [],
          severities: sevs || [],
          scenarios: scens || [],
          priorities: prio || [],
        })

      } catch (e) {
        console.error(e)
      }
    }

    load()

  }, [orgId, toolId])

  /* Expression */

  useEffect(() => {

    const exprForGroup = g => {
      const groupOpLabel = masterData.groupOperators.find(o => o.dataID === g.groupOperatorId)?.dataValue || 'AND'
      const items = []
      const conditionsToProcess = Array.isArray(g.conditions) ? g.conditions : [];
      const subGroupsToProcess = Array.isArray(g.subGroups) ? g.subGroups : [];

      // Collect conditions
      conditionsToProcess.forEach((c, i) => {
        const f = masterData.fieldTypes.find(x => x.dataID === c.fieldTypeId)?.dataValue || 'Field'
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

    // Join top-level groups using their individual joiners
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

    setExpressionText(finalExpr)

  }, [rule.groups, masterData])

  /* Helpers */

  const updateTree = (groups, key, fn) =>
    groups.map(g =>
      g.tempGroupKey === key
        ? fn(g)
        : {
            ...g,
            subGroups: updateTree(
              g.subGroups || [],
              key,
              fn,
            ),
          },
    )

  const removeFromTree = (groups, key) =>
    groups
      .filter(g => g.tempGroupKey !== key)
      .map(g => ({
        ...g,
        subGroups: removeFromTree(
          g.subGroups || [],
          key,
        ),
      }))

  const setGroups = fn =>
    setRule(p => ({
      ...p,
      groups: fn(p.groups),
    }))

  /* Actions */

  const addGroup = () =>
    setGroups(gs => [...gs, EMPTY_GROUP()])

  const removeGroup = key =>
    setGroups(gs => removeFromTree(gs, key))

  const setGroupOp = (key, v) =>
    setGroups(gs =>
      updateTree(gs, key, g => ({
        ...g,
        groupOperatorId: Number(v),
      })),
    )

  const setGroupJoinOp = (key, v) =>
    setGroups(gs =>
      updateTree(gs, key, g => ({
        ...g,
        groupJoinOperatorId: Number(v),
      })),
    )

  const addCondition = key =>
    setGroups(gs =>
      updateTree(gs, key, g => ({
        ...g,
        conditions: [
          ...g.conditions,
          EMPTY_CONDITION(),
        ],
      })),
    )

  const addSubGroup = key =>
    setGroups(gs =>
      updateTree(gs, key, g => ({
        ...g,
        subGroups: [
          ...(g.subGroups || []),
          EMPTY_GROUP(),
        ],
      })),
    )

  const removeCondition = (key, idx) =>
    setGroups(gs =>
      updateTree(gs, key, g => ({
        ...g,
        conditions: g.conditions.filter(
          (_, i) => i !== idx,
        ),
      })),
    )

  const setCondField = (
    key,
    idx,
    field,
    val,
  ) =>
    setGroups(gs =>
      updateTree(gs, key, g => {

        const c = [...g.conditions]

        c[idx] = {
          ...c[idx],
          [field]: val,
        }

        return {...g, conditions: c}
      }),
    )

  /* Submit */

  const mapGroup = g => ({
    groupOperatorId: g.groupOperatorId,
    groupJoinOperatorId: g.groupJoinOperatorId,

    conditions: (g.conditions || []).map(c => ({
      fieldTypeId: c.fieldTypeId,
      operatorId: c.operatorId,
      conditionJoinOperatorId: c.conditionJoinOperatorId, // Include the new operator
      value: c.value,
      order: c.order,
    })),

    subGroups: (g.subGroups || []).map(s =>
      mapGroup(s),
    ),
  })

  const handleSubmit = async e => {

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

      const res = await fetchRulesAddUrl({
        ruleName: rule.ruleName,
        ruleCode: rule.ruleCode,
        priority: rule.priority,
        severityId: rule.severityId,
        scenarioId: rule.scenarioId,
        groups: rule.groups.map(mapGroup),
        expressionText,
        orgId,
        toolId,
        userId,
        createdDate: rule.createdDate,
      })

      if (res.isSuccess) {

        notify(res.message || 'Rule added')

        navigate('/qradar/rules-engine/list')

      } else {
        notifyFail(res.message || 'Failed')
      }

    } catch {
      notifyFail('Unexpected error')
    }
  }

  return (
    <div className='config card'>

      <ToastContainer />

      <div className='card-header bg-heading'>

        <h3 className='card-title'>
          <span className='white'>
            Add New Rule
          </span>
        </h3>

        <div className='card-toolbar'>

          <Link
            to='/qradar/rules-engine/list'
            className='white fs-15 text-underline'
          >
            <i className='fa fa-chevron-left white mg-right-5' />
            Back
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Rule Details */}
        <div className='card mb-4'>
          <div className='card-body px-5 py-2'>
            <div className='row g-3'>
              <div className='col-md-4'>
                <div className='mb-3'>
                  <label className='form-label fw-bold small'>Rule Name <span className='text-danger'>*</span></label>
                  <input
                    className='form-control form-control-sm'
                    type='text'
                    // Removed style={{height: 0}} as it makes the input invisible
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
                    // Removed style={{height: 0}} as it makes the input invisible
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
              <div className='col-md-6'>
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
              <div className='col-md-6'>
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
            </div>
          </div>
        </div>


        {/* Groups */}

        <div className='card mb-3'>
          <div className='card-body px-4 py-3'>
            <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3'>
              <div className='d-flex align-items-center gap-3'>
                <h5 className='mb-0'>Condition Groups</h5>
                <span className='text-danger'>*</span>
              </div>
              <button
                type='button'
                className='btn btn-sm btn-primary'
                disabled={rule.groups.length > 0 && rule.groups[rule.groups.length - 1].groupJoinOperatorId === 0}
                onClick={addGroup}
              >
                <i className='fa fa-plus me-2' />
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
              />
            ))}
          </div>
        </div>

        {/* Expression */}

        <div className='card mb-3'>

          <div className='card-body px-5 py-3'>

            <label className='form-label fw-bold small'>
              Expression Text
            </label>

            <textarea
              className='form-control form-control-sm'
              style={{height: '200px'}}
              value={expressionText}
              readOnly
            />
          </div>
        </div>

        <div className='text-end mt-2 me-5 mb-5'>

          <button
            className='btn btn-primary'
            type='submit'
          >
            Save Rule
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddRule