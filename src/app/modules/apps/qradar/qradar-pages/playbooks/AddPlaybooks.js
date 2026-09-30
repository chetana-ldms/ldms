import React, {useCallback, useRef, useState, useEffect} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

import Sidebar from './Sidebar'
import {StartNode, EndNode, ActionNode} from './CustomNode'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchRuleActions} from '../../../../../api/ConfigurationApi'
import {fetchConnectionSearchUrl} from '../../../../../api/ConnectionApi'
import {fetchGET_ACTION_PARAMETERS_URL} from '../../../../../api/ScriptsApi'
import {fetchplayBooksCreateUrl} from '../../../../../api/playBookApi'
import {fetchGetPlaybooksUrl} from '../../../../../api/AlertFieldsApi'
import {useErrorBoundary} from 'react-error-boundary'
import './playbook.css'

// ── Node type registry ──────────────────────────────────────────────────────
const nodeTypes = {
  startNode: StartNode,
  endNode: EndNode,
  actionNode: ActionNode,
}

// ── Edge default style ──────────────────────────────────────────────────────
const defaultEdgeOptions = {
  style: {strokeWidth: 2, stroke: '#b1b1b7'},
  markerEnd: {type: MarkerType.ArrowClosed, color: '#b1b1b7'},
}

// ── Unique id generator ─────────────────────────────────────────────────────
let nodeIdCounter = 1
const getNewId = () => `node_${nodeIdCounter++}`

// ═══════════════════════════════════════════════════════════════════════════
const AddPlaybooks = () => {
  const handleError = useErrorBoundary()
  const location = useLocation()
  const navigate = useNavigate()

  const orgId = Number(sessionStorage.getItem('orgId') || 0)
  const toolId = Number(sessionStorage.getItem('toolID') || 0)
  const userId = Number(sessionStorage.getItem('userId') || 0)

  // ── Meta fields ─────────────────────────────────────────────────────────
  const [playbookName, setPlaybookName] = useState(location.state?.playbookName || '')
  const [playbookId, setPlaybookId] = useState(String(location.state?.playbookId || ''))
  const [connectionId, setConnectionId] = useState('')

  // ── API data ─────────────────────────────────────────────────────────────
  const [actions, setActions] = useState([])
  const [playbooks, setPlaybooks] = useState([])
  const [connections, setConnections] = useState([])
  const [actionsLoading, setActionsLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // ── ReactFlow state ──────────────────────────────────────────────────────
  const reactFlowWrapper = useRef(null)
  const [rfInstance, setRfInstance] = useState(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // ── Selected node & properties panel ────────────────────────────────────
  const [selectedNode, setSelectedNode] = useState(null)

  // Per-node properties stored by nodeId
  const [nodeProps, setNodeProps] = useState({})

  // Parameters for the selected node (fetched from API or user-added)
  const [nodeParams, setNodeParams] = useState([])

  // ── Fetch Action Master & Connections on mount ──────────────────────────
  useEffect(() => {
    const load = async () => {
      setActionsLoading(true)
      try {
        const [actRes, playbookRes, connectionRes] = await Promise.allSettled([
          fetchRuleActions({orgId, toolId, active: true}),
          fetchGetPlaybooksUrl({searchtext: ''}),
          fetchConnectionSearchUrl({searchText: ''}),
        ])

        if (actRes.status === 'fulfilled' && actRes.value) {
          setActions(Array.isArray(actRes.value.actions) ? actRes.value.actions : [])
        }

        if (playbookRes.status === 'fulfilled' && playbookRes.value) {
          const list = Array.isArray(playbookRes.value.data) ? playbookRes.value.data : []
          setPlaybooks(list)
          const selected = list.find(
            (playbook) => String(playbook.playbookId) === String(location.state?.playbookId)
          ) || list[0]
          if (selected) {
            setPlaybookId(String(selected.playbookId))
            setPlaybookName(selected.playbookName || selected.playBookName || '')
          }
        }

        if (connectionRes.status === 'fulfilled' && connectionRes.value) {
          const response = connectionRes.value
          const list = Array.isArray(response)
            ? response
            : Array.isArray(response.connections)
            ? response.connections
            : Array.isArray(response.data)
            ? response.data
            : []
          setConnections(list)
        }
      } catch (err) {
        console.error('Error loading playbook designer data', err)
      } finally {
        setActionsLoading(false)
      }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── When selected node changes, load its persisted props & params ────────
  useEffect(() => {
    if (!selectedNode) {
      setNodeParams([])
      return
    }
    const saved = nodeProps[selectedNode.id] || {}
    setNodeParams(saved.parameters || [])

    // If the node has an actionId, fetch parameters from API
    const actionId = saved.actionId || selectedNode.data?.actionId || 0
    if (actionId && (!saved.parameters || saved.parameters.length === 0)) {
      fetchGET_ACTION_PARAMETERS_URL({actionId})
        .then((res) => {
          if (res) {
            const params = Array.isArray(res)
              ? res
              : Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res?.actionParameters)
              ? res.actionParameters
              : []
            const mapped = params.map((p) => ({
              actionParameterId: p.actionParameterId || p.id || 0,
              parameterName: p.parameterName || p.name || '',
              parameterValue: '',
              valueSource: 'Static',
              active: true,
            }))
            setNodeParams(mapped)
            updateNodeProp(selectedNode.id, 'parameters', mapped)
          }
        })
        .catch(() => {})
    }
  }, [selectedNode]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helper: persist a node property ─────────────────────────────────────
  const updateNodeProp = useCallback((nodeId, field, value) => {
    setNodeProps((prev) => ({
      ...prev,
      [nodeId]: {...(prev[nodeId] || {}), [field]: value},
    }))
  }, [])

  // ── ReactFlow callbacks ──────────────────────────────────────────────────
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({...params, ...defaultEdgeOptions}, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
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

      const newId = getNewId()
      const newNode = {
        id: newId,
        type: nodeData.type,
        position,
        data: {
          label: nodeData.label,
          actionId: nodeData.actionId || 0,
        },
      }

      setNodes((nds) => nds.concat(newNode))

      // Initialise node props
      setNodeProps((prev) => ({
        ...prev,
        [newId]: {
          nodeName: nodeData.label,
          actionId: nodeData.actionId || 0,
          active: true,
          parameters: [],
          connections: [],
        },
      }))
    },
    [rfInstance, setNodes]
  )

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

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

  // ── Node property field change ───────────────────────────────────────────
  const handlePropChange = (field, value) => {
    if (!selectedNode) return
    updateNodeProp(selectedNode.id, field, value)

    // Also update node label if name changed
    if (field === 'nodeName') {
      setNodes((nds) =>
        nds.map((n) => (n.id === selectedNode.id ? {...n, data: {...n.data, label: value}} : n))
      )
    }
  }

  const currentProps = selectedNode ? nodeProps[selectedNode.id] || {} : {}

  // ── Parameter row changes ────────────────────────────────────────────────
  const handleParamChange = (idx, field, value) => {
    const updated = nodeParams.map((p, i) => (i === idx ? {...p, [field]: value} : p))
    setNodeParams(updated)
    updateNodeProp(selectedNode.id, 'parameters', updated)
  }

  const addParam = () => {
    const newParam = {
      actionParameterId: 0,
      parameterName: '',
      parameterValue: '',
      valueSource: 'Static',
      active: true,
    }
    const updated = [...nodeParams, newParam]
    setNodeParams(updated)
    updateNodeProp(selectedNode.id, 'parameters', updated)
  }

  // ── Connection row changes ───────────────────────────────────────────────
  // ── Build & Save payload ─────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!playbookName.trim()) {
      notifyFail('Please enter a Playbook Name')
      return
    }

    setSaving(true)
    try {
      // Sort nodes top-to-bottom for nodeOrder
      const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y)

      const nodePayload = sortedNodes.map((node, index) => {
        const props = nodeProps[node.id] || {}
        return {
          nodeName: props.nodeName || node.data.label || `Node ${index + 1}`,
          nodeOrder: index + 1,
          actionId: props.actionId || node.data.actionId || null,
          positionX: Number(node.position?.x || 0),
          positionY: Number(node.position?.y || 0),
          positionZ: Number(node.position?.z || 0),
          parameters: (props.parameters || []).map((p) => ({
            actionParameterId: p.actionParameterId || 0,
            parameterValue: p.parameterValue || '',
            valueSource: p.valueSource || 'Static',
          })),
          connections: [],
        }
      })

      const payload = {
        playbookId: Number(playbookId),
        connectionId: Number(connectionId) || 0,
        nodes: nodePayload,
        userId: userId,
      }

      const result = await fetchplayBooksCreateUrl(payload)
      if (result?.isSuccess) {
        notify('Playbook saved successfully!')
        navigate('/qradar/playbooks/list')
      } else {
        notifyFail(result?.message || 'Failed to save Playbook')
      }
    } catch (err) {
      handleError(err)
      notifyFail('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }, [playbookId, playbookName, connectionId, nodes, nodeProps, userId, navigate, handleError])

  // ── Action name lookup ───────────────────────────────────────────────────
  const getActionName = (actionId) => {
    if (!actionId) return ''
    const found = actions.find((a) => a.actionId === Number(actionId))
    return found ? found.actionName || found.name || '' : ''
  }

  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div className='playbook-designer'>
      <ToastContainer />
      {/* ── Top Header Bar ── */}
      <div className='playbook-designer__header'>
        <div className='playbook-designer__header-left'>
          <div className='playbook-designer__breadcrumb'>
            <Link to='/qradar/playbooks/list' className='playbook-designer__breadcrumb-link'>
              Playbook
            </Link>
            <span className='playbook-designer__breadcrumb-sep'>&rsaquo;</span>
            <span className='playbook-designer__breadcrumb-current'>Playbook Designer</span>
          </div>
          <div className='playbook-designer__title-row'>
            <h2 className='playbook-designer__title'>Playbook Designer</h2>
            <div className='playbook-designer__meta-field playbook-designer__meta-field--inline'>
              <label className='playbook-designer__meta-label'>Playbook Name</label>
              <select
                className='playbook-designer__meta-input'
                value={playbookId}
                onChange={(event) => {
                  const selected = playbooks.find(
                    (playbook) => String(playbook.playbookId) === event.target.value
                  )
                  setPlaybookId(event.target.value)
                  setPlaybookName(selected?.playbookName || selected?.playBookName || '')
                }}
              >
                <option value='' disabled>Select playbook</option>
                {playbooks.map((playbook) => (
                  <option key={playbook.playbookId} value={playbook.playbookId}>
                    {playbook.playbookName || playbook.playBookName}
                  </option>
                ))}
              </select>
            </div>
            <div className='playbook-designer__meta-field playbook-designer__meta-field--inline'>
              <label className='playbook-designer__meta-label'>Connection</label>
              <select
                className='playbook-designer__meta-input'
                value={connectionId}
                onChange={(event) => setConnectionId(event.target.value)}
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
          <button
            className='btn btn-outline-secondary btn-sm playbook-designer__btn'
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <span className='spinner-border spinner-border-sm me-1' />
            ) : (
              <i className='fas fa-save me-1' />
            )}
            Save
          </button>
          <Link to='/qradar/playbooks/list' className='btn btn-light btn-sm playbook-designer__btn'>
            <i className='fas fa-arrow-left me-1' />
            Back
          </Link>
        </div>
      </div>

      {/* ── Meta Bar ── */}
      {/* ── Main 3-column layout ── */}
      <div className='playbook-designer__body'>
        {/* LEFT: Sidebar */}
        <Sidebar actions={actions} loading={actionsLoading} />

        {/* CENTRE: Canvas */}
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
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                fitView
                snapToGrid
                snapGrid={[15, 15]}
                deleteKeyCode='Delete'
              >
                <Controls position='top-right' />
                {/* <MiniMap
                  nodeColor={(n) => {
                    if (n.type === 'startNode') return '#22c55e'
                    if (n.type === 'endNode') return '#ef4444'
                    return '#3b82f6'
                  }}
                  style={{bottom: 10, right: 10}}
                /> */}
                <Background color='#e5e7eb' gap={20} />
              </ReactFlow>
            </ReactFlowProvider>
          </div>

          {/* Parameters */}
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
                          {nodeParams.map((p, i) => (
                            <tr key={i}>
                              <td>
                                <input
                                  type='text'
                                  className='form-control form-control-sm'
                                  value={p.parameterName}
                                  onChange={(e) =>
                                    handleParamChange(i, 'parameterName', e.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <select
                                  className='form-select form-select-sm'
                                  value={p.valueSource}
                                  onChange={(e) =>
                                    handleParamChange(i, 'valueSource', e.target.value)
                                  }
                                >
                                  <option value='Static'>Static</option>
                                  <option value='Dynamic'>Dynamic</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type='text'
                                  className='form-control form-control-sm'
                                  value={p.parameterValue}
                                  onChange={(e) =>
                                    handleParamChange(i, 'parameterValue', e.target.value)
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                          {nodeParams.length === 0 && (
                            <tr>
                              <td colSpan={3} className='text-center text-muted py-3'>
                                No parameters added.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <button className='btn btn-sm btn-outline-primary mt-2' onClick={addParam}>
                      <i className='fas fa-plus me-1' />
                      Add Parameter
                    </button>
                  </div>

              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Node Properties Panel */}
        {selectedNode && (
          <div className='playbook-designer__props-panel'>
              {/* Props header */}
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
                <button
                  type='button'
                  className='btn btn-sm btn-outline-danger ms-auto'
                  title='Delete node'
                  onClick={removeSelectedNode}
                >
                  <i className='fas fa-trash' />
                </button>
              </div>

              {/* General tab */}
                <div className='playbook-designer__props-body'>
                  <div className='playbook-designer__props-field'>
                    <label className='playbook-designer__props-label'>
                      Node Name <span className='text-danger'>*</span>
                    </label>
                    <input
                      type='text'
                      className='form-control form-control-sm'
                      value={currentProps.nodeName || ''}
                      onChange={(e) => handlePropChange('nodeName', e.target.value)}
                    />
                  </div>

                </div>
          </div>
        )}
      </div>
    </div>
  )
}

export {AddPlaybooks}
