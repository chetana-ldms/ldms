import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {fetchApplicationEndPointsUrl} from '../../../../../api/ApplicationSectionApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {getCurrentTimeZone} from '../../../../../../utils/helper'

function Cves() {
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
    fetchData()
  }, [])

  return (
    <div>
      <table className='table alert-table mg-top-20'>
        <thead>
          <tr>
            <th className='fs-12'>
              <input type='checkbox' />
            </th>
            <th className='fs-12'>CVE ID</th>
            <th className='fs-12'>Severity</th>
            <th className='fs-12'>Vulnerability Score</th>
            <th className='fs-12'>NDV Base Score</th>
            <th className='fs-12'>Exploited in the Wild</th>
            <th className='fs-12'>Exploit Maturity</th>
            <th className='fs-12'>Remediation Level</th>
            <th className='fs-12'>Report confidence</th>
            <th className='fs-12'>Published Date</th>
          </tr>
        </thead>
        <tbody>
          {loading && <UsersListLoading />}
          {endpoints !== undefined ? (
            endpoints.map((item) => (
              <tr key={item.id}>
                <td>
                  <input type='checkbox' />
                </td>
                <td>{item.applicationName}</td>
                <td>{item.version}</td>
                <td>{item.osName}</td>
                <td>{item.osVersion}</td>
                <td>{item.osType}</td>
                <td>{item.accountName}</td>
                <td>{item.siteName}</td>
                <td>{item.groupName}</td>
                <td>{getCurrentTimeZone(item.detectionDate)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='12'>No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Cves
