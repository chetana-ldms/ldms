import {useEffect, useState} from 'react'
import {fetchAEndPointDetailsUrl} from '../../../../../api/ApplicationSectionApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import ManageEndpointTagsModal from './ManageEndpointTagsModal'

function Tags({id}) {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState([])
  const [isManageTagsModalVisible, setIsManageTagsModalVisible] = useState(false)

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      endPiontId: id,
    }
    try {
      setLoading(true)
      const response = await fetchAEndPointDetailsUrl(data)
      setTags(response[0]?.tags?.sentinelone)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = () => {
    // Logic to save updated tags
    fetchData() // Optionally refresh data after saving
  }

  return (
    <>
      <div className='d-flex my-3'>
        <div className='fs-15 me-4 d-flex align-items-center'>
          Endpoint Tags ({tags ? tags.length : 0})
        </div>
        <div>
          <button
            className='btn btn-green btn-small'
            onClick={() => setIsManageTagsModalVisible(true)}
          >
            Manage Endpoint Tags
          </button>
        </div>
      </div>
      {tags !== null ? (
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th>Applied At</th>
              <th>Applied By</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((item, index) => (
              <tr key={index}>
                <td>{item?.key}</td>
                <td>{item?.value}</td>
                <td>{getCurrentTimeZone(item?.assignedAt)}</td>
                <td>{item?.assignedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No Data found</div>
      )}
      <ManageEndpointTagsModal
        show={isManageTagsModalVisible}
        handleClose={() => setIsManageTagsModalVisible(false)}
        tags={tags}
        onSave={handleSave}
        id={id}
      />
    </>
  )
}

export default Tags
