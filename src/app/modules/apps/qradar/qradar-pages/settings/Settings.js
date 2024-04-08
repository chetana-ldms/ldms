import React, { useState } from "react";
import Accounts from "./Accounts";
import Sites from "./Sites";

function Settings() {
  const [activeTab, setActiveTab] = useState("accounts");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="ldc-application">
      <div className="row">
        <div className="col-md-12">
          <h1>Settings</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex border-btm mg-btm-10 mg-top-10">
            <ul className="nav nav-tabs p-0 border-0 fs-12">
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "accounts" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("accounts")}
                >
                  Accounts
                </a>
              </li>
              <li className="nav-item text-center">
                <a
                  className={`nav-link normal pointer ${
                    activeTab === "sites" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("sites")}
                >
                  Sites
                </a>
              </li>
             
            </ul>
          </div>
          {activeTab === "accounts" && <Accounts />}
          {activeTab === "sites" && <Sites />}
        </div>
      </div>
    </div>
  );
}

export default Settings;
