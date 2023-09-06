import React, { useState, useEffect } from 'react';
import CanvasJSReact from './assets/canvasjs.react';
import { fetchAlertsRuleUrl } from '../../../../../api/ReportApi';
import { useErrorBoundary } from 'react-error-boundary';

function AlertsRule() {
  const handleError = useErrorBoundary();
  const orgId = Number(sessionStorage.getItem('orgId'));
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CanvasJS = CanvasJSReact.CanvasJS;
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  CanvasJS.addColorSet('barColorSet', ['#f0e68c', '#ffb700', '#008080']);

  const baroptions = {
    dataPointWidth: 40,
    axisY: {
      minimum: 0,
      maximum: 15,
      interval: 5,
      title: 'alertCount',
      titleFontSize: 14,
    },
    axisX: {
      labelMaxWidth: 70,
      labelWrap: true, 
      interval: 1,
      labelFontSize: 11,
      labelFontWeight: "normal",
      labelTextAlign: "center",
      labelAngle: 180,
      title: 'alertRule',
      titleFontSize: 14,
    },
    data: [
      {
        type: 'column',
        dataPoints: alertData, 
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      const toDate = new Date().toISOString();
      const fromDate = new Date();
      fromDate.setFullYear(fromDate.getFullYear() - 1);
      const fromDateISO = fromDate.toISOString();

      const requestData = {
        orgId,
        alertFromDate: fromDateISO,
        alertToDate: toDate,
      };
      try {
        const response = await fetchAlertsRuleUrl(requestData);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Network response was not ok: ${response.status} - ${errorData.message}`
          );
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType.includes('application/json')) {
          const responseData = await response.json();
          const dataPoints = responseData.data.map((item) => ({
            label: item.alertRule, 
            y: item.alertCount,
          }));
          baroptions.data[0].dataPoints = dataPoints;
          setAlertData(dataPoints);
          setLoading(false);
        } else {
          throw new Error('Response is not in JSON format');
        }
      } catch (error) {
        handleError(error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const startDate = lastYear.toLocaleDateString('en-GB');
  const endDate = today.toLocaleDateString('en-GB');

  return (
    <div>
      <h2>
        Alerts Rule for the last year ({startDate} to {endDate})
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : alertData && alertData.length > 0 ? (
        <CanvasJSChart options={baroptions} />
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}

export default AlertsRule;
