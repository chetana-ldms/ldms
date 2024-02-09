import React from 'react'
import CanvasJSReact from '../../app/pages/dashboard/assets/canvasjs.react'

function PolicyStatus() {
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
    <div className='col-lg-6'>
    <div className='card'>
      <h4>Policy status</h4> <CanvasJSChart options={options} />
    </div>
  </div>
  )
}

export default PolicyStatus