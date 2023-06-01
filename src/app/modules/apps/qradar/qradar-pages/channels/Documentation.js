import React from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../../../_metronic/helpers'

const Documentation = () => {
  return (
    <div className='threat-report document'>
      {/* <h6>Documentation</h6> */}
      <div className='report-files mt-5'>
        <a href={toAbsoluteUrl('/media/reports/Report.docx')} download='Documentation'>
          <i className='far fa-file-word' />
          <span className='text-blue'>Documentation</span>
          <i className='fas fa-download'></i>
        </a>
        <a href={toAbsoluteUrl('/media/reports/Report.docx')} download='Documentation'>
          <i className='far fa-file-word' />
          <span className='text-blue'>Documentation</span>
          <i className='fas fa-download'></i>
        </a>
      </div>
    </div>
  )
}

export default Documentation
