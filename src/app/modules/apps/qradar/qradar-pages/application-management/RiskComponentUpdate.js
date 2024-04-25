import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Endpoints from "./Endpoints";
import Cves from "./Cves";
import ApplicationsNavbar from "./ApplicationsNavbar";

function RiskComponentUpdate() {
  const { id } = useParams();
  const [points, setPoints] = useState("endpoints");
  const [showRiskComponent, setShowRiskComponent] = useState(true);

  return (
    <>
      <div>
        <ApplicationsNavbar setShowRiskComponent={setShowRiskComponent} />
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
      </div>
    </>
  );
}

export default RiskComponentUpdate;
