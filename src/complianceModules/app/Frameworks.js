import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import FrameworksCard from "./FrameworksCard";

function Frameworks() {
  return (
    <div className="compliance framework">
      <h2>Frameworks</h2>
      <div className="add-framework mg-btm-10">
        <button className="btn btn-primary float-right">
          Create new custom framework
        </button>
      </div>
      <div className="clearfix"></div>
      <div className="row">
        <FrameworksCard />
      </div>
    </div>
  );
}

export default Frameworks;
