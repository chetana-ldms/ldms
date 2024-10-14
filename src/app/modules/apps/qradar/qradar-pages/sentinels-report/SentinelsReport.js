import React, {useEffect, useRef, useState} from 'react'
import {Button, Accordion, Card} from 'react-bootstrap'
import ReportTaskModal from './ReportTaskModal'
import {ToastContainer} from 'react-toastify'
import {useErrorBoundary} from 'react-error-boundary'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import Pagination from '../../../../../../utils/Pagination'
import {
  fetchSentinelReportDeleteUrl,
  fetchSentinelReportsDownloadUrl,
  fetchSentinelReportsTasksUrl,
  fetchSentinelReportsUrl,
} from '../../../../../api/SentinelsReportApi'
import {truncateText} from '../../../../../../utils/TruncateText'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import useFeatureActions from '../configuration/useFeatureActions'
import DeleteConfirmation from '../../../../../../utils/DeleteConfirmation'
import {notify, notifyFail} from '../components/notification/Notification'
import {useNavigate} from 'react-router-dom'
import jsPDF from 'jspdf'

function SentinelsReport() {
  const navigate = useNavigate()
  const [expandedRow, setExpandedRow] = useState(null)
  const handleError = useErrorBoundary()
  const [tools, setTools] = useState([])
  const [tasks, setTasks] = useState([])
  const taskId = useRef()
  const [selectedNames, setSelectedNames] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedAlert, setselectedAlert] = useState([])
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false)
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [activePage, setActivePage] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const [loading, setLoading] = useState(false)
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))

  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }
  const reload = async () => {
    try {
      const data = {
        orgId: orgId,
        toolId: toolId,
        orgAccountStructureLevel: [
          {
            levelName: 'AccountId',
            levelValue: accountId || '',
          },
          {
            levelName: 'SiteId',
            levelValue: siteId || '',
          },
        ],
        reportTaskId: taskId.current.value || '',
      }
      setLoading(true)
      const response = await fetchSentinelReportsUrl(data)
      setTools(response.data)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }
  const handleSelectChange = () => {
    reload()
  }

  useEffect(() => {
    reload()
  }, [itemsPerPage])

  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = tools
    ? tools
        .filter((item) => item.name.toLowerCase().includes(filterValue.toLowerCase()))
        .slice(indexOfFirstItem, indexOfLastItem)
    : null
  const filteredList = filterValue
    ? tools.filter((item) => item.name.toLowerCase().includes(filterValue.toLowerCase()))
    : tools

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
    setActivePage(0)
  }

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
    setActivePage(selected.selected)
  }

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
    setCurrentPage(0)
    setActivePage(0)
  }

  const handleselectedAlert = (item, e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setselectedAlert([...selectedAlert, value]); 
      setSelectedNames([...selectedNames, item.name]); 
      setIsCheckboxSelected(true);
    } else {
      const updatedAlert = selectedAlert.filter((id) => id !== value);
      const updatedNames = selectedNames.filter((name) => name !== item.name);
      setselectedAlert(updatedAlert); 
      setSelectedNames(updatedNames); 
      setIsCheckboxSelected(updatedAlert.length > 0);
    }
  };

  const handleDelete = () => {
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    if (selectedAlert) {
      const data = {
        orgId: orgId,
        toolId: toolId,
        ids: selectedAlert,
        name: selectedNames.join(','),
        deletedDate: new Date().toISOString(),
        deletedUserId: Number(sessionStorage.getItem('userId')),
      }

      try {
        const response = await fetchSentinelReportDeleteUrl(data)
        const {isSuccess, message} = response
        if (isSuccess) {
          notify(message)
          await reload()
          setIsCheckboxSelected(false)
          setselectedAlert([])
        } else {
          notifyFail(message)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setShowConfirmation(false)
      }
    }
  }
  const cancelDelete = () => {
    setShowConfirmation(false)
  }

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index)
  }
  const handleDownloadPdf = async (id) => {
    try {
      const data = {
        orgId: orgId, // Replace with actual orgId
        toolId: toolId, // Replace with actual toolId
        reportFormat: 'pdf',
        reportId: id,
      }

      const response = await fetchSentinelReportsDownloadUrl(data)

      if (response.isSuccess) {
        // const byteArray = response.byteArrayData; // Assuming this is a Uint8Array
        const convertByteArrayToString = (byteArray) => {
          const decoder = new TextDecoder('utf-8') // Specify the encoding if known, e.g., 'utf-8'
          return decoder.decode(byteArray)
        }

        // Example usage
        const byteArray = new Uint8Array(response.byteArrayData) // Represents "Hello"
        const stringString = convertByteArrayToString(byteArray)

        // Create a Blob from the byte array
        const blob = new Blob([stringString], {type: 'application/pdf'})

        // Generate a URL for the Blob and download it
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report_${id}.pdf` // Set the filename
        document.body.appendChild(a)
        a.click()

        // Cleanup: revoke the object URL and remove the anchor element
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error('Failed to download PDF:', response.statusText)
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
    }
  }

  const handleDownloadHtml = async (id) => {
    try {
      const data = {
        orgId: orgId,
        toolId: toolId,
        reportFormat: 'html',
        reportId: id,
      }

      const response = await fetchSentinelReportsDownloadUrl(data)

      if (response.isSuccess) {
        // Check if byteArrayData is a base64-encoded string
        let htmlContent
        if (typeof response.byteArrayData === 'string') {
          // Decode the base64-encoded string
          const decodedData = atob(response.byteArrayData) // atob decodes base64 to binary string
          // Convert binary string to a Uint8Array
          const bytes = new Uint8Array(decodedData.length)
          for (let i = 0; i < decodedData.length; i++) {
            bytes[i] = decodedData.charCodeAt(i)
          }
          // Convert Uint8Array to a string
          const decoder = new TextDecoder('utf-8')
          htmlContent = decoder.decode(bytes)
        } else {
          // Handle other cases if byteArrayData is not a string
          htmlContent = response.byteArrayData
        }

        // Create a Blob from the HTML content
        const blob = new Blob([htmlContent], {type: 'text/html'})

        // Generate a URL for the Blob and download it
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report_${id}.html`
        document.body.appendChild(a)
        a.click()

        // Cleanup the URL and remove the anchor element
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error('Failed to download HTML:', response.statusText)
      }
    } catch (error) {
      console.error('Error downloading HTML:', error)
    }
  }
  const reloadTask = async () => {
    try {
      const data = {
        orgId: orgId,
        toolId: toolId,
        scopeName: siteId ? 'SiteId' : 'AccountId',
        scopeValue: siteId || accountId,
      }
      setLoading(true)
      const response = await fetchSentinelReportsTasksUrl(data)
      setTasks(response.reportData)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reloadTask()
  }, [])
  const handleRefresh = (event) => {
    if (event) {
      event.preventDefault();
    }
    setIsRefreshing(true);
    setCurrentPage(0);
    setActivePage(0);
    reload();
    setTimeout(() => setIsRefreshing(false), 2000);
  };
  
  useEffect(() => {
    if (currentPage === 0) {
      const intervalId = setInterval(() => {
        handleRefresh();
      }, 10000); 
      return () => clearInterval(intervalId);
    }
  }, [currentPage]);

  return (
    <div className='card pad-10 config'>
      <ToastContainer />
      <div className='card-header no-pad'>
        <div className=' d-flex'>
          <div className='me-4'>
            <button
              className={`btn btn-green btn-small float-left ${
                !isCheckboxSelected || !isActionAuthorized('Delete') ? 'disabled' : ''
              }`}
              onClick={handleDelete}
              disabled={!isCheckboxSelected || !isActionAuthorized('Delete')}
            >
              Delete selection
            </button>
          </div>
          <div className='me-5'>
            <select
              className='form-select'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              id='toolId'
              ref={taskId}
              onChange={handleSelectChange}
            >
              <option value=''>Select Name</option>
              {tasks?.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className='ds-reload mt-2 ms-3 float-right'>
            <span className='fs-13 fc-gray' onClick={handleRefresh}>
              <i
                className={`fa fa-refresh link ${isRefreshing ? 'rotate' : ''}`}
                title='Auto refresh every 2 minutes'
              />
            </span>
          </div>
        </div>
        <div className='card-toolbar'>
          <div>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bold fs-3 mb-1'>
                Reports ({currentItems ? currentItems.length : 0} /{' '}
                {filteredList ? filteredList.length : 0})
              </span>
            </h3>
          </div>
        </div>
      </div>

      <div className='row mb-5 mt-2'>
        <div className='col-lg-12 header-filter'>
          <input
            type='text'
            placeholder='Search...'
            className='form-control'
            value={filterValue}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <div className='card-body no-pad'>
        <table className='table alert-table fixed-table scroll-x'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th></th>
              <th style={{width: 150}}>Date</th>
              <th>Name</th>
              <th>Scope</th>
              <th>Site Name</th>
              <th>Frequency</th>
              <th style={{width: 290}}>Interval</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}

            {currentItems !== null ? (
              currentItems.map((item, index) => (
                <React.Fragment key={index}>
                  <tr
                    className={`fs-12 table-row ${expandedRow === index ? 'expanded' : ''}`}
                    onClick={() => toggleRow(index)}
                  >
                    <td>
                      <div className='form-check form-check-sm form-check-custom form-check-solid px-3'>
                        <input
                          className='form-check-input widget-13-check'
                          type='checkbox'
                          checked={selectedAlert?.includes(item.id)}
                          value={item.id}
                          name={item.id}
                          onChange={(e) => handleselectedAlert(item, e)}
                          autoComplete='off'
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </td>
                    <td>{getCurrentTimeZone(item.toDate)}</td>
                    <td>{item.name}</td>
                    <td>{item.scope}</td>
                    <td className='wrap-txt'>{item.sites ? item.sites : 'N/A'}</td>
                    <td>{item.frequency ? item.frequency : 'N/A'}</td>
                    <td>
                      {getCurrentTimeZone(item.fromDate)} - {getCurrentTimeZone(item.toDate)}
                    </td>
                    <td>{item.status == 'success' ? 'Ready to Download' : item.status}</td>
                    <td>
                      {item.status === 'success' && (
                        <>
                          <span
                            className='me-3 link-txt'
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadPdf(item.id)
                            }}
                          >
                            DownloadPDF
                          </span>
                          <span
                            className='link-txt'
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadHtml(item.id)
                            }}
                          >
                            DownloadHTML
                          </span>
                        </>
                      )}
                    </td>
                  </tr>
                  {expandedRow === index && (
                    <tr className='accordion-content'>
                      <td colSpan='8 '>
                        <Card>
                          <Card.Body>
                            <div className='row'>
                              <div className='col-md-1'>
                                <p>Data</p>
                                <p>Creator</p>
                              </div>
                              <div className='col-md-8'>
                                <p>{item?.insightTypes[0]?.display_Name ? item?.insightTypes[0]?.display_Name : "N/A"}</p>
                                <p> {item?.creatorName}</p>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan='8' className='text-center'>
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {showConfirmation && (
          <DeleteConfirmation
            show={showConfirmation}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
        {tools && (
          <Pagination
            pageCount={Math.ceil(filteredList.length / itemsPerPage)}
            handlePageClick={handlePageClick}
            itemsPerPage={itemsPerPage}
            handlePageSelect={handlePageSelect}
            forcePage={activePage}
          />
        )}
      </div>
    </div>
  )
}

export default SentinelsReport
