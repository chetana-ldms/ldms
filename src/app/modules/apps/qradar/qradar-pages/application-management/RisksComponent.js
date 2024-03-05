import React, { useState, useEffect } from "react";
import { fetchApplicationsAndRisksUrl } from "../../../../../api/ApplicationSectionApi";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import CanvasJSReact from "../reports/assets/canvasjs.react";
import { Link } from "react-router-dom";

function RisksComponent() {
  const [loading, setLoading] = useState(false);
  const [risk, setRisk] = useState([]);
  console.log(risk, "risk");
  const orgId = Number(sessionStorage.getItem("orgId"));
  const CanvasJS = CanvasJSReact.CanvasJS;
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const severities = {
    animationEnabled: true,
    subtitles: [
      {
        verticalAlign: "center",
        fontSize: 24,
        dockInsidePlotArea: true,
      },
    ],
    height: 150,
    data: [
      {
        type: "doughnut",
        showInLegend: true,
        indexLabel: "{name}: {y}",
        yValueFormatString: "#,###'%'",
        dataPoints: [{ name: "Medium", y: 100 }],
      },
    ],
  };
  CanvasJS.addColorSet("colorShades", ["#f0e68c", "#ffb700", "#008080"]);

  const options = {
    animationEnabled: true,
    axisX: {
      valueFormatString: "HH",
      title: "",
    },
    axisY: {
      title: "",
      prefix: "",
      scaleBreaks: {
        customBreaks: [
          {
            spacing: "10",
          },
        ],
      },
    },
    height: 140,
    borderColor: "#ccc",
    data: [
      {
        type: "column",
        dataPoints: [
          { label: "Adobe Acrobat", y: 10 },
          { label: "MySQL Server", y: 15 },
          { label: "Splunk", y: 25 },
        ],
      },
    ],
  };
  const fetchData = async () => {
    const data = {
      orgID: orgId,
    };
    try {
      setLoading(true);
      const response = await fetchApplicationsAndRisksUrl(data);
      setRisk(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="application-section mg-top-20 mg-btm-20">
        <div className="header-filter mg-btm-20">
          <form>
            <select className="form-select">
              <option>Select filter</option>
            </select>
          </form>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h4 className="uppercase normal">severities</h4>
                <CanvasJSChart
                  style={{ height: "150px" }}
                  options={severities}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h4 className="uppercase normal">exploitation</h4>
                <div className="mg-top-30 text-center">
                  <i className="fa fa-info-circle green fs-30 mg-btm-10" />
                  <br />
                  <p className="fs-15 gray">No notifications found</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h4 className="uppercase normal">
                  most impactful applications
                </h4>
                <CanvasJSChart options={options} style="height:140px" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <table className="table alert-table scroll-x">
        <thead>
          <tr className="fw-bold text-muted bg-blue">
            <th className="fs-12">Application Name</th>
            <th className="fs-12">Type </th>
            <th className="fs-12">Versions </th>
            <th className="fs-12">Vendor </th>
            <th className="fs-12"> Highest Severity </th>
            <th className="fs-12">Highest Vulnerability score </th>
            <th className="fs-12">Highest NVD base score </th>
            <th className="fs-12">Most common Status </th>
            <th className="fs-12">Exploited in the Wild </th>
            <th className="fs-12">Exploited Maturity </th>
            <th className="fs-12">Remediation Level </th>
            <th className="fs-12">Number of CVEs</th>
            <th className="fs-12">Number of Endpoints </th>
            <th className="fs-12">Application Detection Date </th>
            <th className="fs-12">Date from Detection </th>
          </tr>
        </thead>
        <tbody>
          {loading && <UsersListLoading />}
          {risk !== null ? (
            risk.map((item) => (
              <tr>
                <td>
                  <Link to={`/qradar/application/update/${item.name}`}>
                    {item.name}
                  </Link>
                </td>
                <td>{item.applicationType}</td>
                <td>{item.versionCount}</td>
                <td>{item.vendor}</td>
                <td>{item.highestSeverity}</td>
                <td></td>
                <td>{item.highestNvdBaseScore ?? 0}</td>
                <td>
                  {
                    item.statuses.find(
                      (status) =>
                        status.count ===
                        Math.max(...item.statuses.map((status) => status.count))
                    ).label
                  }
                </td>
                <td></td>
                <td></td>
                <td>{item.remediationLevel ?? 0}</td>
                <td>{item.cveCount}</td>
                <td>{item.endpointCount}</td>
                <td>{getCurrentTimeZone(item.detectionDate)}</td>
                <td></td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RisksComponent;
