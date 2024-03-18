import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchApplicationEndPointsUrl } from "../../../../../api/ApplicationSectionApi";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import EndpointPopup from "./EndpointPopup";

function Endpoints({ shouldRender, id }) {
  const [loading, setLoading] = useState(false);
  const [endpoints, setEndpoints] = useState([]);
  console.log(endpoints, "endpoints");
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const orgId = Number(sessionStorage.getItem("orgId"));

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      applicationId: id,
    };
    try {
      setLoading(true);
      const response = await fetchApplicationEndPointsUrl(data);
      setEndpoints(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldRender) {
      fetchData();
    }
  }, [shouldRender]);
  const handleEndpointClick = (item) => {
    setSelectedEndpoint(item);
    setShowPopup(true);
  };
  return (
    <>
      {shouldRender && (
        <table className="table alert-table scroll-x mg-top-20">
          <thead>
            <tr>
              <th>Endpoint Name</th>
              {/* <th className='fs-12'>Status</th> */}
              {/* <th className='fs-12'>Version</th> */}
              <th>OS</th>
              <th>OS Version</th>
              <th>Type</th>
              <th>Account</th>
              <th>Site</th>
              <th>Group</th>
              <th>Domain</th>
              <th>Application Detection Date</th>
              <th>Day from Detection</th>
              <th>Last successful scan</th>
              <th>Last scan result</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {endpoints !== undefined ? (
              endpoints?.map((item) => (
                <tr key={item.applicationId}>
                  <td
                    onClick={() => handleEndpointClick(item)}
                    className="link-txt"
                  >
                    {item.endpointName}
                  </td>
                  {/* <td>{item.status}</td> */}
                  {/* <td>{item.version}</td> */}
                  <td>{item.osType}</td>
                  <td>{item.osVersion}</td>
                  <td>{item.osType}</td>
                  <td>{item.accountName}</td>
                  <td>{item.siteName}</td>
                  <td>{item.groupName}</td>
                  <td>{item.domain}</td>
                  <td>{getCurrentTimeZone(item.detectionDate)}</td>
                  <td>{getCurrentTimeZone(item.applicationDaysDetected)}</td>
                  <td>{item.lastScanDate}</td>
                  <td>{item.lastScanResult}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <EndpointPopup
        selectedEndpoint={selectedEndpoint}
        showModal={showPopup}
        setShowModal={setShowPopup}
      />
    </>
  );
}

export default Endpoints;
