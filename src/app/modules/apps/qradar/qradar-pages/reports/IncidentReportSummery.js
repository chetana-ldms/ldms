import React from 'react'
import {Tabs, Tab, TabList, TabPanel} from 'react-tabs'
import ClosedIncidentReport from './ClosedIncidentReport'
import OpenIncidentSummary from './OpenIncidentSummary'
import SignificantIncident from './SignificantIncident'
import CreatedIncidentStatusReport from './CreatedIncidentStatusReport'
import IncidentSlaMeasurement from './IncidentSlaMeasurement'

const IncidentReportSummery = () => {
  return (
    <div className='row reports-page'>
      <div className='col-lg-12'>
        <div className='mb-5 mb-xl-12'>
          <h2>Incident Reports</h2>
          <div className='demo-block card mt-5'>
            <Tabs className='report-tabs'>
              <div>
                <div className='card-body1'>
                  <TabPanel className='main-tab'>
                    <CreatedIncidentStatusReport />
                  </TabPanel>
                  <TabPanel>
                    <ClosedIncidentReport />
                  </TabPanel>
                  <TabPanel>
                    <OpenIncidentSummary />
                  </TabPanel>
                  <TabPanel>
                    <SignificantIncident />
                  </TabPanel>
                  <TabPanel className='main-tab'>
                    <IncidentSlaMeasurement />
                  </TabPanel>
                </div>
              </div>
              <TabList className='tab-list mt-5'>
                <Tab>Status of Created Incidents</Tab>
                <Tab>Closed Incidents</Tab>
                <Tab>Open Incident Status</Tab>
                <Tab>Significant Incidents</Tab>
                <Tab>SLA Measurement</Tab>
              </TabList>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncidentReportSummery
