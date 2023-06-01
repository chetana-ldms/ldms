import React from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'

const ThreatIntelReport = () => {
  return (
    <div className='threat-report'>
      {/* <h6>Threat Intel Report</h6> */}
      <div className='report-files mt-5'>
        <a href={toAbsoluteUrl('/media/reports/ThreatIntel1.pdf')} download='ThreatIntelReport'>
          <i className='far fa-file-pdf' />
          <span className='text-blue'>Threat Intel Report1</span>
          <i className='fas fa-download'></i>
        </a>
        <a href={toAbsoluteUrl('/media/reports/ThreatIntel2.pdf')} download='ThreatIntelReport'>
          <i className='far fa-file-pdf' />
          <span className='text-blue'>Threat Intel Report2</span>
          <i className='fas fa-download'></i>
        </a>
      </div>
    </div>
  )
}

export default ThreatIntelReport
