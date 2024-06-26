import React, { useState } from "react";
import Endpoint from "./Endpoint";
import BlockList from "./BlockList";
import Exclusions from "./Exclusions";
import AccountDetalis from "./AccountDetalis";
import Policy from "./Policy";

function Setinels() {
  const [activeTab, setActiveTab] = useState("endpoint");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="ldc-application">
      <div className="row">
        <div className="col-md-12">
          <h1>Sentinels</h1>
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
                  Blocklist
                </a>
              </li>
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "exclusions" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("exclusions")}
                >
                  Exclusions
                </a>
              </li>
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "policy" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("policy")}
                >
                  Policy
                </a>
              </li>
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "accountDetalis" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("accountDetalis")}
                >
                  Account Detalis
                </a>
              </li>
             
            </ul>
          </div>
          {activeTab === "endpoint" && <Endpoint />}
          {activeTab === "blockList" && <BlockList />}
          {activeTab === "exclusions" && <Exclusions />}
          {activeTab === "policy" && <Policy />}
          {activeTab === "accountDetalis" && <AccountDetalis />}
        </div>
      </div>
    </div>
  );
}

export default Setinels;
