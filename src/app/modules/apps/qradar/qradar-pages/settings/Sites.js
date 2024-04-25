import React, {useEffect, useState} from 'react'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {fetchAccountDetailsUrl} from '../../../../../api/SentinalApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import {fetchSitesUrl} from '../../../../../api/SettingsApi'

function Sites() {
  const [sites, setSites] = useState([])
  console.log(sites, 'sites')
  const [loading, setLoading] = useState(false)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const accountId = sessionStorage.getItem('accountId')
  const fetchData = async () => {
    const data = {
      orgID: orgId,
      accountId: accountId,
    }
    try {
      setLoading(true)
      const response = await fetchSitesUrl(data)
      setSites(response.sites)
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
      {loading ? (
        <UsersListLoading />
      ) : (
        <table className='table alert-table scroll-x'>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Add-Ons</th>
              <th>Singularity Platform Settings</th>
              <th>Total Licenses</th>
              <th>Active Agents</th>
              <th>Created At</th>
              <th>Expiration Date</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {sites !== null && sites.length > 0 ? (
              sites?.map((item, index) => (
                <tr className='table-row' key={index}>
                  <td>{item.accountName}</td>
                  <td>
                    {item.sku}({item.totalLicenses})
                  </td>
                  <td>
                    {item?.licenses?.modules?.map((name, index) => (
                      <span key={index}>{name.displayName}</span>
                    ))}
                  </td>
                  <td>
                    {item?.licenses?.settings?.map((item) => (
                      <span key={index}>
                        {item.settingGroupDisplayName}: {item.displayName}
                      </span>
                    ))}
                  </td>
                  <td>{item.totalLicenses}</td>
                  <td>{item.activeLicenses}</td>
                  <td>{getCurrentTimeZone(item.createdAt)}</td>
                  <td>{getCurrentTimeZone(item.expiration)}</td>
                  <td>{item.siteType}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='24'>No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Sites
