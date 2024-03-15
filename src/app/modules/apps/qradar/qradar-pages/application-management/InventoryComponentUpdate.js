import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchInventoryApplicationsEndpointsUrl } from "../../../../../api/ApplicationSectionApi";
import { useEffect, useState } from "react";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import EndpointPopup from "./EndpointPopup";

function InventoryComponentUpdate() {
    const { name, vendor } = useParams(); 
    const orgId = Number(sessionStorage.getItem("orgId"));
    const [loading, setLoading] = useState(false);
    const [endpoints, setEndpoints] = useState([]);
    console.log(endpoints, "endpoints");
    const [selectedEndpoint, setSelectedEndpoint] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const fetchData = async () => {
        const data = {
          orgID: orgId,
          applicationName: name,
          applicationVendor: vendor,
        };
        try {
          setLoading(true);
          const response = await fetchInventoryApplicationsEndpointsUrl(data);
          setEndpoints(response);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      useEffect(() => {
          fetchData();
      }, []);
    const navigate = useNavigate();

    const goToRiskPage = () => {
        navigate("/qradar/application/list");
    };

    const goToPolicyPage = () => {
        navigate("/qradar/application/policy");
        const activeTab = sessionStorage.getItem("activeTab");
        if (activeTab === "policy") {
            sessionStorage.removeItem("activeTab");
        }
    };
    const handleEndpointClick = (item) => {
        setSelectedEndpoint(item);
        setShowPopup(true);
      };

    return (
        <div className="">
        <div className="">
          <h1>Application Management</h1>
        </div>
        <div className="d-flex">
                <div className="button btn btn-primary text-bg-light" onClick={goToRiskPage}>
                    Risk
                </div>
                <div className="button btn btn-primary text-bg-light" >
                    Inventory
                </div>
                <div className="button btn btn-primary text-bg-light"onClick={goToPolicyPage}>
                    Policy
                </div>
            </div>
            <table className="table alert-table scroll-x mg-top-20">
          <thead>
            <tr>
              <th className="fs-12">Endpoint Name</th>
              <th className="fs-12">OS</th>
              <th className="fs-12">OS Version</th>
              <th className="fs-12">Type</th>
              <th className="fs-12">Account</th>
              <th className="fs-12">Site</th>
              <th className="fs-12">Group</th>
              <th className="fs-12">Domain</th>
              <th className="fs-12">Application Detection Date</th>
              <th className="fs-12">Day from Detection</th>
              <th className="fs-12">Last successful scan</th>
              <th className="fs-12">Last scan result</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {endpoints !== null && endpoints !== undefined && endpoints.length > 0 ? (
              endpoints?.map((item) => (
                <tr key={item.id}>
                  <td onClick={() => handleEndpointClick(item)}>
                    {item.endpointName}
                  </td>
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
        <EndpointPopup
        selectedEndpoint={selectedEndpoint}
        showModal={showPopup}
        setShowModal={setShowPopup}
      />
        </div>
    );
}

export default InventoryComponentUpdate;
