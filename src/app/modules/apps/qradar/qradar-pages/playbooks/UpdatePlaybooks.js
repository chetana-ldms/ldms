import React, {useState, useRef, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'
import {UsersListLoading} from '../components/loading/UsersListLoading'

const UpdatePlaybooks = () => {
  return (
    <div className='card'>
      <UsersListLoading />
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Update Playbooks</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/playbooks/list' className='btn btn-primary btn-small'>
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export {UpdatePlaybooks}
