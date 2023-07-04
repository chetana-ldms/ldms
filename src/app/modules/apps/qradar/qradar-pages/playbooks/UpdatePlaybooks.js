import React, {useCallback, useRef, useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import { notify, notifyFail } from '../components/notification/Notification';
import axios from 'axios'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import { fetchPlaybookByID } from '../../../../../api/playBookApi'
const flowKey = 'playbook_export'
const UpdatePlaybooks = () => {
  const navigate = useNavigate()
  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const playBookName = useRef()
  console.log(playBookName);
  const remarks = useRef()
  const errors = {}
  const [rulesData, setRulesData] = useState([])
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [playBookData, setPlayBookData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPlaybookByID(id, playBookName, remarks);
        console.log(data)
        setPlayBookData(data)
        // setToolTypeAction({
        //   ...toolTypeAction,
        //   ruleCatagoryID:data.ruleCatagoryID,
        //   ruleCatagoryName:data.ruleCatagoryName
        // });
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, [id, playBookName, remarks]);
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
      const modifiedUserId = Number(sessionStorage.getItem('userId'));
    const orgId = Number(sessionStorage.getItem('orgId'));
    const modifiedDate = new Date().toISOString();
      var data = JSON.stringify({
        alertCatogory: 'category_1',
        playBookName: playBookName.current.value,
        remarks: remarks.current.value,
        playBookID: id,
        orgId,
        modifiedDate,
        modifiedUserId,
        playbookDtls: rulesData,
      })

      var playbook_config = {
        method: 'post',
        url: 'http://115.110.192.133:8011/api/PlayBook/v1/Playbook/Update',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain',
        },
        data: data,
      }
      axios(playbook_config)
        .then(function (response) {
          const { isSuccess } = response.data;

          if (isSuccess) {
            notify('Data Updated');
            navigate('/qradar/playbooks/updated')
          } else {
            notifyFail('Failed to update data');
          }
          // console.log(JSON.stringify(response.data))
          // navigate('/qradar/playbooks/updated')
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    [reactFlowInstance]
  )
  return (
    <div className='card'>
      <UsersListLoading />
      <form>
      <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Update Playbooks</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/playbooks/list' className='btn btn-primary btn-small'>
              Back
            </Link>
          </div>
        </div>
      </div>
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
          {/* <div className='row'>
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
          </div> */}
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
    </div>
  )
}

export {UpdatePlaybooks}
