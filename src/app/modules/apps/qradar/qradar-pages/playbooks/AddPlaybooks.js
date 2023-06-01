import React, {useCallback, useRef, useState, useEffect} from 'react'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  updateEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow'

import {dndinitialNodes as initialNodes, edges as initialEdges} from './initial-elements'
import CustomNode from './CustomNode'

import 'reactflow/dist/style.css'
import './overview.css'
import Sidebar from './Sidebar'
// DND Start
let id = 0
const getId = () => `${id++}`
// DND End
const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance)
const flowKey = 'playbook_export'

const AddPlaybooks = () => {
  ///////////////////// Dynamic Data fetch  //////////////////////////
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [rules, setRules] = useState([])
  const [actions, setActions] = useState([])
  const [rulesData, setRulesData] = useState([])
  useEffect(() => {
    setLoading(true)
    ////// Fetch Rules From API
    var rules_config = {
      method: 'get',
      url: 'http://115.110.192.133:8011/api/RulesConfiguraton/v1/Rules',
      headers: {
        Accept: 'text/plain',
      },
    }

    axios(rules_config)
      .then(function (response) {
        //console.log('response', response)
        setRules(response.data.rulesList)
        // console.log('rules', response.data.rulesList)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
    ////// Fetch Actions From API
    var actions_config = {
      method: 'get',
      url: 'http://115.110.192.133:8011/api/RuleAction/v1/RuleActions',
      headers: {
        Accept: 'text/plain',
      },
    }

    axios(actions_config)
      .then(function (response) {
        setActions(response.data.ruleActionList)
        // console.log('Actions', response.data.ruleActionList)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])
  ///////////////////// Dynamic Data fetch  //////////////////////////
  const reactFlowWrapper = useRef(null)
  const edgeUpdateSuccessful = useRef(true)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [dynamicid, setDynamicid] = useState([])
  const playBookName = useRef()
  const remarks = useRef()
  const errors = {}
  const onSave = useCallback(
    (event) => {
      setLoading(true)
      if (!playBookName.current.value) {
        errors.playBookName = 'Enter Playbook Name'
        setLoading(false)
        return errors
      }
      if (!remarks.current.value) {
        errors.remarks = 'Enter Remarks'
        setLoading(false)
        return errors
      }
      event.preventDefault()
      var data = JSON.stringify({
        playBookName: playBookName.current.value,
        remarks: remarks.current.value,
      })
      if (reactFlowInstance) {
        const flow = reactFlowInstance.toObject()
        localStorage.setItem(flowKey, JSON.stringify(flow))
        let localdata = JSON.parse(localStorage.getItem('playbook_export'))
        localdata.nodes.map((ruleactiondata, index) => {
          let split_data = ruleactiondata.id.split('@')

          let object = {
            playBookItemType: split_data[1],
            playBookItemTypeRefID: split_data[2],
            executionSequenceNumber: split_data[0],
          }
          rulesData.push(object)
        })
      }
      /// Send Data to Server :
      var axios = require('axios')
      var data = JSON.stringify({
        alertCatogory: 'category_1',
        playBookName: playBookName.current.value,
        remarks: remarks.current.value,
        createdDate: '2023-01-11T06:09:21.265Z',
        createdUser: 'super_admin',
        playbookDtls: rulesData,
      })

      var playbook_config = {
        method: 'post',
        url: 'http://115.110.192.133:8011/api/PlayBook/v1/Playbook/Add',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain',
        },
        data: data,
      }
      axios(playbook_config)
        .then(function (response) {
          console.log(JSON.stringify(response.data))
          navigate('/qradar/playbooks/updated')
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    [reactFlowInstance]
  )

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [])

  const onDragOver = useCallback((event) => {
    console.log('onDragOver')
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDragStart = (event, ruleType, ruleLable, ruleID, nodeType) => {
    console.log('onDragStart')
    // onDragStart(event, 'rule', item.ruleName, item.ruleID, 'default')
    event.dataTransfer.setData('application/ruleType', ruleType)
    event.dataTransfer.setData('application/ruleLable', ruleLable)
    event.dataTransfer.setData('application/ruleID', ruleID)
    event.dataTransfer.setData('application/nodeType', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onEdgeUpdateStart = useCallback(() => {
    console.log('onEdgeUpdateStart')
    edgeUpdateSuccessful.current = false
  }, [])

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    console.log('onEdgeUpdate')
    edgeUpdateSuccessful.current = true
    setEdges((els) => updateEdge(oldEdge, newConnection, els))
  }, [])

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    console.log('onEdgeUpdateEnd')
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id))
    }
    edgeUpdateSuccessful.current = true
  }, [])

  const onDrop = useCallback(
    (event) => {
      console.log('onDrop')
      event.preventDefault()
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()

      const ruletype = event.dataTransfer.getData('application/ruleType')
      const lable = event.dataTransfer.getData('application/ruleLable')
      const id = event.dataTransfer.getData('application/ruleID')
      const type = event.dataTransfer.getData('application/nodeType')

      console.log('Event', event.target.value)
      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode = {
        id: `${getId() + '@' + ruletype + '@' + id + '@' + lable}`,
        type,
        position,
        data: {label: `${lable}`}, // Node name is callng here
      }

      setNodes((nds) => nds.concat(newNode))

      console.log('nodes', nodes)
    },
    [reactFlowInstance]
  )

  return (
    <form>
      <div className='playbooks'>
        <div className='card-header border-0'></div>
        <div className='row mb-6'>
          <div className='col-lg-6 mb-4 mb-lg-0'>
            <div className='fv-row mb-0'>
              <label htmlFor='playBookName' className='form-label fs-6 fw-bolder mb-3'>
                Enter Playbook Name
              </label>
              <input
                type='text'
                required
                className='form-control form-control-lg form-control'
                placeholder='Ex: PlayBook Name'
                ref={playBookName}
              />
            </div>
          </div>

          <div className='col-lg-6 mb-4 mb-lg-0'>
            <div className='fv-row mb-0'>
              <label htmlFor='remarks' className='form-label fs-6 fw-bolder mb-3'>
                Playbook Description
              </label>
              <input
                type='text'
                required
                className='form-control form-control-lg form-control'
                placeholder='Ex: Some Explanation About Playbook'
                ref={remarks}
              />
            </div>
          </div>
        </div>
        <div className='card mb-5 mb-xl-8'>
          <div className='row'>
            <div className='col-lg-3'>
              <div className='card-body highlight h-100'>
                {loading && <UsersListLoading />}
                <div className='col'>
                  <h3 className='text-white'>Rules</h3>
                  {rules.map((item, index) => (
                    <>
                      <div
                        key={index}
                        id={item.ruleID}
                        value={`rule_id` + item.ruleID}
                        className='btn btn-primary btn-sm mb-1 dndnode'
                        onDragStart={(event) =>
                          onDragStart(event, 'rule', item.ruleName, item.ruleID, 'default')
                        }
                        draggable
                      >
                        {/* <i className='fas fa-search'></i> */}
                        <span> {item.ruleName}</span>
                      </div>
                    </>
                  ))}
                  <hr />
                  <h3 className='text-white'>Actions</h3>
                  {actions.map((item, index) => (
                    <>
                      <div
                        key={index}
                        id={item.ruleActionID}
                        value={`action_id` + item.ruleActionID}
                        className='btn btn-primary btn-sm mb-1 dndnode'
                        onDragStart={(event) =>
                          onDragStart(
                            event,
                            'action',
                            item.ruleActionName,
                            item.ruleActionID,
                            'default'
                          )
                        }
                        draggable
                      >
                        <i className='fas fa-search'></i>
                        <span> {item.ruleActionName}</span>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
            <div className='col-lg-9'>
              <div className='' style={{height: '500px'}}>
                <div className='dndflow'>
                  <ReactFlowProvider>
                    <div className='reactflow-wrapper' ref={reactFlowWrapper}>
                      <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        snapToGrid
                        onEdgeUpdate={onEdgeUpdate}
                        onEdgeUpdateStart={onEdgeUpdateStart}
                        onEdgeUpdateEnd={onEdgeUpdateEnd}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        attributionPosition='top-right'
                        fitView
                      ></ReactFlow>
                    </div>
                    <Controls />
                  </ReactFlowProvider>
                </div>
              </div>
            </div>
          </div>
          <div className='row mb-6'>
            <div className='col-lg-10 mb-4 mb-lg-0'></div>
            <div className='col-lg-2 mb-4 mb-lg-0'>
              <button className='btn btn-primary btn-sm mb-1 save' onClick={onSave}>
                Save Playbook
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export {AddPlaybooks}
