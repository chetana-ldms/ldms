import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

import Sidebar from './Sidebar'
import {ActionNode, EndNode, StartNode} from './CustomNode'
import {fetchRuleActions} from '../../../../../api/ConfigurationApi'
import {fetchConnectionSearchUrl} from '../../../../../api/ConnectionApi'
import {fetchGET_ACTION_PARAMETERS_URL} from '../../../../../api/ScriptsApi'
import {fetchplaybookByIdUrl, fetchPlaybookUpdateUrl} from '../../../../../api/playBookApi'
import {notify, notifyFail} from '../components/notification/Notification'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import './playbook.css'

const nodeTypes = {
  startNode: StartNode,
  endNode: EndNode,
  actionNode: ActionNode,
}

const defaultEdgeOptions = {
  style: {strokeWidth: 2, stroke: '#b1b1b7'},
  markerEnd: {type: MarkerType.ArrowClosed, color: '#b1b1b7'},
}

const getDetail = (response) => response?.data || response?.playbook || response
const getNodeId = (node) => node.playbookNodeId || node.id
const getNodeType = (node) => {
  const nodeName = String(node.nodeName || '').trim().toLowerCase()
  if (nodeName === 'start') return 'startNode'
  if (nodeName === 'end') return 'endNode'
  return 'actionNode'
}

const UpdatePlaybooks = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {id} = useParams()
  const isViewMode = location.state?.save === true
  const userId = Number(sessionStorage.getItem('userId') || 0)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [playbookName, setPlaybookName] = useState('')
  const [connectionId, setConnectionId] = useState('')
  const [connections, setConnections] = useState([])
  const [actions, setActions] = useState([])
  const [actionsLoading, setActionsLoading] = useState(false)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [nodeProps, setNodeProps] = useState({})
  const [selectedNode, setSelectedNode] = useState(null)
  const [nodeParams, setNodeParams] = useState([])
  const reactFlowWrapper = useRef(null)
  const [rfInstance, setRfInstance] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [detailResult, actionResult, connectionResult] = await Promise.allSettled([
          fetchplaybookByIdUrl({playbookId: Number(id)}),
          fetchRuleActions({active: true}),
          fetchConnectionSearchUrl({searchText: ''}),
        ])
        if (detailResult.status === 'rejected') throw detailResult.reason
        const detailResponse = detailResult.value
        const actionResponse = actionResult.status === 'fulfilled' ? actionResult.value : null
        const detail = getDetail(detailResponse)
        const detailNodes = Array.isArray(detail?.nodes) ? detail.nodes : []
        const sortedDetailNodes = [...detailNodes].sort(
          (first, second) => Number(first.nodeOrder || 0) - Number(second.nodeOrder || 0)
        )
        const mappedNodes = sortedDetailNodes.map((node, index) => {
          const nodeId = String(getNodeId(node) || `node_${index + 1}`)
          const actionId = Number(node.actionId || 0)
          return {
            id: nodeId,
            type: getNodeType(node),
            position: {
              x: Number(node.positionX || 0),
              y: Number(node.positionY || 0),
            },
            data: {
              label: `${node.nodeOrder || index + 1}. ${node.nodeName || node.actionName || `Node ${index + 1}`}`,
              actionId,
            },
          }
        })

        setEdges(
          mappedNodes.slice(1).map((node, index) => ({
            id: `execution-${mappedNodes[index].id}-${node.id}`,
            source: mappedNodes[index].id,
            target: node.id,
            ...defaultEdgeOptions,
          }))
        )

        setPlaybookName(detail?.playbookName || detail?.playBookName || '')
        setConnectionId(String(detail?.connection?.connectionId || detail?.connectionId || ''))
        if (connectionResult.status === 'fulfilled' && connectionResult.value) {
          const response = connectionResult.value
          const connectionList = Array.isArray(response)
            ? response
            : Array.isArray(response.connections)
            ? response.connections
            : Array.isArray(response.data)
            ? response.data
            : []
          setConnections(connectionList)
        }
        setNodes(mappedNodes)
        setNodeProps(
          Object.fromEntries(
            sortedDetailNodes.map((node, index) => [
              String(getNodeId(node) || `node_${index + 1}`),
              {
                playbookNodeId: Number(node.playbookNodeId || 0),
                nodeName: node.nodeName || node.actionName || `Node ${index + 1}`,
                actionId: Number(node.actionId || null),
                positionZ: Number(node.positionZ || 0),
                parameters: Array.isArray(node.parameters) ? node.parameters : [],
                connections: Array.isArray(node.connections) ? node.connections : [],
              },
            ])
          )
        )
        setActions(Array.isArray(actionResponse?.actions) ? actionResponse.actions : [])
      } catch (error) {
        console.error('Error loading playbook:', error)
        notifyFail('Failed to load playbook details.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, setNodes])

  useEffect(() => {
    if (!selectedNode) {
      setNodeParams([])
      return
    }

    const saved = nodeProps[selectedNode.id] || {}
    const savedParameters = saved.parameters || []
    setNodeParams(savedParameters)

    const actionId = saved.actionId || selectedNode.data?.actionId || 0
    if (actionId && savedParameters.length === 0) {
      fetchGET_ACTION_PARAMETERS_URL({actionId})
        .then((response) => {
          const parameters = Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.actionParameters)
            ? response.actionParameters
            : []
          const mapped = parameters.map((parameter) => ({
            actionParameterId: parameter.actionParameterId || parameter.id || 0,
            actionParameterName:
              parameter.actionParameterName || parameter.parameterName || parameter.name || '',
            parameterValue: parameter.parameterValue || '',
            valueSource: parameter.valueSource || 'Static',
          }))
          setNodeParams(mapped)
          updateNodeProp(selectedNode.id, 'parameters', mapped)
        })
        .catch(() => {})
    }
  }, [selectedNode]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateNodeProp = useCallback((nodeId, field, value) => {
    setNodeProps((currentProps) => ({
      ...currentProps,
      [nodeId]: {...(currentProps[nodeId] || {}), [field]: value},
    }))
  }, [])

  const onConnect = useCallback(
    (connection) => setEdges((currentEdges) => addEdge({...connection, ...defaultEdgeOptions}, currentEdges)),
    [setEdges]
  )

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      if (!rfInstance || !reactFlowWrapper.current) return
      const raw = event.dataTransfer.getData('application/playbookNode')
      if (!raw) return

      let nodeData
      try {
        nodeData = JSON.parse(raw)
      } catch {
        return
      }

      const bounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = rfInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      })
      const nodeId = `node_${Date.now()}`
      const newNode = {
        id: nodeId,
        type: nodeData.type,
        position,
        data: {label: nodeData.label, actionId: nodeData.actionId || 0},
      }

      setNodes((currentNodes) => currentNodes.concat(newNode))
      setNodeProps((currentProps) => ({
        ...currentProps,
        [nodeId]: {
          playbookNodeId: 0,
          nodeName: nodeData.label,
          actionId: nodeData.actionId || 0,
          positionZ: 0,
          parameters: [],
          connections: [],
        },
      }))
    },
    [rfInstance, setNodes]
  )

  const removeSelectedNode = useCallback(() => {
    if (!selectedNode) return
    const nodeId = selectedNode.id
    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== nodeId))
    setEdges((currentEdges) =>
      currentEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    )
    setNodeProps((currentProps) => {
      const nextProps = {...currentProps}
      delete nextProps[nodeId]
      return nextProps
    })
    setSelectedNode(null)
  }, [selectedNode, setEdges, setNodes])

  const handleNodeNameChange = (value) => {
    if (!selectedNode) return
    updateNodeProp(selectedNode.id, 'nodeName', value)
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === selectedNode.id ? {...node, data: {...node.data, label: value}} : node
      )
    )
  }

  const handleActionChange = async (actionId) => {
    if (!selectedNode) return
    updateNodeProp(selectedNode.id, 'actionId', actionId)
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === selectedNode.id ? {...node, data: {...node.data, actionId}} : node
      )
    )
    if (!actionId) return

    const response = await fetchGET_ACTION_PARAMETERS_URL({actionId})
    const parameters = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.actionParameters)
      ? response.actionParameters
      : []
    const mappedParameters = parameters.map((parameter) => ({
      actionParameterId: parameter.actionParameterId || parameter.id || 0,
      actionParameterName:
        parameter.actionParameterName || parameter.parameterName || parameter.name || '',
      parameterValue: parameter.parameterValue || '',
      valueSource: parameter.valueSource || 'Static',
    }))
    setNodeParams(mappedParameters)
    updateNodeProp(selectedNode.id, 'parameters', mappedParameters)
  }

  const handleParamChange = (index, field, value) => {
    const updated = nodeParams.map((parameter, currentIndex) =>
      currentIndex === index ? {...parameter, [field]: value} : parameter
    )
    setNodeParams(updated)
    updateNodeProp(selectedNode.id, 'parameters', updated)
  }

  const addParam = () => {
    const updated = [
      ...nodeParams,
      {actionParameterId: 0, actionParameterName: '', parameterValue: '', valueSource: 'Static'},
    ]
    setNodeParams(updated)
    updateNodeProp(selectedNode.id, 'parameters', updated)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!playbookName.trim()) {
      notifyFail('Please enter a Playbook Name')
      return
    }

    setSaving(true)
    try {
      const payload = {
        playbookId: Number(id),
        connectionId: Number(connectionId) || 0,
        nodes: nodes.map((node, index) => {
          const props = nodeProps[node.id] || {}
          return {
            playbookNodeId: Number(props.playbookNodeId || 0),
            nodeName: props.nodeName || node.data.label || `Node ${index + 1}`,
            nodeOrder: index + 1,
            actionId:
              Number(props.actionId || node.data.actionId || 0) || null,
            positionX: Number(node.position?.x || 0),
            positionY: Number(node.position?.y || 0),
            positionZ: Number(props.positionZ || 0),
            parameters: (props.parameters || []).map((parameter) => ({
              playbookNodeParameterId: Number(parameter.playbookNodeParameterId || 0),
              actionParameterId: Number(parameter.actionParameterId || 0),
              parameterValue: parameter.parameterValue || '',
              valueSource: parameter.valueSource || 'Static',
            })),
            connections: (props.connections || []).map((connection) => ({
              playbookConnectionId: Number(connection.playbookConnectionId || 0),
              connectionId: Number(connection.connectionId || 0),
            })),
          }
        }),
        userId,
      }

      const response = await fetchPlaybookUpdateUrl(payload)
      if (response?.isSuccess) {
        notify(response.message || 'Playbook updated successfully')
        navigate('/qradar/playbooks/list')
      } else {
        notifyFail(response?.message || 'Failed to update playbook')
      }
    } catch (error) {
      console.error('Error updating playbook:', error)
      notifyFail('An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <UsersListLoading />

  const currentProps = selectedNode ? nodeProps[selectedNode.id] || {} : {}

  return (
    <div className='playbook-designer'>
      <ToastContainer />
      <div className='playbook-designer__header'>
        <div className='playbook-designer__header-left'>
          <div className='playbook-designer__breadcrumb'>
            <Link to='/qradar/playbooks/list' className='playbook-designer__breadcrumb-link'>
              Playbook
            </Link>
            <span className='playbook-designer__breadcrumb-sep'>&rsaquo;</span>
            <span className='playbook-designer__breadcrumb-current'>Update Designer</span>
          </div>
          <div className='playbook-designer__title-row'>
            <h2 className='playbook-designer__title'>{isViewMode ? 'View' : 'Update'} Playbook</h2>
            <div className='playbook-designer__meta-field'>
              <label className='playbook-designer__meta-label'>Playbook Name</label>
              <input
                className='playbook-designer__meta-input'
                value={playbookName}
                onChange={(event) => setPlaybookName(event.target.value)}
                disabled={isViewMode}
              />
            </div>
            <div className='playbook-designer__meta-field'>
              <label className='playbook-designer__meta-label'>Connection</label>
              <select
                className='playbook-designer__meta-input'
                value={connectionId}
                onChange={(event) => setConnectionId(event.target.value)}
                disabled={isViewMode}
              >
                <option value=''>Select connection</option>
                {connections.map((connection) => (
                  <option key={connection.connectionId} value={connection.connectionId}>
                    {connection.connectionName || connection.name || `Connection ${connection.connectionId}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className='playbook-designer__header-actions'>
          {!isViewMode && (
            <button className='btn btn-outline-secondary btn-sm playbook-designer__btn' onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          )}
          <Link to='/qradar/playbooks/list' className='btn btn-light btn-sm playbook-designer__btn'>
            <i className='fas fa-arrow-left me-1' />
            Back
          </Link>
        </div>
      </div>

      <div className='playbook-designer__body'>
        {!isViewMode && <Sidebar actions={actions} loading={actionsLoading} />}
        <div className='playbook-designer__canvas-wrap'>
          <div className='playbook-designer__canvas' ref={reactFlowWrapper}>
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setRfInstance}
                onDrop={onDrop}
                onDragOver={(event) => {
                  event.preventDefault()
                  event.dataTransfer.dropEffect = 'move'
                }}
                onNodeClick={(_, node) => setSelectedNode(node)}
                onPaneClick={() => setSelectedNode(null)}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                fitView
                snapToGrid
                snapGrid={[15, 15]}
                deleteKeyCode={isViewMode ? null : 'Delete'}
                nodesDraggable={!isViewMode}
                nodesConnectable={!isViewMode}
                elementsSelectable
              >
                <Controls position='top-right' />
                {/* <MiniMap /> */}
                <Background color='#e5e7eb' gap={20} />
              </ReactFlow>
            </ReactFlowProvider>
          </div>
          {selectedNode && (
            <div className='playbook-designer__bottom-panel'>
              <div className='playbook-designer__bottom-content'>
                <div className='playbook-designer__bottom-section'>
                  <div className='playbook-designer__bottom-section-title'>Parameters</div>
                  <div className='playbook-designer__table-wrap'>
                    <table className='playbook-designer__table'>
                      <thead>
                        <tr>
                          <th>Parameter Name</th>
                          <th>Value Source</th>
                          <th>Parameter Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nodeParams.map((parameter, index) => (
                          <tr key={parameter.actionParameterId || index}>
                            <td>
                              <input
                                type='text'
                                className='form-control form-control-sm'
                                value={parameter.actionParameterName || parameter.parameterName || ''}
                                onChange={(event) => handleParamChange(index, 'actionParameterName', event.target.value)}
                                disabled={isViewMode}
                              />
                            </td>
                            <td>
                              <select
                                className='form-select form-select-sm'
                                value={parameter.valueSource || 'Static'}
                                onChange={(event) => handleParamChange(index, 'valueSource', event.target.value)}
                                disabled={isViewMode}
                              >
                                <option value='Static'>Static</option>
                                <option value='Dynamic'>Dynamic</option>
                              </select>
                            </td>
                            <td>
                              <input
                                type='text'
                                className='form-control form-control-sm'
                                value={parameter.parameterValue || ''}
                                onChange={(event) => handleParamChange(index, 'parameterValue', event.target.value)}
                                disabled={isViewMode}
                              />
                            </td>
                          </tr>
                        ))}
                        {nodeParams.length === 0 && (
                          <tr>
                            <td colSpan={3} className='text-center text-muted py-3'>No parameters added.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {!isViewMode && (
                    <button className='btn btn-sm btn-outline-primary mt-2' onClick={addParam}>
                      <i className='fas fa-plus me-1' /> Add Parameter
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedNode && (
          <div className='playbook-designer__props-panel'>
            <div className='playbook-designer__props-header'>
              <div className='playbook-designer__props-node-icon'>
                <i
                  className={
                    selectedNode.type === 'startNode'
                      ? 'fas fa-play'
                      : selectedNode.type === 'endNode'
                      ? 'fas fa-stop'
                      : 'fas fa-bolt'
                  }
                />
              </div>
              <div>
                <div className='playbook-designer__props-node-name'>
                  {currentProps.nodeName || selectedNode.data?.label || 'Node'}
                </div>
                <div className='playbook-designer__props-node-type'>
                  {selectedNode.type === 'startNode'
                    ? 'Start'
                    : selectedNode.type === 'endNode'
                    ? 'End'
                    : 'Action'}
                </div>
              </div>
              {!isViewMode && (
                <button type='button' className='btn btn-sm btn-outline-danger ms-auto' onClick={removeSelectedNode} title='Delete node'>
                  <i className='fas fa-trash' />
                </button>
              )}
            </div>
            <div className='playbook-designer__props-body'>
              <div className='playbook-designer__props-field'>
                <label className='playbook-designer__props-label'>
                  Node Name <span className='text-danger'>*</span>
                </label>
                <input
                  className='form-control form-control-sm'
                  value={currentProps.nodeName || ''}
                  onChange={(event) => handleNodeNameChange(event.target.value)}
                  disabled={isViewMode}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export {UpdatePlaybooks}
