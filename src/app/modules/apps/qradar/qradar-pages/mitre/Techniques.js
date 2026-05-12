import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Pagination from '../../../../../../utils/Pagination'
import useFeatureActions from '../configuration/useFeatureActions'
import {notify, notifyFail} from '../components/notification/Notification'
import {useErrorBoundary} from 'react-error-boundary'
import { useSelector } from 'react-redux'
import { fetchTechniquesUrl } from '../../../../../api/MitreApi'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import {fetchExportDataAddUrl} from '../../../../../api/Api'

const Techniques = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state?.user?.userData);
  console.log(userData, 'userData')
  const handleError = useErrorBoundary()
  const [tools, setTools] = useState([])
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activePage, setActivePage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const reload = async () => {
    try {
      setLoading(true)
      const response = await fetchTechniquesUrl()
      setTools(response)
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
        .filter((item) => (item.techniqueDisplayName || '').toLowerCase().includes(filterValue.toLowerCase()))
        .slice(indexOfFirstItem, indexOfLastItem)
    : null
  const filteredList = filterValue
    ? tools.filter((item) => (item.techniqueDisplayName || '').toLowerCase().includes(filterValue.toLowerCase()))
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

  const exportToExcel = async () => {
    const dataToExport = filteredList || []
    let csvContent = 'Techniques Report\n'
    csvContent +=
      'Technique ID,Name,Display Name,External ID\n' +
      dataToExport
        .map(
          (item) =>
            `${item.techniqueId},${item.techniqueName},${item.techniqueDisplayName},${item.techniqueExternalId}`
        )
        .join('\n')

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'})
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'techniques_report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    try {
      await fetchExportDataAddUrl({
        createdDate: new Date().toISOString(),
        createdUserId: Number(sessionStorage.getItem('userId')),
        orgId: Number(sessionStorage.getItem('orgId')),
        exportDataType: 'Techniques',
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='card pad-10 config'>
      <ToastContainer />
      <div className='card-header no-pad'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>
            Techniques ({currentItems ? currentItems.length : 0} /{' '}
            {filteredList ? filteredList.length : 0})
          </span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
              <DropdownToggle caret className='btn btn-small btn-light'>
                Export <i className='fa fa-file-export link mg-left-10' />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={exportToExcel}>
                  Export to CSV <i className='fa fa-file-excel link float-right' />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th>Technique ID</th>
              <th>Name</th>
              <th>Display Name</th>
              <th>External ID</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}

            {currentItems !== null ? (
              currentItems.map((item, index) => (
                <tr key={index} className='fs-12 table-row'>
                  <td>{item.techniqueId}</td>
                  <td>{item.techniqueName}</td>
                  <td>{item.techniqueDisplayName}</td>
                  <td>{item.techniqueExternalId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='4' className='text-center'>
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export {Techniques}
