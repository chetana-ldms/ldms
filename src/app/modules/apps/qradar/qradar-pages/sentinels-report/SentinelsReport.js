import React, {useEffect, useState} from 'react'
import {Button, Accordion, Card} from 'react-bootstrap'
import ReportTaskModal from './ReportTaskModal'
import {ToastContainer} from 'react-toastify'
import {useErrorBoundary} from 'react-error-boundary'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import Pagination from '../../../../../../utils/Pagination'
import {
  fetchSentinelReportDeleteUrl,
  fetchSentinelReportsDownloadUrl,
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
  const handleOpenModal = () => {
    navigate(`/qradar/load-report-task/list`)
  }
  const handleError = useErrorBoundary()
  const [tools, setTools] = useState([])
  console.log(tools, 'tools')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedAlert, setselectedAlert] = useState([])
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false)
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [activePage, setActivePage] = useState(0)
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
    const {value, checked} = e.target
    if (checked) {
      setselectedAlert([...selectedAlert, value])
      setIsCheckboxSelected(true)
    } else {
      const updatedAlert = selectedAlert.filter((e) => e !== value)
      setselectedAlert(updatedAlert)
      setIsCheckboxSelected(updatedAlert.length > 0)
    }
  }

  const handleDelete = () => {
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    if (selectedAlert) {
      const data = {
        orgId: orgId,
        toolId: toolId,
        ids: selectedAlert,
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
        orgId: orgId,
        toolId: toolId,
        reportFormat: 'pdf',
        reportId: id,
      };
  
      const response = await fetchSentinelReportsDownloadUrl(data);
  
      if (response.isSuccess) {
        // Step 1: Get the response stream
        const reader = response.text.getReader();
  
        // Step 2: Convert the stream to a Uint8Array
        const chunks = [];
        let receivedLength = 0;
  
        // Read the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedLength += value.length;
        }
  
        // Combine chunks into a single Uint8Array
        const bytes = new Uint8Array(receivedLength);
        let position = 0;
        for (const chunk of chunks) {
          bytes.set(chunk, position);
          position += chunk.length;
        }
  
        // Step 3: Create a Blob from the Uint8Array
        const blob = new Blob([bytes], { type: 'application/pdf' });
  
        // Step 4: Create a URL and download the file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download PDF:', response.statusText);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
  

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
        const text = await response.text
        const blob = new Blob([text], {type: 'text/html'})
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report_${id}.html`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error('Failed to download HTML:', response.statusText)
      }
    } catch (error) {
      console.error('Error downloading HTML:', error)
    }
  }

  return (
    <div className='card pad-10 config'>
      <ToastContainer />
      <div className='card-header no-pad'>
        <div className=' d-flex'>
          <div>
            <button className='btn btn-green btn-small' onClick={handleOpenModal}>
              Load Report Task
            </button>
          </div>
          <div className='float-left mg-left-10'>
            <button
              className='btn btn-green btn-small'
              onClick={handleDelete}
              disabled={!isCheckboxSelected}
            >
              Delete selection
            </button>
          </div>
        </div>
        <div className='card-toolbar'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>
              Reports ({currentItems ? currentItems.length : 0} /{' '}
              {filteredList ? filteredList.length : 0})
            </span>
          </h3>
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
                    <td></td>
                    <td>
                      <span
                        className='me-3'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadPdf(item.id)
                        }}
                      >
                        DownloadPDF
                      </span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadHtml(item.id)
                        }}
                      >
                        DownloadHTML
                      </span>
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
                                <p>{item?.insightTypes[0]?.display_Name}</p>
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
