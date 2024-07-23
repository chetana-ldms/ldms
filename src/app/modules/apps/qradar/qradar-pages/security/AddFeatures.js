import React, {useEffect, useRef, useState} from 'react'
import {useErrorBoundary} from 'react-error-boundary'
import {Link, useNavigate} from 'react-router-dom'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchLDPToolsUrl, fetchOrganizationAddUrl} from '../../../../../api/ConfigurationApi'
import {ToastContainer} from 'react-toastify'
import {
  fetchActionsUrl,
  fetchFeaturesAddUrl,
  fetchFeaturesUrl,
  fetchOrganizationToolsSecurityUrl,
} from '../../../../../api/securityApi'
import {fetchOrganizations} from '../../../../../api/Api'

function AddFeatures() {
  const handleError = useErrorBoundary()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [tools, setTools] = useState([])
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [parentFeatures, setParentFeatures] = useState([])
  const [actions, setActions] = useState([])
  const [organizationList, setOrganizationList] = useState([])
  const [selectedOrganizations, setSelectedOrganizations] = useState([])
  console.log(organizationList, 'organizationList')
  const [selectedTool, setSelectedTool] = useState(null)
  const [selectedParentFeatures, setSelectedParentFeatures] = useState(null)
  const [isSubFeature, setIsSubFeature] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [selectAllOrg, setSelectAllOrg] = useState(false)
  const toolRef = useRef()
  const SubFeatureExistsRef = useRef()
  const parentFeaturesRef = useRef()
  const featureNameRef = useRef()
  const displayNameRef = useRef()
  const routePathRef = useRef()
  const imagePathRef = useRef()
  const handleToolChange = (e) => {
    const newToolId = Number(e.target.value)
    setSelectedTool(newToolId)
  }
  const handleToolChangeParentFeatures = (e) => {
    const newParentFeatures = Number(e.target.value)
    setSelectedParentFeatures(newParentFeatures)
  }
  useEffect(() => {
    const reload = async () => {
      try {
        const data = await fetchLDPToolsUrl()
        setTools(data)
      } catch (error) {
        console.log(error)
      }
    }
      reload()
  }, [])

  useEffect(() => {
    const fetchDataFeatures = async () => {
      try {
        const data = {
          orgId: orgId,
          toolId: selectedTool || 0,
          featureId: 0,
          parentFeatures: true,
        }
        const featureResponse = await fetchFeaturesUrl(data)
        setParentFeatures(featureResponse)
      } catch (error) {
        console.log(error)
      }
    }
    fetchDataFeatures()
  }, [selectedTool])
  useEffect(() => {
    const fetchActions = async () => {
      try {
        const data = {
          toolId: selectedTool || 0,
        }
        const featureResponse = await fetchActionsUrl(data)
        setActions(featureResponse)
      } catch (error) {
        console.log(error)
      }
    }
    fetchActions()
  }, [selectedTool])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizationsResponse = await fetchOrganizations()
        setOrganizationList(organizationsResponse)
      } catch (error) {
        handleError(error)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    const createdUserId = Number(sessionStorage.getItem('userId'))
    const createdDate = new Date().toISOString()

    const actionIds = actions.filter(action => action.is_authorized).map(action => action.actionId)
    const orgIds = selectedOrganizations.map(index => organizationList[index].orgID)
    
    if (!featureNameRef.current.value) {
      notifyFail('Enter Name')
      setLoading(false)
      return
    }
    if (!displayNameRef.current.value) {
      notifyFail('Enter Display Name')
      setLoading(false)
      return
    }
    if (!routePathRef.current.value) {
      notifyFail('Enter Route Path')
      setLoading(false)
      return
    }
    if (!imagePathRef.current.value) {
      notifyFail('Enter Image Path')
      setLoading(false)
      return
    }

    if (actionIds.length === 0) {
      notifyFail("At least one action must be selected.");
      setLoading(false);
      return;
    }

    const data = {
      createdUserId,
      createdDate,
      featureName: featureNameRef.current.value,
      featureDisplayName: displayNameRef.current.value,
      parentFeatureId: parentFeaturesRef.current.value || 0,
      toolId: toolRef.current.value || 0,
      subfeatureExists: SubFeatureExistsRef.current.checked ? 1 : 0,
      featureUrl: routePathRef.current.value,
      featureImageUrl: imagePathRef.current.value,
      actionIds: actionIds,
      orgIds: orgIds,
    }

    try {
      const responseData = await fetchFeaturesAddUrl(data)
      const {isSuccess, message} = responseData

      if (isSuccess) {
        notify(message)
        setTimeout(() => {
          navigate('/qradar/features/list')
        }, 2000)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }
  const handleCheckboxChange = (index) => {
    const updatedActions = [...actions]
    updatedActions[index].is_authorized = !updatedActions[index].is_authorized
    setActions(updatedActions)

    if (updatedActions.every((organizationList) => organizationList.is_authorized)) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }
  const handleCheckboxChangeOrg = (index) => {
    const selected = [...selectedOrganizations]
    if (selected.includes(index)) {
      const updatedSelection = selected.filter((item) => item !== index)
      setSelectedOrganizations(updatedSelection)
      setSelectAllOrg(updatedSelection.length === organizationList.length)
    } else {
      selected.push(index)
      setSelectedOrganizations(selected)
      setSelectAllOrg(selected.length === organizationList.length)
    }
  }

  const handleSelectAllChange = () => {
    const updatedSelectAll = !selectAll
    setSelectAll(updatedSelectAll)

    const updatedActions = actions.map((action) => ({
      ...action,
      is_authorized: updatedSelectAll,
    }))
    setActions(updatedActions)
  }
  const handleSelectAllChangeOrg = () => {
    const updatedSelectAllOrg = !selectAllOrg
    setSelectAllOrg(updatedSelectAllOrg)

    if (updatedSelectAllOrg) {
      const allIndexes = organizationList.map((_, index) => index)
      setSelectedOrganizations(allIndexes)
    } else {
      setSelectedOrganizations([])
    }
  }
  return (
    <div className='config card'>
      <ToastContainer />
      <div className='card-header bg-heading'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='white'>Add New Feature</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/features/list' className='white fs-15 text-underline'>
              <i className='fa fa-chevron-left white mg-right-5' />
              Back
            </Link>
          </div>
        </div>
      </div>
      <form>
        <div className='card-body pad-10'>
          <div className='row mb-6 table-filter'>
            <h2 className='border-bottom border-2'>Feature Master</h2>
            <div className='col-lg-3 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='Name' className='form-label fs-6 fw-bolder mb-3'>
                  Name
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  required
                  maxLength={200}
                  id='Name'
                  ref={featureNameRef}
                  placeholder=''
                />
              </div>
            </div>
            <div className='col-lg-3 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='DisplayName' className='form-label fs-6 fw-bolder mb-3'>
                  Display Name
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  required
                  maxLength={200}
                  id='DisplayName'
                  ref={displayNameRef}
                  placeholder=''
                />
              </div>
            </div>
            <div className='col-lg-3 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='RoutePath' className='form-label fs-6 fw-bolder mb-3'>
                  Route Path
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  required
                  maxLength={200}
                  id='RoutePath'
                  ref={routePathRef}
                  placeholder=''
                />
              </div>
            </div>
            <div className='col-lg-3 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='ImagePath' className='form-label fs-6 fw-bolder mb-3'>
                  Image Path
                </label>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  required
                  maxLength={200}
                  id='ImagePath'
                  ref={imagePathRef}
                  placeholder=''
                />
              </div>
            </div>
            <div className='col-lg-3 mb-4 mb-lg-0'>
              <div className='row mt-10'>
                <div className='col-md-3'>
                  <input
                    type='checkbox'
                    id='SubFeatureExists'
                    className='Psecume-2'
                    ref={SubFeatureExistsRef}
                    checked={isSubFeature}
                    onChange={() => setIsSubFeature(!isSubFeature)}
                  />
                </div>
                <div className=' col-md-9'>
                  <label htmlFor='SubFeatureExists' className='form-label fs-6 fw-bolder'>
                    Sub Feature Exists
                  </label>
                </div>
              </div>
            </div>
            <div className='col-lg-3 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='Tools' className='form-label fs-6 fw-bolder w-70px mt-3'>
                  Tools:
                </label>
                <select
                  className='form-select form-select-solid bg-blue-light'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  ref={toolRef}
                  onChange={handleToolChange}
                >
                  <option value=''>Select</option>
                  {tools !== null &&
                    tools?.map((item, index) => (
                      <option key={index} value={item.toolId}>
                        {item.toolName}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className='col-lg-3 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='Parent Features' className='form-label fs-6 fw-bolder w-200px mt-3'>
                  Parent Features:
                </label>
                <select
                  className='form-select form-select-solid bg-blue-light'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  ref={parentFeaturesRef}
                  onChange={handleToolChangeParentFeatures}
                >
                  <option value=''>Select</option>
                  {parentFeatures !== null &&
                    parentFeatures?.map((item, index) => (
                      <option key={index} value={item.featureId}>
                        {item.featureName}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <hr />
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <div className='card border border-2'>
              <div className='card-body p-3' style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {actions && actions.length > 0 ? (
                  <>
                    <div className='form-check ms-5'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='select-all-checkbox'
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                      />
                      <label className='form-check-label' htmlFor='select-all-checkbox'>
                        Select All Actions
                      </label>
                    </div>
                    <hr />
                    <ul className='list-group list-group-flush ps-2 ms-5'>
                      {actions.map((action, index) => (
                        <li key={index} className='list-group-item'>
                          <div className='form-check'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`action-checkbox-${index}`}
                              checked={action.is_authorized}
                              onChange={() => handleCheckboxChange(index)}
                            />
                            <label
                              className='form-check-label'
                              htmlFor={`action-checkbox-${index}`}
                            >
                              {action.actionDisplayName}
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div>No Data Found</div>
                )}
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='card border border-2'>
              <div className='card-body p-3'>
                {organizationList && organizationList.length > 0 ? (
                  <>
                    <div className='form-check ms-5'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='select-all-org-checkbox'
                        checked={selectAllOrg}
                        onChange={handleSelectAllChangeOrg}
                      />
                      <label className='form-check-label' htmlFor='select-all-org-checkbox'>
                        Select All Organizations
                      </label>
                    </div>
                    <hr />
                    <ul className='list-group list-group-flush ps-2 ms-5'>
                      {organizationList.map((item, index) => (
                        <li key={index} className='list-group-item'>
                          <div className='form-check'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`org-checkbox-${index}`}
                              checked={selectedOrganizations.includes(index)}
                              onChange={() => handleCheckboxChangeOrg(index)}
                            />
                            <label className='form-check-label' htmlFor={`org-checkbox-${index}`}>
                              {item.orgName}
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div>No Data Found</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='card-footer d-flex justify-content-end pad-10'>
          <button type='submit' onClick={handleSubmit} className='btn btn-new btn-small'>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddFeatures
