import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {fetchApplicationEndPointsUrl} from '../../../../../api/ApplicationSectionApi'
import { getCurrentTimeZone } from '../../../../../../utils/helper'
import { UsersListLoading } from '../components/loading/UsersListLoading'

function Endpoints({shouldRender}) {
  let {name, vendor} = useParams()
  name = decodeURIComponent(name)
  vendor = decodeURIComponent(vendor)
  const [loading, setLoading] = useState(false)
  const [endpoints, setEndpoints] = useState([])
  const orgId = Number(sessionStorage.getItem('orgId'))

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      applicationName: name,
      applicationVendor: vendor,
    }
    try {
      setLoading(true)
      const response = await fetchApplicationEndPointsUrl(data)
      setEndpoints(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (shouldRender) {
      fetchData()
    }
  }, [shouldRender])

  return (
    <>
      {shouldRender && (
        <table className='table alert-table mg-top-20'>
          <thead>
            <tr>
              <th className='fs-12'>Endpoint Name</th>
              {/* <th className='fs-12'>Status</th> */}
              <th className='fs-12'>Version</th>
              <th className='fs-12'>OS</th>
              <th className='fs-12'>OS Version</th>
              <th className='fs-12'>Type</th>
              <th className='fs-12'>Account</th>
              <th className='fs-12'>Site</th>
              <th className='fs-12'>Group</th>
              {/* <th className='fs-12'>Domain</th> */}
              <th className='fs-12'>Application Detection Date</th>
              {/* <th className='fs-12'>Day from Detection</th> */}
              {/* <th className='fs-12'>Last successful scan</th>
              <th className='fs-12'>Last scan result</th> */}
            </tr>
          </thead>
          <tbody>
          {loading && <UsersListLoading />}
            {endpoints !== undefined ? (
              endpoints.map((item) => (
                <tr key={item.id}>
                  <td>{item.applicationName}</td>
                  {/* <td>{item.status}</td> */}
                  <td>{item.version}</td> 
                  <td>{item.osName}</td>
                  <td>{item.osVersion}</td>
                  <td>{item.osType}</td>
                  <td>{item.accountName}</td>
                  <td>{item.siteName}</td>
                  <td>{getCurrentTimeZone(item.groupName)}</td>
                  {/* <td>{item.domain}</td> */}
                  <td>{item.detectionDate}</td>
                  {/* <td>{item.dayFromDetection}</td> */}
                  {/* <td>{item.lastSuccessfulScan}</td>
                  <td>{item.lastScanResult}</td> */}
                </tr>
              ))
            ) : (
              <tr>
               <td colSpan="12">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  )
}

export default Endpoints
