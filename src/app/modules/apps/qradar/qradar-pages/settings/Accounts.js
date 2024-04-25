import React, {useEffect, useState} from 'react'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {fetchAccountDetailsUrl} from '../../../../../api/SentinalApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'

function Accounts() {
  const [accountDetails, setAccountDetails] = useState([])
  console.log(accountDetails, 'accountDetails111')
  const [loading, setLoading] = useState(false)
  const orgId = Number(sessionStorage.getItem('orgId'))
  const fetchData = async () => {
    const data = {
      orgID: orgId,
    }
    try {
      setLoading(true)
      const response = await fetchAccountDetailsUrl(data)
      setAccountDetails(response)
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
              <th>Account Name</th>
              <th>SKUs</th>
              <th>Total Surfaces</th>
              <th>Add-Ons</th>
              <th>Singularity Platform Settings</th>
              <th>Usage Type</th>
              <th>Billing Mode</th>
              <th>Active Agents</th>
              <th>Created At</th>
              <th>Expiration Date</th>
            </tr>
          </thead>
          <tbody>
            {accountDetails !== null ? (
              accountDetails?.map((item, index) => (
                <tr className='table-row' key={index}>
                  <td>{item.name}</td>
                  <td>
                    {item.skus.map((sku, skuIndex) => (
                      <span key={skuIndex}>
                        {sku.type}
                        {`(${sku.totalLicenses})`}
                      </span>
                    ))}
                  </td>
                  <td>{item?.licenses?.bundles[0]?.surfaces[0]?.count}</td>
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
                  <td>{item.usageType}</td>
                  <td>{item.billingMode}</td>
                  <td>{item.activeAgents}</td>
                  <td>{getCurrentTimeZone(item.createdAt)}</td>
                  <td>{getCurrentTimeZone(item.expiration)}</td>
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

export default Accounts
