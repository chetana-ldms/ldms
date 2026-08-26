import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import Select from 'react-select'
import {fetchMasterData} from '../../../../../api/Api'
import {fetchRulesAddUrl} from '../../../../../api/ConfigurationApi'
import {fetchAlertFieldsUrl, fetchGetPlaybooksUrl} from '../../../../../api/AlertFieldsApi'
import {notify, notifyFail} from '../components/notification/Notification'

export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

const createKey = uid

const newCondition = () => ({
  key: createKey(),
  stdFieldId: 0,
  operatorId: 0,
  conditionValue: '',
  logicalOperatorId: 0,
})

const newGroup = () => ({
  key: createKey(),
  logicalOperatorId: 0,
  conditions: [newCondition()],
})

const responseItems = (response) =>
  Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : []

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

  const updateGroup = (groupIndex, update) => {
    setGroups((previous) =>
      previous.map((group, index) => (index === groupIndex ? {...group, ...update} : group))
    )
  }

  const updateCondition = (groupIndex, conditionIndex, update) => {
    const group = groups[groupIndex]
    updateGroup(groupIndex, {
      conditions: group.conditions.map((condition, index) =>
        index === conditionIndex ? {...condition, ...update} : condition
      ),
    })
  }

  const addCondition = (groupIndex) => {
    const group = groups[groupIndex]
    const lastCondition = group.conditions[group.conditions.length - 1]
    if (!lastCondition.logicalOperatorId) {
      notifyFail('Please select a Logical Operator before adding another condition.')
      return
    }
    updateGroup(groupIndex, {conditions: [...group.conditions, newCondition()]})
  }

  const addGroup = () => {
    const lastGroup = groups[groups.length - 1]
    if (!lastGroup.logicalOperatorId) {
      notifyFail('Please select a Group Logical Operator before adding another group.')
      return
    }
    setGroups((previous) => [...previous, newGroup()])
  }

  const removeCondition = (groupIndex, conditionIndex) => {
    const group = groups[groupIndex]
    if (group.conditions.length === 1) return
    updateGroup(groupIndex, {
      conditions: group.conditions.filter((_, index) => index !== conditionIndex),
    })
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
        <div className='card-body px-5 py-4'>
          <div className='row g-3 mb-4'>
            <div className='col-md-6'>
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
            <div className='col-md-6'>
              <label className='form-label fw-bold small'>Playbooks</label>
              <Select
                isMulti
                isClearable
                options={playbooks.map((playbook) => ({
                  value: playbook.playbookId ?? playbook.id,
                  label: playbook.playbookName,
                }))}
                value={playbooks
                  .filter((playbook) =>
                    selectedPlaybookIds.includes(playbook.playbookId ?? playbook.id)
                  )
                  .map((playbook) => ({
                    value: playbook.playbookId ?? playbook.id,
                    label: playbook.playbookName,
                  }))}
                onChange={(options) =>
                  setSelectedPlaybookIds((options || []).map((option) => Number(option.value)))
                }
                placeholder='Select Playbooks'
              />
            </div>
          </div>

          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h5 className='mb-0'>Condition Groups</h5>
            <button type='button' className='btn btn-sm btn-primary' onClick={addGroup}>
              <i className='fa fa-plus me-1' />
              Add Group
            </button>
          </div>

          {groups.map((group, groupIndex) => (
            <div key={group.key} className='border rounded p-3 mb-3 bg-light shadow-sm'>
              <div className='d-flex justify-content-between align-items-center gap-3 mb-3 pb-3 border-bottom'>
                <h6 className='mb-0 text-primary'>Group {groupIndex + 1}</h6>
                <div className='d-flex align-items-center gap-2 ms-auto'>
                  <label className='form-label small fw-bold mb-0 text-nowrap'>
                    Group Logical Operator
                  </label>
                  <select
                    className='form-select form-select-sm w-125px'
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
                <div className='d-flex gap-2'>
                  <button
                    type='button'
                    className='btn btn-sm btn-outline-primary'
                    onClick={() => addCondition(groupIndex)}
                  >
                    <i className='fa fa-plus me-1' />
                    Condition
                  </button>
                  <button
                    type='button'
                    className='btn btn-sm btn-outline-danger'
                    disabled={groups.length === 1}
                    onClick={() =>
                      setGroups((previous) => previous.filter((_, index) => index !== groupIndex))
                    }
                  >
                    <i className='fa fa-trash' />
                  </button>
                </div>
              </div>

              {group.conditions.map((condition, conditionIndex) => (
                <div key={condition.key} className='row g-2 align-items-end mb-2'>
                  <div className='col-md-3'>
                    <label className='form-label small'>Standard Field</label>
                    <select
                      className='form-select form-select-sm'
                      value={condition.stdFieldId}
                      onChange={(event) =>
                        updateCondition(groupIndex, conditionIndex, {
                          stdFieldId: Number(event.target.value),
                        })
                      }
                    >
                      <option value={0}>Select Field</option>
                      {standardFields.map((field) => (
                        <option key={field.id} value={field.id}>
                          {field.fieldName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='col-md-2'>
                    <label className='form-label small'>Operator</label>
                    <select
                      className='form-select form-select-sm'
                      value={condition.operatorId}
                      onChange={(event) =>
                        updateCondition(groupIndex, conditionIndex, {
                          operatorId: Number(event.target.value),
                        })
                      }
                    >
                      <option value={0}>Select Operator</option>
                      {operators.map((operator) => (
                        <option key={operator.dataID} value={operator.dataID}>
                          {operator.dataValue}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='col-md-3'>
                    <label className='form-label small'>Condition Value</label>
                    <input
                      className='form-control form-control-sm'
                      value={condition.conditionValue}
                      onChange={(event) =>
                        updateCondition(groupIndex, conditionIndex, {
                          conditionValue: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className='col-md-2'>
                    <label className='form-label small'>Logical Operator</label>
                    <select
                      className='form-select form-select-sm'
                      value={condition.logicalOperatorId}
                      onChange={(event) =>
                        updateCondition(groupIndex, conditionIndex, {
                          logicalOperatorId: Number(event.target.value),
                        })
                      }
                    >
                      <option value={0}>None</option>
                      {logicalOperators.map((operator) => (
                        <option key={operator.dataID} value={operator.dataID}>
                          {operator.dataValue}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='col-md-2'>
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-danger'
                      disabled={group.conditions.length === 1}
                      onClick={() => removeCondition(groupIndex, conditionIndex)}
                    >
                      <i className='fa fa-trash' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className='card-footer text-end px-5 py-4'>
          <button type='submit' className='btn btn-primary btn-sm' disabled={loading}>
            {loading ? 'Saving...' : 'Save Rule'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddRule
