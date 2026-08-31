import React, {useEffect, useState, memo} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import Select from 'react-select'
import {fetchMasterData} from '../../../../../api/Api'
import {fetchRulesAddUrl} from '../../../../../api/ConfigurationApi'
import {fetchAlertFieldsUrl, fetchGetPlaybooksUrl} from '../../../../../api/AlertFieldsApi'
import {notify, notifyFail} from '../components/notification/Notification'

export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

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

const newCondition = () => ({
  tempKey: uid(),
  stdFieldId: 0,
  operatorId: 0,
  conditionValue: '',
  logicalOperatorId: 0,
})

const newGroup = () => ({
  tempKey: uid(),
  logicalOperatorId: 0,
  conditions: [newCondition()],
})

const responseItems = (response) =>
  Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : []

const RenderGroup = memo(
  ({
    group,
    groupIndex,
    operators,
    logicalOperators,
    standardFields,
    updateGroup,
    updateCondition,
    addCondition,
    removeCondition,
    removeGroup,
    groups,
  }) => {
    const activeKey = group.tempKey
    const lastCondition = group.conditions[group.conditions.length - 1]
    const isConditionJoinerSet = lastCondition ? lastCondition.logicalOperatorId !== 0 : true

    return (
      <div className='mb-1 p-1 rounded border bg-light border-gray-300'>
        <div className='d-flex align-items-center gap-3 mb-4 flex-wrap'>
          <span className='fw-bold text-gray-800 me-2'>Group {groupIndex + 1}</span>

          <button
            type='button'
            className='btn btn-sm btn-outline-info'
            disabled={!isConditionJoinerSet}
            onClick={() => addCondition(groupIndex)}
          >
            <i className='fa fa-plus me-1' />
            Condition
          </button>

          <div className='d-flex align-items-center gap-2 border-start ps-3 ms-2'>
            <label className='small fw-bold mb-0 text-nowrap'>
              Logical Operator <span className='text-danger'>*</span>
            </label>
            <select
              className={`${sel} w-100px`}
              value={group.logicalOperatorId}
              onChange={(event) =>
                updateGroup(groupIndex, {logicalOperatorId: Number(event.target.value)})
              }
            >
              <option value={0}>Select</option>
              {logicalOperators.map((operator) => (
                <option key={operator.dataID} value={operator.dataID}>
                  {operator.dataValue}
                </option>
              ))}
            </select>
          </div>

          <button
            type='button'
            className='btn btn-sm btn-outline-danger ms-auto'
            disabled={groups.length === 1}
            onClick={() => removeGroup(groupIndex)}
          >
            <i className='fa fa-trash' />
          </button>
        </div>

        <table style={{borderCollapse: 'collapse', width: '100%'}} className='mb-4'>
          <thead>
            <tr>
              <th style={{...hs, width: '40%'}}>Field Name</th>
              <th style={{...hs, width: '20%'}}>Op</th>
              <th style={{...hs, width: '30%'}}>Value</th>
              <th style={{...hs, width: '15%'}}>
                Logical Operator <span className='text-danger'>*</span>
              </th>
              <th style={{...hs, width: '10%'}}>Action</th>
            </tr>
          </thead>

          <tbody>
            {group.conditions.map((condition, conditionIndex) => (
              <tr key={condition.tempKey}>
                <td style={cs}>
                  <Select
                    options={standardFields.map((field) => ({
                      value: field.id,
                      label: field.fieldName || field.displayName,
                    }))}
                    value={
                      standardFields.find((field) => field.id === condition.stdFieldId)
                        ? {
                            value: condition.stdFieldId,
                            label:
                              standardFields.find((field) => field.id === condition.stdFieldId)
                                .fieldName ||
                              standardFields.find((field) => field.id === condition.stdFieldId)
                                .displayName,
                          }
                        : null
                    }
                    onChange={(val) =>
                      updateCondition(groupIndex, conditionIndex, {
                        stdFieldId: val ? Number(val.value) : 0,
                      })
                    }
                    placeholder='Select Field'
                    isClearable
                    styles={customSelectStyles}
                  />
                </td>

                <td style={cs}>
                  <Select
                    options={operators.map((operator) => ({
                      value: operator.dataID,
                      label: operator.dataValue,
                    }))}
                    value={
                      operators.find((operator) => operator.dataID === condition.operatorId)
                        ? {
                            value: condition.operatorId,
                            label: operators.find((operator) => operator.dataID === condition.operatorId)
                              .dataValue,
                          }
                        : null
                    }
                    onChange={(val) =>
                      updateCondition(groupIndex, conditionIndex, {
                        operatorId: val ? Number(val.value) : 0,
                      })
                    }
                    placeholder='Op'
                    isClearable
                    styles={customSelectStyles}
                  />
                </td>

                <td style={cs}>
                  <input
                    className={inp}
                    type='text'
                    value={condition.conditionValue}
                    placeholder='Enter Value'
                    onChange={(event) =>
                      updateCondition(groupIndex, conditionIndex, {
                        conditionValue: event.target.value,
                      })
                    }
                  />
                </td>

                <td style={cs}>
                  <select
                    className={sel}
                    value={condition.logicalOperatorId}
                    onChange={(event) =>
                      updateCondition(groupIndex, conditionIndex, {
                        logicalOperatorId: Number(event.target.value),
                      })
                    }
                  >
                    <option value={0}>Select</option>
                    {logicalOperators.map((operator) => (
                      <option key={operator.dataID} value={operator.dataID}>
                        {operator.dataValue}
                      </option>
                    ))}
                  </select>
                </td>

                <td style={{...cs, textAlign: 'center'}}>
                  <button
                    type='button'
                    className='btn btn-sm btn-icon btn-light-danger'
                    disabled={group.conditions.length === 1}
                    onClick={() => removeCondition(groupIndex, conditionIndex)}
                  >
                    <i className='fa fa-times' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
)

export function AddRule() {
  const navigate = useNavigate()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const userId = Number(sessionStorage.getItem('userId'))
  const [loading, setLoading] = useState(false)
  const [operators, setOperators] = useState([])
  const [logicalOperators, setLogicalOperators] = useState([])
  const [standardFields, setStandardFields] = useState([])
  const [playbooks, setPlaybooks] = useState([])
  const [ruleName, setRuleName] = useState('')
  const [groups, setGroups] = useState([newGroup()])
  const [selectedPlaybookIds, setSelectedPlaybookIds] = useState([])
  const [expressionText, setExpressionText] = useState('')

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [operatorData, logicalOperatorData, fieldResponse, playbookResponse] =
          await Promise.all([
            fetchMasterData({maserDataType: 'condition_operator', orgId, toolId}),
            fetchMasterData({maserDataType: 'logical_operator', orgId, toolId}),
            fetchAlertFieldsUrl({searchText: null, fieldTypeId: null, toolId: null}),
            fetchGetPlaybooksUrl({searchtext: ''}),
          ])

        setOperators(operatorData || [])
        setLogicalOperators(logicalOperatorData || [])
        setStandardFields(
          responseItems(fieldResponse).filter((field) => field.fieldType === 'Standard')
        )
        setPlaybooks(responseItems(playbookResponse))
      } catch (error) {
        console.error('Error loading rule form data:', error)
        notifyFail('Failed to load rule form data.')
      }
    }
    loadFormData()
  }, [orgId, toolId])

  // Auto-compute expression text whenever groups or lookup data change
  useEffect(() => {
    const exprForGroup = (g) => {
      const conditionsToProcess = Array.isArray(g.conditions) ? g.conditions : []
      if (conditionsToProcess.length === 0) return ''

      const items = []
      conditionsToProcess.forEach((c) => {
        const field = standardFields.find((x) => x.id === c.stdFieldId)
        const fieldLabel = field ? (field.fieldName || field.displayName || 'Field') : 'Field'
        const op = operators.find((x) => x.dataID === c.operatorId)
        const opLabel = op ? op.dataValue : 'Op'
        const str = `(${fieldLabel} ${opLabel} ${c.conditionValue || "''"})`
        const joiner =
          logicalOperators.find((x) => x.dataID === c.logicalOperatorId)?.dataValue || 'AND'
        items.push({str, joiner})
      })

      if (items.length === 0) return ''

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
    groups.forEach((g, i) => {
      const groupStr = exprForGroup(g)
      if (groupStr && groupStr !== '()') {
        finalExpr += groupStr
        if (i < groups.length - 1) {
          const joiner =
            logicalOperators.find((x) => x.dataID === g.logicalOperatorId)?.dataValue || 'AND'
          finalExpr += ` ${joiner} `
        }
      }
    })

    setExpressionText(finalExpr)
  }, [groups, standardFields, operators, logicalOperators])

  const updateGroup = (groupIndex, update) => {
    setGroups((previous) =>
      previous.map((group, index) => (index === groupIndex ? {...group, ...update} : group))
    )
  }

  const updateCondition = (groupIndex, conditionIndex, update) => {
    setGroups((previous) =>
      previous.map((group, index) => {
        if (index !== groupIndex) return group
        return {
          ...group,
          conditions: group.conditions.map((condition, idx) =>
            idx === conditionIndex ? {...condition, ...update} : condition
          ),
        }
      })
    )
  }

  const addCondition = (groupIndex) => {
    setGroups((previous) =>
      previous.map((group, index) => {
        if (index !== groupIndex) return group
        const lastCondition = group.conditions[group.conditions.length - 1]
        if (!lastCondition || lastCondition.logicalOperatorId === 0) {
          notifyFail('Please select a Logical Operator before adding another condition.')
          return group
        }
        return {
          ...group,
          conditions: [...group.conditions, newCondition()],
        }
      })
    )
  }

  const removeCondition = (groupIndex, conditionIndex) => {
    setGroups((previous) =>
      previous.map((group, index) => {
        if (index !== groupIndex) return group
        if (group.conditions.length === 1) return group
        return {
          ...group,
          conditions: group.conditions.filter((_, idx) => idx !== conditionIndex),
        }
      })
    )
  }

  const addGroup = () => {
    const lastGroup = groups[groups.length - 1]
    if (!lastGroup || lastGroup.logicalOperatorId === 0) {
      notifyFail('Please select a Group Logical Operator before adding another group.')
      return
    }
    setGroups((previous) => [...previous, newGroup()])
  }

  const removeGroup = (groupIndex) => {
    if (groups.length === 1) return
    setGroups((previous) => previous.filter((_, index) => index !== groupIndex))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!ruleName.trim()) {
      notifyFail('Rule Name is mandatory.')
      return
    }

    for (const group of groups) {
      for (const condition of group.conditions) {
        if (!condition.stdFieldId || !condition.operatorId || !condition.conditionValue.trim()) {
          notifyFail('Please complete every condition.')
          return
        }
      }
    }

    const payload = {
      ruleName: ruleName.trim(),
      groups: groups.map((group, groupIndex) => ({
        groupOrder: groupIndex,
        logicalOperatorId: group.logicalOperatorId === 0 ? null : group.logicalOperatorId,
        conditions: group.conditions.map((condition, conditionIndex) => ({
          stdFieldId: condition.stdFieldId,
          operatorId: condition.operatorId,
          conditionValue: condition.conditionValue.trim(),
          logicalOperatorId: condition.logicalOperatorId === 0 ? null : condition.logicalOperatorId,
          conditionOrder: conditionIndex,
        })),
      })),
      playbooks: selectedPlaybookIds.map((playbookId) => ({playbookId})),
      userId,
    }

    try {
      setLoading(true)
      const response = await fetchRulesAddUrl(payload)
      if (response?.isSuccess) {
        notify(response.message || 'Rule added successfully')
        navigate('/qradar/rules-engine/list')
      } else {
        notifyFail(response?.message || 'Failed to add rule')
      }
    } catch (error) {
      console.error('Error adding rule:', error)
      notifyFail('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title'>
          <span className='white'>Add New Rule</span>
        </h3>
        <div className='card-toolbar'>
          <Link to='/qradar/rules-engine/list' className='white fs-15 text-underline'>
            <i className='fa fa-chevron-left white mg-right-5' />
            Back
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='card mb-4'>
          <div className='card-body px-5 py-2'>
            <div className='row g-3'>
              <div className='col-md-6'>
                <div className='mb-3'>
                  <label className='form-label fw-bold small'>
                    Rule Name <span className='text-danger'>*</span>
                  </label>
                  <input
                    className='form-control form-control-sm'
                    type='text'
                    value={ruleName}
                    onChange={(event) => setRuleName(event.target.value)}
                  />
                </div>
              </div>

              <div className='col-md-6'>
                <div className='mb-3'>
                  <label className='form-label fw-bold small'>Playbooks</label>
                  <Select
                    isMulti
                    isClearable
                    options={playbooks.map((playbook) => ({
                      value: playbook.playbookId ?? playbook.id,
                      label: playbook.playbookName || playbook.name,
                    }))}
                    value={playbooks
                      .filter((playbook) =>
                        selectedPlaybookIds.includes(playbook.playbookId ?? playbook.id)
                      )
                      .map((playbook) => ({
                        value: playbook.playbookId ?? playbook.id,
                        label: playbook.playbookName || playbook.name,
                      }))}
                    onChange={(options) =>
                      setSelectedPlaybookIds((options || []).map((option) => Number(option.value)))
                    }
                    placeholder='Select Playbooks'
                    styles={customSelectStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='card-body px-5 py-2'>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <h5 className='mb-0'>Condition Groups</h5>
            <button
              type='button'
              className='btn btn-sm btn-primary'
              onClick={addGroup}
              disabled={groups.length > 0 && groups[groups.length - 1].logicalOperatorId === 0}
            >
              <i className='fa fa-plus me-1' />
              Add Group
            </button>
          </div>

          {groups.map((group, groupIndex) => (
            <RenderGroup
              key={group.tempKey}
              group={group}
              groupIndex={groupIndex}
              operators={operators}
              logicalOperators={logicalOperators}
              standardFields={standardFields}
              updateGroup={updateGroup}
              updateCondition={updateCondition}
              addCondition={addCondition}
              removeCondition={removeCondition}
              removeGroup={removeGroup}
              groups={groups}
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
                style={{height: '200px'}}
                value={expressionText}
                onChange={(e) => setExpressionText(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className='text-end mt-2 me-5 mb-5'>
          <button
            className='btn btn-new btn-small'
            type='submit'
            style={{display: loading ? 'none' : 'inline-block'}}
          >
            Save Rule
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddRule
