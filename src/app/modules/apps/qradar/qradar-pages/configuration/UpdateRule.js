import React, {useState, useEffect} from 'react'
import {fetchMasterData} from '../../../../../api/Api'
import {fetchRulesUpdateUrl, fetchRuleDetails} from '../../../../../api/ConfigurationApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {useParams} from 'react-router-dom'

function UpdateRule() {
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

  const [rule, setRule] = useState({
    ruleName: '',
    ruleCode: '',
    priority: 0,
    severityId: 0,
    scenarioId: 0,
    groups: [
      {
        tempGroupKey: Date.now(),
        groupOperatorId: 0,
        conditions: [
          {
            fieldTypeId: 0,
            operatorId: 0,
            value: '',
            order: 0, // Order should be 0-indexed or managed dynamically
            tempGroupKey: Date.now(),
          },
        ],
        subGroups: [],
      },
    ],
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
        const [ops, gOps, fTypes, sevs, scens, prio] = await Promise.all([
          fetchMasterData({maserDataType: 'rule_operator', orgId, toolId}),
          fetchMasterData({maserDataType: 'rule_group_operator', orgId, toolId}),
          fetchMasterData({maserDataType: 'rule_field_type', orgId, toolId}),
          fetchMasterData({maserDataType: 'rule_severity', orgId, toolId}),
          fetchMasterData({maserDataType: 'rule_scenario', orgId, toolId}),
          fetchMasterData({maserDataType: 'rule_priority', orgId, toolId}),
        ])
        setMasterData({
          operators: ops || [],
          groupOperators: gOps || [],
          fieldTypes: fTypes || [],
          severities: sevs || [],
          scenarios: scens || [],
          priorities: prio || [],
        })
      } catch (error) {
        console.error('Error fetching master data:', error)
      }
    }
    loadMasterData()
  }, [orgId, toolId])

  // Helper to recursively add tempGroupKey for UI management
  const mapFetchedGroupToState = (group) => {
    const newGroup = {...group, tempGroupKey: Date.now() + Math.random()} // Ensure unique keys for React
    if (newGroup.conditions) {
      newGroup.conditions = newGroup.conditions.map((cond) => ({
        ...cond,
        tempGroupKey: newGroup.tempGroupKey,
      }))
    }
    if (newGroup.subGroups && newGroup.subGroups.length > 0) {
      newGroup.subGroups = newGroup.subGroups.map((sub) => mapFetchedGroupToState(sub))
    }
    return newGroup
  }

  // Fetch rule details for update
  const {id} = useParams()
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
              scenarioId: data.scenarioId || 0,
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
    const processGroupExpr = (group) => {
      const groupOpLabel =
        masterData.groupOperators.find((o) => o.dataID === group.groupOperatorId)?.dataValue || '??'

      const conditionStrings = (group.conditions || []).map((cond) => {
        const field =
          masterData.fieldTypes.find((f) => f.dataID === cond.fieldTypeId)?.dataValue || 'Field'
        const op = masterData.operators.find((o) => o.dataID === cond.operatorId)?.dataValue || 'Op'
        const val = cond.value || "''"
        return `(${field} ${op} ${val})`
      })

      const subGroupStrings = (group.subGroups || []).map((sub) => processGroupExpr(sub))

      const allItems = [...conditionStrings, ...subGroupStrings]

      if (allItems.length === 0) return '()'
      if (allItems.length === 1) return `(${allItems[0]})`

      return `(${allItems.join(` ${groupOpLabel} `)})`
    }

    const generateExpression = () => {
      if (!rule.groups || rule.groups.length === 0) return ''
      return rule.groups.map((group) => processGroupExpr(group)).join(' AND ')
    }

    setRule((prev) => ({...prev, expressionText: generateExpression()}))
  }, [rule.groups, masterData])

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

  const handleConditionChange = (groupKey, conditionIndex, field, value) => {
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
    const newKey = Date.now()
    setRule((prev) => ({
      ...prev,
      groups: [
        ...prev.groups,
        {
          tempGroupKey: newKey,
          groupOperatorId: 0,
          conditions: [{fieldTypeId: 0, operatorId: 0, value: '', order: 1, tempGroupKey: newKey}],
          subGroups: [],
        },
      ],
    }))
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
            value: '',
            order: g.conditions.length + 1,
            tempGroupKey: groupKey,
          },
        ],
      })),
    }))
  }

  const addSubGroup = (groupKey) => {
    const newKey = Date.now()
    setRule((prev) => ({
      ...prev,
      groups: updateNestedGroup(prev.groups, groupKey, (g) => ({
        ...g,
        subGroups: [
          ...g.subGroups,
          {
            tempGroupKey: newKey,
            groupOperatorId: 0,
            conditions: [
              {fieldTypeId: 0, operatorId: 0, value: '', order: 1, tempGroupKey: newKey},
            ],
            subGroups: [],
          },
        ],
      })),
    }))
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
    if (e) e.preventDefault()
    try {
      const mapGroup = (group) => ({
        groupOperatorId: group.groupOperatorId,
        conditions: (group.conditions || []).map((cond) => ({
          fieldTypeId: cond.fieldTypeId,
          operatorId: cond.operatorId,
          value: cond.value,
          order: cond.order,
        })),
        subGroups: (group.subGroups || []).map((sub) => mapGroup(sub)),
      })
      const payload = {
        ruleId: Number(id),
        ruleName: rule.ruleName,
        ruleCode: rule.ruleCode,
        priority: rule.priority,
        severityId: rule.severityId,
        scenarioId: rule.scenarioId,
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

  const renderGroup = (group, isSubGroup = false) => (
    <div
      key={group.tempGroupKey}
      className={`card mb-3 border-light shadow-none ${
        isSubGroup ? 'ms-5 border-start border-primary' : 'bg-light'
      }`}
    >
      <div className='card-body p-0 px-5 py-2'>
        <div className='row mb-3 align-items-center'>
          <div className='col-md-4'>
            <div className='d-flex align-items-center gap-2'>
              <button
                type='button'
                className='btn btn-sm btn-icon btn-light-danger me-2'
                onClick={() => removeGroup(group.tempGroupKey)}
                title='Remove Group'
              >
                <i className='fa fa-trash'></i>
              </button>
              <label className='form-label fw-bold small mb-0 text-nowrap'>Operator:</label>
              <select
                className='form-select form-select-sm'
                value={group.groupOperatorId}
                onChange={(e) =>
                  handleGroupChange(group.tempGroupKey, 'groupOperatorId', Number(e.target.value))
                }
                disabled={group.conditions.length + (group.subGroups?.length || 0) < 2}
              >
                <option value={0}>Select</option>
                {masterData.groupOperators.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='col text-end'>
            <button
              type='button'
              className='btn btn-sm btn-outline-info'
              onClick={() => addCondition(group.tempGroupKey)}
            >
              Add Condition
            </button>
            <button
              type='button'
              className='btn btn-sm btn-outline-secondary ms-2'
              onClick={() => addSubGroup(group.tempGroupKey)}
            >
              Add Sub Group
            </button>
          </div>
        </div>

        {group.conditions.map((cond, cIdx) => (
          <div key={cIdx} className='row g-2 mb-2 align-items-center'>
            <div className='col-md-1'>
              <button
                type='button'
                className='btn btn-sm btn-icon btn-light-danger'
                onClick={() => removeCondition(group.tempGroupKey, cIdx)}
                title='Remove Condition'
              >
                <i className='fa fa-trash'></i>
              </button>
            </div>
            <div className='col-md-3'>
              <select
                className='form-select form-select-sm'
                value={cond.fieldTypeId}
                onChange={(e) =>
                  handleConditionChange(
                    group.tempGroupKey,
                    cIdx,
                    'fieldTypeId',
                    Number(e.target.value)
                  )
                }
              >
                <option value={0}>Field Type</option>
                {masterData.fieldTypes.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-3'>
              <select
                className='form-select form-select-sm'
                value={cond.operatorId}
                onChange={(e) =>
                  handleConditionChange(
                    group.tempGroupKey,
                    cIdx,
                    'operatorId',
                    Number(e.target.value)
                  )
                }
              >
                <option value={0}>Operator</option>
                {masterData.operators.map((item) => (
                  <option key={item.dataID} value={item.dataID}>
                    {item.dataValue}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-5'>
              <input
                className='form-control form-control-sm'
                type='text'
                placeholder='Value'
                style={{height: 0}}
                value={cond.value}
                onChange={(e) =>
                  handleConditionChange(group.tempGroupKey, cIdx, 'value', e.target.value)
                }
              />
            </div>
          </div>
        ))}
        {group.subGroups && group.subGroups.length > 0 && (
          <div className='mt-3'>{group.subGroups.map((sub) => renderGroup(sub, true))}</div>
        )}
      </div>
    </div>
  )

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
                  <label className='form-label fw-bold small'>Rule Name</label>
                  <input
                    className='form-control form-control-sm'
                    type='text'
                    style={{height: 0}}
                    value={rule.ruleName}
                    onChange={(e) => handleRuleChange('ruleName', e.target.value)}
                  />
                </div>
              </div>
              <div className='col-md-4'>
                <div className='mb-3'>
                  <label className='form-label fw-bold small'>Rule Code</label>
                  <input
                    className='form-control form-control-sm'
                    type='text'
                    style={{height: 0}}
                    value={rule.ruleCode}
                    onChange={(e) => handleRuleChange('ruleCode', e.target.value)}
                  />
                </div>
              </div>
              <div className='col-md-4'>
                <div className='mb-3'>
                  <label className='form-label fw-bold small'>Priority</label>
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
                  <label className='form-label fw-bold small'>Severity</label>
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
                  <label className='form-label fw-bold small'>Scenario</label>
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

        <div className='card-body px-5 py-2'>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <h5 className='mb-0'>Condition Groups</h5>
            <button type='button' className='btn btn-sm btn-primary' onClick={addGroup}>
              Add Group
            </button>
          </div>
          {rule.groups.map((group) => renderGroup(group))}
        </div>

        <div className='card mb-4'>
          <div className='card-body px-5 py-2'>
            <div className='mb-3'>
              <label className='form-label fw-bold small'>Expression Text</label>
              <textarea
                className='form-control form-control-sm'
                rows='6'
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
