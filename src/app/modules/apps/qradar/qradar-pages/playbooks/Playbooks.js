import React from 'react'
import {Link} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const Playbooks = () => {
  return (
    <div className='card'>
      {' '}
      <ToastContainer />{' '}
      <div className='card-header no-pad'>
        {' '}
        <h3 className='card-title align-items-start flex-column'>
          {' '}
          <span className='card-label fw-bold fs-3 mb-1'> PlayBooks </span>{' '}
        </h3>{' '}
        <div className='card-toolbar'>
          {' '}
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            {' '}
            <Link to='/qradar/addplaybooks' className='btn btn-new btn-small'>
              {' '}
              Add{' '}
            </Link>{' '}
          </div>{' '}
        </div>{' '}
      </div>{' '}
      <div className='card-body no-pad'>
        {' '}
        <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
          {' '}
          <thead>
            {' '}
            <tr className='fw-bold bg-light'>
              {' '}
              <th className='min-w-50px'>PlayBook Name</th>{' '}
              <th className='min-w-50px'>Description</th>{' '}
              <th className='min-w-50px'>Alert Category</th> <th className='min-w-50px'>Status</th>{' '}
              <th className='min-w-50px'>Actions</th>{' '}
            </tr>{' '}
          </thead>{' '}
          <tbody>
            {' '}
            <tr>
              {' '}
              <td colSpan='5' className='text-center'>
                {' '}
                No data found{' '}
              </td>{' '}
            </tr>{' '}
          </tbody>{' '}
        </table>{' '}
      </div>{' '}
    </div>
  )
}
export {Playbooks}
