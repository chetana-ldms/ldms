import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import EndpointPopup from "./EndpointPopup";
import { fetchApplicationEndPointsUrl } from "../../../../../api/ApplicationSectionApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import Endpoints from "./Endpoints";
import Cves from "./Cves";

const RiskEndpointPopUp = ({ showModal, setShowModal, selectedItem }) => {
  const id = selectedItem?.applicationId;
  console.log(id, "id1111");
  const [loading, setLoading] = useState(false);
  const [endpoints, setEndpoints] = useState([]);
  console.log(endpoints, "endpoints");
  const [points, setPoints] = useState("endpoints");
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [showRiskComponent, setShowRiskComponent] = useState(true);
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
    fetchData();
  }, [id]);
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      className="fullscreen-modal"
    >
      <Modal.Header closeButton>
        <h1>Risk Details</h1>
        <div className="back btn btn-small btn-border">
          <i className="fa fa-chevron-left link" /> Back
        </div>
      </Modal.Header>
      <Modal.Body>
        {showRiskComponent && (
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex mg-btm-10 mg-top-10">
                <ul className="nav nav-tabs p-0 border-0 fs-12">
                  <li className="nav-item">
                    <a
                      className={`btn btn-small btn-border mg-right-10 ${
                        points === "endpoints" ? "btn-new active" : ""
                      }`}
                      onClick={() => setPoints("endpoints")}
                    >
                      Endpoints
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`btn btn-small btn-border pointer ${
                        points === "cves" ? "btn-new active" : ""
                      }`}
                      onClick={() => setPoints("cves")}
                    >
                      CVEs
                    </a>
                  </li>
                </ul>
              </div>
              {points === "endpoints" && (
                <Endpoints id={id} shouldRender={true} />
              )}
              {points === "cves" && <Cves id={id} />}
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default RiskEndpointPopUp;
