import React, { useState } from "react";    
import Endpoint from "./Endpoint";
import BlockList from "./BlockList";

function Setinels() {
  const [activeTab, setActiveTab] = useState("endpoint");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  return (
    <div className="ldc-application">
      <div className="row">
        <div className="col-md-12">
          <h1>Setinels</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex border-btm mg-btm-10 mg-top-10">
            <ul className="nav nav-tabs p-0 border-0 fs-12">
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "endpoint" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("endpoint")}
                >
                  Endpoints
                </a>
              </li>
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "blockList" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("blockList")}
                >
                  BlockList
                </a>
              </li>
            </ul>
          </div>
          {activeTab === "endpoint" && <Endpoint />}
          {activeTab === "blockList" && <BlockList />}
        </div>
      </div>
    </div>
  );
}

export default Setinels;
