import React from 'react'
import {Link, useParams} from 'react-router-dom'

const MasterData = () => {
  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Master Data</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/master-data/add' className='btn btn-danger btn-small'>
              Add
            </Link>
          </div>
        </div>
      </div>
      <div className='card-body'>
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          <thead>
            <tr className='fw-bold text-muted bg-blue'>
              <th className='min-w-50px'>Data ID</th>
              <th className='min-w-50px'>Data Type</th>
              <th className='min-w-50px'>Data Name</th>
              <th className='min-w-50px'>Data Value</th>
              <th className='min-w-50px'>Created Date</th>
              <th className='min-w-50px'>Modified Date</th>
              <th className='min-w-50px'></th>
            </tr>
          </thead>
          <tbody>
            <tr className='fs-12'>
              <td>0</td>
              <td className='text-warning fw-bold'>string</td>
              <td>string</td>
              <td>string</td>
              <td>28/12/2022 9:30PM</td>
              <td className='text-warning fw-bold'>28/12/2022 9:35PM</td>
              <td>
                <button className='btn btn-danger btn-small'>
                  <Link className='text-white' to={`/qradar/master-data/update`}>
                    Update
                  </Link>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export {MasterData}
