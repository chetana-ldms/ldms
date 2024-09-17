import React, {useState} from 'react'
import {Container} from 'react-bootstrap'
import SiteName from './SiteName'
import SiteType from './SiteType'
import SitePolicy from './SitePolicy'
import './SiteStepper.css'

const SiteStepper = () => {
  const [activeStep, setActiveStep] = useState('site-name')
  const [siteNameData, setSiteNameData] = useState({siteName: '', siteDescription: ''})
  const [siteTypeData, setSiteTypeData] = useState({
    siteType: 'trial',
    selectedExpirationDate: '',
    isNonExpireChecked: true,
    skuSelected: false,
    totalAgents: '1',
    isUnlimitedLicenses: false,
    isRoguesChecked: false,
  })

  const renderContent = () => {
    switch (activeStep) {
      case 'site-name':
        return (
          <SiteName
            setActiveStep={setActiveStep}
            siteNameData={siteNameData}
            setSiteNameData={setSiteNameData}
          />
        )
      case 'site-type':
        return (
          <SiteType
            setActiveStep={setActiveStep}
            siteTypeData={siteTypeData}
            setSiteTypeData={setSiteTypeData} 
          />
        )
      case 'site-policy':
        return (
          <SitePolicy
            setActiveStep={setActiveStep}
            siteNameData={siteNameData}
            siteTypeData={siteTypeData}
          />
        )
      default:
        return <SiteName setActiveStep={setActiveStep} />
    }
  }

  return (
    <div className='card pad-10'>
      <Container>
        <div className='row'>
          <div className='col-md-3'>
            <div className='stepper-container'>
              <div className='stepper-steps'>
                <div
                  className={`stepper-item ${activeStep === 'site-name' ? 'active' : ''}`}
                  onClick={() => setActiveStep('site-name')}
                >
                  <div className='stepper-circle'>1</div>
                  <div className='stepper-label'>Site Name</div>
                </div>
                <div
                  className={`stepper-line ${activeStep !== 'site-name' ? 'completed' : ''}`}
                ></div>
                <div
                  className={`stepper-item ${activeStep === 'site-type' ? 'active' : ''}`}
                  onClick={() => setActiveStep('site-type')}
                >
                  <div className='stepper-circle'>2</div>
                  <div className='stepper-label'>Site Type</div>
                </div>
                <div
                  className={`stepper-line ${activeStep !== 'site-type' ? 'completed' : ''}`}
                ></div>
                <div
                  className={`stepper-item ${activeStep === 'site-policy' ? 'active' : ''}`}
                  onClick={() => setActiveStep('site-policy')}
                >
                  <div className='stepper-circle'>3</div>
                  <div className='stepper-label'>Site Policy</div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-9'>
            <div className='stepper-content mt-2'>
              <h3 className='mb-5 text-center'>ADD NEW SITE</h3>
              {renderContent()}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default SiteStepper
