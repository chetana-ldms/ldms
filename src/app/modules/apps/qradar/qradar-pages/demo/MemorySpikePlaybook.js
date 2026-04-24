import React, {useCallback, useRef, useState} from 'react'
import {UsersListLoading} from '../components/loading/UsersListLoading'
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

import {dndinitialNodes as initialNodes, edges as initialEdges} from './initial-elementsMemorySpike'
import {ToastContainer, toast} from 'react-toastify'
import 'reactflow/dist/style.css'
import '../playbooks/overview.css'
import './custom_class_for_nodes.scss'

// DND Start
let id = 100
const getId = () => `dndnode_${id++}`
// DND End
const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance)

export const MemorySpikePlaybook = () => {
  const [loading, setLoading] = useState(false)
  const reactFlowWrapper = useRef(null)
  const edgeUpdateSuccessful = useRef(true)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [])

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDragStart = (event, lable) => {
    event.dataTransfer.setData('application/reactflow', lable)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false
  }, [])

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true
    setEdges((els) => updateEdge(oldEdge, newConnection, els))
  }, [])

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id))
    }

    edgeUpdateSuccessful.current = true
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = 'default'
      const lable = event.dataTransfer.getData('application/reactflow')

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })
      const newNode = {
        id: getId(),
        type,
        lable,
        position,
        data: {label: `${lable}`},
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance],
    console.log('nodes', nodes),
    console.log('edges', edges)
  )
  const isLoading = false
  const executePlaybooks = () => {
    notify('Playbook saved.')
  }
  function notify(e) {
    toast.success(e, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    })
  }

  return (
    <>
      <ToastContainer />

      <div className='card mb-1 mt-1 demo-playbook pad-0'>
        <div className='row'>
          <div className='col-lg-3'>
            <div className='card-body bg-heading pad-10'>
              <div className='col'>
                <div onClick={executePlaybooks} className='btn btn-danger btn-sm mb-1 mt-5 dndnode'>
                  <span className='fs-14'> Save</span>
                </div>
                <br />
                <br />
                <div
                  className='btn btn1 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Alerts')}
                  draggable
                >
                  <span> Alerts</span>
                </div>
                <div
                  className='btn btn-secondary btn-sm mb-1 dndnode'
                  onDragStart={(event) =>
                    onDragStart(event, 'Check for HostName IP Address SQL* 192.168.144 X')
                  }
                  draggable
                >
                  <span> Check HostName</span>
                </div>
                <div
                  className='btn btn2 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Check for Connection')}
                  draggable
                >
                  <span> Check for Connection</span>
                </div>
                <div
                  className='btn btn3 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'LDC Out')}
                  draggable
                >
                  <span> LDC Out</span>
                </div>
                <div
                  className='btn btn4 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Create Incident')}
                  draggable
                >
                  <span> Create Incident</span>
                </div>
                <div
                  className='btn btn5 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'DBA Admin')}
                  draggable
                >
                  <span> DBA Admin</span>
                </div>
                {/* <div
                  className='btn btn6 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Service Now')}
                  draggable
                >
                  <span> Service Now</span>
                </div> */}
                <div
                  className='btn btn7 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Establish remote session')}
                  draggable
                >
                  <span> Establish remote session</span>
                </div>
                <div
                  className='btn btn8 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'LDC Query')}
                  draggable
                >
                  <span> LDC Query</span>
                </div>
                <div
                  className='btn btn1 btn-sm mb-1 dndnode'
                  onDragStart={(event) =>
                    onDragStart(event, 'Identify high memory consume process')
                  }
                  draggable
                >
                  <span>Identify high memory consume process</span>
                </div>
                <div
                  className='btn btn2 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'kill process')}
                  draggable
                >
                  <span>kill process</span>
                </div>
                <div
                  className='btn btn3 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Verify memory')}
                  draggable
                >
                  <span>Verify memory</span>
                </div>
                {/* <div
                  className='btn btn4 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Apply memory limits or optimize the app')}
                  draggable
                >
                  <span>Apply memory limits or optimize the app</span>
                </div> */}
                {/* <div
                  className='btn btn5 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Reboot')}
                  draggable
                >
                  <span>Reboot</span>
                </div> */}
                {/* <div
                  className='btn btn5 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Check Memory usage ')}
                  draggable
                >
                  <span>Check Memory usage </span>
                </div> */}
              </div>
            </div>
          </div>
          <div className='col-lg-9'>
            <div className='d-flex align-items-center justify-content-center gap-3'>
              <div className='w-50'>
                <table className='table table-bordered text-center mitre-table'>
                  <thead>
                    <tr style={{backgroundColor: '#6c757d', color: 'white'}}>
                      <th>Tactic</th>
                      <th>Technique</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{backgroundColor: '#f2f2f2'}}>
                      <td>Execution</td>
                      <td>T1059 - Command and Scripting Interpreter</td>
                    </tr>
                    <tr>
                      <td>Impact</td>
                      <td>T1499 - Endpoint Denial of Service</td>
                    </tr>
                    <tr style={{backgroundColor: '#f2f2f2'}}>
                      <td>Resource Development</td>
                      <td>T1496 - Resource Hijacking</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button className='btn btn-primary btn-small w-auto flex-shrink-0'>Map MITRE</button>
            </div>
            <div className='' style={{height: '70%'}}>
              {loading ? <UsersListLoading /> : ''}
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
                    <Controls />
                  </div>
                </ReactFlowProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
