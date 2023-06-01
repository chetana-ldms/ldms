import React, {useCallback, useRef, useState} from 'react'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {Container, Form, Button} from 'react-bootstrap'
import axios from 'axios'
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
import {ToastContainer, toast} from 'react-toastify'

import CustomNode from '../playbooks/CustomNode'

import {Link, useNavigate} from 'react-router-dom'
import 'reactflow/dist/style.css'
import '../playbooks/overview.css'
import './custom_class_for_nodes.scss'
import Sidebar from '../playbooks/Sidebar'
import {DemoSMS} from './DemoSMS'

// DND Start
let id = 13
const getId = () => `dndnode_${id++}`
// DND End
const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance)
const DemoPlaybooks = () => {
  const navigate = useNavigate()
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
    // setLoading(true)
    // setTimeout(() => {
    //   navigate('/qradar/demo/v2')
    //   // navigate('/qradar/demoalert/updated')
    // }, 3000)
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

  // const onSubmit = async (e) => {
  //   await e.preventDefault()
  //   const requestOptions = {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     body: new URLSearchParams({
  //       To: number,
  //       From: '+15855172328',
  //       Body: body,
  //     }),
  //   }

  //   fetch(apiUrl, requestOptions)
  //     .then((response) => response.json())
  //     .then((data) => console.log(data))
  //     .then((response) => {
  //       setMessage('Message sent successfully.')
  //     })
  // }

  return (
    <>
      <ToastContainer />
      <div className='card-header border-0'></div>
      <div className='card mb-5 mb-xl-8 demo-playbook'>
        <DemoSMS />
        <div className='row'>
          <div className='col-lg-3'>
            <div className='card-body highlight'>
              <div className='col'>
                <div onClick={executePlaybooks} className='btn btn-danger btn-sm mb-1 dndnode'>
                  {/* <i className='fas fa-arrow-right'></i> */}
                  <span className='fs-14'> Save</span>
                </div>
                <br />
                <br />
                <div
                  className='btn btn1 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Qradar Offences')}
                  draggable
                >
                  {/* <i className='fas fa-search'></i> */}
                  <span> Qradar Offences</span>
                </div>
                <div
                  className='btn btn-secondary btn-sm mb-1 dndnode'
                  onDragStart={(event) =>
                    onDragStart(event, 'Check for HostName IP Address SQL* 192.168.144 X')
                  }
                  draggable
                >
                  {/* <i className='fas fa-search'></i> */}
                  <span> Check HostName</span>
                </div>
                <div
                  className='btn btn2 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Check for Connection')}
                  draggable
                >
                  {/* <i className='fas fa-search'></i> */}
                  <span> Check for Connection</span>
                </div>
                <div
                  className='btn btn3 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'CDC Out')}
                  draggable
                >
                  {/* <i className='fas fa-search'></i> */}
                  <span> CDC Out</span>
                </div>
                <div
                  className='btn btn4 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Create Incident')}
                  draggable
                >
                  {/* <i className='fas fa-search'></i> */}
                  <span> Create Incident</span>
                </div>
                <div
                  className='btn btn5 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'DBA Admin')}
                  draggable
                >
                  {/* <i className='fas fa-search'></i> */}
                  <span> DBA Admin</span>
                </div>
                <div
                  className='btn btn6 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Service Now')}
                  draggable
                >
                  {/* <i className='fas fa-file-signature'></i> */}
                  <span> Service Now</span>
                </div>
                <div
                  className='btn btn7 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Run Tripwire FIM Scan')}
                  draggable
                >
                  {/* <i className='fas fa-file-signature'></i> */}
                  <span> Run Tripwire FIM Scan</span>
                </div>
                <div
                  className='btn btn8 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'CDC Query')}
                  draggable
                >
                  {/* <i className='fas fa-search'></i> */}
                  <span> CDC Query</span>
                </div>
                <div
                  className='btn btn1 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Thread Crowd')}
                  draggable
                >
                  {/* <i className='fas fa-at'></i> */}
                  <span>Thread Crowd</span>
                </div>
                <div
                  className='btn btn2 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Virus Total')}
                  draggable
                >
                  {/* <i className='fas fa-code'></i> */}
                  <span> Virus Total</span>
                </div>
                <div
                  className='btn btn3 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, ' SkyBox Firewall Changes')}
                  draggable
                >
                  {/* <i className='fas fa-code-branch'></i> */}
                  <span> SkyBox Firewall Changes</span>
                </div>
                <div
                  className='btn btn4 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Firewwall ACL Block')}
                  draggable
                >
                  {/* <i className='fas fa-fill'></i> */}
                  <span> Firewwall ACL Block</span>
                </div>
                <div
                  className='btn btn5 btn-sm mb-1 dndnode'
                  onDragStart={(event) => onDragStart(event, 'Block IP')}
                  draggable
                >
                  {/* <i className='fas fa-fill'></i> */}
                  <span> Block IP</span>
                </div>
              </div>
            </div>
          </div>
          <div className='col-lg-9'>
            <div className='' style={{height: '100%'}}>
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

export {DemoPlaybooks}
