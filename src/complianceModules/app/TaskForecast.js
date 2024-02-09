import React from 'react';
import CanvasJSReact from '../../app/pages/dashboard/assets/canvasjs.react';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const TaskForecast = () => {
    const options1 = {
        title: {
          // text: "Basic Column Chart",
        },
        data: [
          {
            // Change type to "doughnut", "line", "splineArea", etc.
            type: 'column',
            height: 200,
            width: 200,
            dataPoints: [
              {label: 'Feb', y: 10},
              {label: 'March', y: 15},
              {label: 'April', y: 25},
              {label: 'May', y: 30},
            ],
          },
        ],
      }
  return (
    <div className='col-lg-3'>
      <div className='card'>
        <h4>Task forecast</h4>
        <CanvasJSChart options={options1} style={{ height: '140px' }} />
        <hr />
        <div className='task-list'>
          <h4>Task list</h4>
          <ul>
            <li>Content</li>
            <li>Content</li>
            <li>Content</li>
            <li>Content</li>
            <li>Content</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TaskForecast;
