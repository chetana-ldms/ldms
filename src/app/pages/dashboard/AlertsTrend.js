import React, { useState, useEffect } from "react";
import CanvasJSReact from "./assets/canvasjs.react";
import { fetchGetAlertsTrendData } from "../../api/dashBoardApi";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function AlertsTrends(props) {
  const { days, orgId } = props;
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [alertData, setAlertData] = useState([]);
  console.log(alertData, "alertData");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')

  const CanvasJS = CanvasJSReact.CanvasJS;

  //Pie chart color code
  CanvasJS.addColorSet("colorShades", [
    //colorSet Array
    "#f0e68c",
    "#ffb700",
    "#008080",
  ]);

  const trendHours = alertData
    ? alertData.map((alert) => alert.trendHours)
    : [];
  const alertsCount = alertData
    ? alertData.map((alert) => alert.alertsCount)
    : [];

  const options = {
    animationEnabled: true,
    // title: {
    //   text: 'Monthly Sales - 2017',
    // },
    axisX: {
      valueFormatString: "HH",
      title: "Trend Hours",
    },
    axisY: {
      title: "Alert Count",
      prefix: "",
      scaleBreaks: {
        customBreaks: [
          {
            spacing: "2%",
          },
        ],
      },
    },
    height: 140,
    data: [
      {
        yValueFormatString: "#",
        xValueFormatString: "HH",
        type: "spline",
        dataPoints: trendHours.map((trendHours, index) => {
          return {
            y: alertsCount[index],
            label: trendHours,
          };
        }),
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const GetAlertsTrendDataResponse = await fetchGetAlertsTrendData({
          orgId: orgId,
          toolId:toolId,
          orgAccountStructureLevel: [
            {
              levelName: "AccountId",
              levelValue: accountId || ""
            },
         {
              levelName: "SiteId",
              levelValue:  siteId || ""
            },
        {
              levelName: "GroupId",
              levelValue: groupId || ""
            }
          ]
        });
        const { alertsTrendDatas } = await GetAlertsTrendDataResponse;

        // if (!response.ok) {
        //   const errorData = await response.json()
        //   throw new Error(`Network response was not ok: ${response.status} - ${errorData.message}`)
        // }

        // const {alertsTrendDatas} = await response.json() // destructure the 'alertsTrendDatas' property from the response object
        setAlertData(alertsTrendDatas);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [orgId]);

  console.log(alertData); // Log the alertData to the console

  return (
    <div>
      <h6 className="text-center uppercase">Alerts Trendline</h6>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <CanvasJSChart options={options} style="height:140px" />
        </>
      )}
    </div>
  );
}

export default AlertsTrends;
