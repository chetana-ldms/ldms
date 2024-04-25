import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";

function Frameworks() {
  const frameworksData = [
    {
      title: "CCM v4",
      percentage: 26,
      requirements: "12/197",
      inScopeControls: "251"
    },
    {
      title: "CCPA",
      percentage: 7,
      requirements: "0/48",
      inScopeControls: "1"
    },
    {
      title: "Client E8 Demo",
      percentage: 0,
      requirements: "0/110",
      inScopeControls: "0"
    },
    {
      title: "CMMC",
      percentage: 10,
      requirements: "10/410",
      inScopeControls: "10"
    },
    {
      title: "FedRAMP",
      percentage: 0,
      requirements: "0/349",
      inScopeControls: "0"
    },
    {
      title: "FFIEC",
      percentage: 13,
      requirements: "12/197",
      inScopeControls: "251"
    }
  ];

  return (
    <div className="compliance framework">
      <div className="row">
        {frameworksData.map((framework, index) => (
          <div className="col-lg-4" key={index}>
            <div className="card">
              <h4 className="blue-txt mg-btm-10">{framework.title}</h4>
              <CircularProgressbar value={framework.percentage} text={`${framework.percentage}%`} />
              <div className="frame-btm row">
                <div className="col-lg-6">
                  <div className="row">
                    <div className="col-lg-2">
                      <i className="fa fa-check-circle mg-top-20 green" />
                    </div>
                    <div className="col-lg-10">
                      <p className="bold fs-20">{framework.requirements}</p>
                      <span>Requirements</span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="row">
                    <div className="col-lg-2">
                      <i className="fa fa-sliders mg-top-20 red" />
                    </div>
                    <div className="col-lg-10">
                      <p className="bold fs-20">{framework.inScopeControls}</p>
                      <span>In-scope Controls</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Frameworks;
