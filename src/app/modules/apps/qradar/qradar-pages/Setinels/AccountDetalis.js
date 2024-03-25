import React, {useEffect, useState} from 'react'
import {fetchAccountDetailsUrl} from '../../../../../api/SentinalApi'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { getCurrentTimeZone } from '../../../../../../utils/helper'

function AccountDetalis() {
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
      setAccountDetails(response[0])
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
    <div className=''>
          {loading && <UsersListLoading />}
      <div className='card'>
        <div className='row card-body  '>
          <div className='col-md-6'>
            <div className='row'>
              <div className='col-md-1'>
                <p>icon</p>
              </div>
              <div className='col-md-11'>
                <p>{accountDetails.name}</p>
                <p>Account Id : {accountDetails.id}</p>
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='row'>
              <div className='col-md-3'>
                <p>icon</p>
                <p>{accountDetails?.agentsInCompleteSku}</p>
                <p>Total Agents</p>
              </div>
              <div className='col-md-3'>
                <p>icon</p>
                <p>{accountDetails?.creator}</p>
                <p>Creater</p>
              </div>
              <div className='col-md-3'>
                <p>icon</p>
                <p>{getCurrentTimeZone(accountDetails.createdAt)}</p>
                <p>Created At</p>
              </div>
              <div className='col-md-3'>
                <p>icon</p>
                <p>{getCurrentTimeZone(accountDetails.expiration)}</p>
                <p>Expiration Date</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 className='p-3'>Licenses</h2>
      <div className='row d-flex justify-content-between '>
        <div className='col-md-3 card'>
          <h6>Completed</h6>
               <div className='d-flex justify-content-between '>
            
            <span>{accountDetails?.licenses?.bundles[0]?.surfaces[0]?.name}</span>
            <span>{accountDetails?.licenses?.bundles[0]?.surfaces[0]?.count}</span>
          </div>
         
        </div>
        <div className='col-md-4 card'>
          <h3>Add-ons</h3>
          <div className='d-flex justify-content-between '>
          {accountDetails?.licenses?.modules?.map((item) => {
                return(
                 <>
              <p>{item.displayName}</p>
                </>
              )})}
          </div>
        </div>
        <div className='col-md-4 card'>
          <h3>Singularity Platform Settings</h3>
          
              {accountDetails?.licenses?.settings?.map((item) => {
                return(
                 <>
                <div className='row p-2'>
            <div className='col-md-6'>{item.settingGroupDisplayName}</div>
            <div className='col-md-6'>{item.displayName} </div>
            
            </div>
                </>
              )})}
           
        </div>
      </div>
    </div>
  )
}

export default AccountDetalis
