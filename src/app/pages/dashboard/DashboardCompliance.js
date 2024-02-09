import React, {useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import CanvasJSReact from './assets/canvasjs.react'
import ReadinessCard from '../../../complianceModules/app/ReadinessCard'
import NotificationsCard from '../../../complianceModules/app/NotificationsCard'
import TestTrendComponent from '../../../complianceModules/app/TestTrendComponent '
import PolicyStatus from '../../../complianceModules/app/PolicyStatus'
import VendorRisks from '../../../complianceModules/app/VendorRisks'
import TaskForecast from '../../../complianceModules/app/TaskForecast'

const DashboardCompliance = () => {
  const [loading, setLoading] = useState(true)

  const CanvasJS = CanvasJSReact.CanvasJS
  const CanvasJSChart = CanvasJSReact.CanvasJSChart

  const options = {
    animationEnabled: true,
    // title: {
    //   text: "Customer Satisfaction",
    // },
    subtitles: [
      {
        // text: "71% Positive",
        verticalAlign: 'center',
        fontSize: 24,
        dockInsidePlotArea: true,
      },
    ],
    height: 200,
    data: [
      {
        type: 'doughnut',
        showInLegend: true,
        indexLabel: '{name}: {y}',
        yValueFormatString: "#,###'%'",
        dataPoints: [
          {name: 'Active', y: 5},
          {name: 'Renews soon', y: 31},
          {name: 'Needs approval', y: 40},
        ],
      },
    ],
  }

  

  return (
    <div className='dashboard-wrapper compliance incident-box'>
      <div>
        <div className='row py-lg-3'>
          <div className='col-lg-9'>
            <div className='card'>
              <h4>Readiness Overview</h4>
              <div className='row'>
                <ReadinessCard />
              </div>
            </div>
          </div>
          <NotificationsCard />
        </div>
        <div className='row'>
          <TestTrendComponent />
          <div className='col-lg-5'>
            <div className='row'>
              {/* < PolicyStatus /> */}
              <div className='col-lg-6'>
                <div className='card'>
                  <h4>Policy status</h4> <CanvasJSChart options={options} />
                </div>
              </div>
              {/* < VendorRisks /> */}
              <div className='col-lg-6'>
                <div className='card'>
                  <h4>Vendor risks</h4>
                  <CanvasJSChart
                    options={options}
                  />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-lg-6'>
                <div className='card'>
                  <h4>Connections</h4>
                  <p>Errors</p>
                  <p>
                    <span className='red bold fs-20'>3</span>
                  </p>
                  <hr />
                  <p>Out of 9 total</p>
                </div>
              </div>
              <div className='col-lg-6'>
                <div className='card'>
                  <h4>Personnel</h4>
                  <p>Non compliant</p>
                  <p>
                    <span className='red bold fs-20'>321</span>
                  </p>
                  <hr />
                  <p>Out of 321 total</p>
                </div>
              </div>
            </div>
          </div>
          < TaskForecast/>
        </div>
      </div>
    </div>
  )
}

export default DashboardCompliance
