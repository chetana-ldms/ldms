import {useEffect, useState} from 'react'
import {fetchBlokckedListUrl} from '../../../../../api/SentinalApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import Pagination from '../../../../../../utils/Pagination'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import AddToBlockListModal from '../alerts/AddToBlockListModal'
import BlockListPopUp from './BlockListPopUp'

function BlockList() {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [loading, setLoading] = useState(false)
  const [blockList, setBlockList] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [showPopup, setShowPopup] = useState(false)

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      includeChildren: true,
      includeParents: true,
    }
    try {
      setLoading(true)
      const response = await fetchBlokckedListUrl(data)
      setBlockList(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(0)
  }

  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = blockList.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected)
  }

  const openPopup = () => {
    setShowPopup(true)
  }

  const closePopup = () => {
    setShowPopup(false)
  }

  return (
    <div>
      {loading ? (
        <UsersListLoading />
      ) : (
        <>
          <div className='row'>
            <div className='col-lg-6'>
              <div className='float-left me-4'>
                <button className='btn btn-new btn-small float-left'>All related scopes</button>
              </div>
              <button className='btn btn-new btn-small float-left' onClick={openPopup}>
                Add New
              </button>
              {showPopup && <BlockListPopUp show={openPopup} onClose={closePopup} />}
              <div className='float-left mg-left-10'>
                <button className='btn btn-new btn-small float-left'>Delete selection</button>
              </div>
            </div>
            <div className='col-lg-6 text-right'>
              <span className='gray inline-block mg-righ-20'>530 Items</span>
              <span className='inline-block mg-left-10 link'>
                Export <i className='fas fa-file-export link' />
              </span>
            </div>
          </div>
          <table className='table alert-table scroll-x'>
            <thead>
              <tr>
                <th>
                  <input type='checkbox' name='selectAll' />
                </th>
                <th>OS</th>
                <th>Description </th>
                <th>Hash</th>
                <th>Scope Path</th>
                <th>User </th>
                <th>warning</th>
                <th>Last Update</th>
                <th>Source </th>
                <th>Scope </th>
                <th>Imported</th>
              </tr>
            </thead>
            <tbody>
              {currentItems !== null ? (
                currentItems?.map((item) => (
                  <tr className='table-row' key={item.id}>
                    <td>
                      <input type='checkbox' name={`checkbox_${item.id}`} />
                    </td>
                    <td>{item.osType}</td>
                    <td>{item.description}</td>
                    <td>{item.value}</td>
                    <td>{item.scopePath}</td>
                    <td>{item.userName}</td>
                    <td>{item.notRecommended}</td>
                    <td>{getCurrentTimeZone(item.updatedAt)}</td>
                    <td>{item.source}</td>
                    <td>{item.scopeName}</td>
                    <td>{item.imported ? 'Yes' : 'No'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='24'>No data found</td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            pageCount={Math.ceil(blockList.length / itemsPerPage)}
            handlePageClick={handlePageClick}
            itemsPerPage={itemsPerPage}
            handlePageSelect={handlePageSelect}
          />
        </>
      )}
    </div>
  )
}

export default BlockList
