import React from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'

const USCert = () => {
  return (
    <div className='threat-report'>
      <div className='report-files mt-5'>
        <a href={toAbsoluteUrl('/media/reports/US-CERT.pdf')} download='US-CERT'>
          <i className='far fa-file-pdf' />
          <span className='text-blue'>US-CERT</span>
          <i className='fas fa-download'></i>
        </a>
      </div>
    </div>
  )
}

export default USCert
