import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Endpoints from './Endpoints';
import Cves from './Cves';
import Application from './Application';

function RiskComponentUpdate() {
  const { id } = useParams();
  console.log(id, "id")
  const [points, setPoints] = useState("endpoints");
  
  return (
    <>
      {/* <div><Application/></div> */}
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex border-btm mg-btm-10 mg-top-10">
            <ul className="nav nav-tabs p-0 border-0 fs-12">
              <li className="nav-item">
                <a
                  className={`nav-link normal pointer ${
                    points === "endpoints" ? "active" : ""
                  }`}
                  onClick={() => setPoints("endpoints")}
                >
                  Endpoints
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link normal pointer ${
                    points === "cves" ? "active" : ""
                  }`}
                  onClick={() => setPoints("cves")}
                >
                  CVEs
                </a>
              </li>
            </ul>
          </div>
          {points === "endpoints" && <Endpoints id={id} />}
          {points === "cves" && <Cves id={id} />}
        </div>
      </div>
    </>
  );
}

export default RiskComponentUpdate;
