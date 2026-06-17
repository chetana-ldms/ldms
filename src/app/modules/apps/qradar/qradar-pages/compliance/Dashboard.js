import React from 'react'
import {Tabs, Tab, TabList, TabPanel} from 'react-tabs'
import ControlsStatusSummary from './ControlsStatusSummary'
import ControlsDomainSummary from './ControlsDomainSummary'
import ControlsTrackingAssignmentSummary from './ControlsTrackinAssaignmentSummary'

function Dashboard() {
  return (
    <div className='row reports-page'>
      <div className='col-lg-12'>
        <div className='mb-5 mb-xl-12'>
          <h2 className='ps-2'>Compliance Dashboard</h2>
          <div className='demo-block card mt-5'>
            <Tabs className='report-tabs'>
              <div>
                <div className='card-body1'>
                  <TabPanel className='main-tab'>
                    <ControlsStatusSummary />
                  </TabPanel>

                  <TabPanel className='main-tab'>
                    <ControlsDomainSummary />
                  </TabPanel>

                  <TabPanel className='main-tab'>
                    <ControlsTrackingAssignmentSummary />
                  </TabPanel>
                </div>
              </div>
              <TabList className='tab-list mt-5'>
                <Tab>Status Summary</Tab>
                <Tab>Domain Summary</Tab>
                <Tab>Tracking Assignment Summary</Tab>
              </TabList>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard