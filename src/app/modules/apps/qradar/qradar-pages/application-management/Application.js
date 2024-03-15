import React, { useState } from "react";
import RisksComponent from "./RisksComponent";
import InventoryComponent from "./InventoryComponent";
import Policy from "./Policy";

function Application() {
  const [activeTab, setActiveTab] = useState("risks");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  return (
    <div className="ldc-application">
      <div className="row">
        <div className="col-md-12">
          <h1>Application Management</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex border-btm mg-btm-10 mg-top-10">
            <ul className="nav nav-tabs p-0 border-0 fs-12">
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "risks" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("risks")}
                >
                  RISKS
                </a>
              </li>
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "inventory" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("inventory")}
                >
                  INVENTORY
                </a>
              </li>
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "policy" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("policy")}
                >
                  POLICY
                </a>
              </li>
            </ul>
          </div>
          {activeTab === "risks" && <RisksComponent />}
          {activeTab === "inventory" && <InventoryComponent />}
          {activeTab === "policy" && <Policy />}
        </div>
      </div>
    </div>
  );
}

export default Application;
