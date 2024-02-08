import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

function Frameworks() {
  const percentage = 26;
  const per2 = 7;
  const per3 = 0;
  const per4 = 10;
  const per5 = 0;
  const per6 = 13;
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
        <div className="col-lg-4">
          <div className="card">
            <h4 className="blue-txt mg-btm-10">CCM v4</h4>
            <CircularProgressbar value={percentage} text={`${percentage}%`} />
            <div className="frame-btm row">
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-2">
                    <i className="fa fa-check-circle mg-top-20 green" />
                  </div>
                  <div className="col-lg-10">
                    <p className="bold fs-20">12/197</p>
                    <span className="">Requirements</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-2">
                    <i className="fa fa-sliders mg-top-20 red" />
                  </div>
                  <div className="col-lg-10">
                    <p className="bold fs-20">251</p>
                    <span>In-scope Controls</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <h4 className="blue-txt mg-btm-10">CCPA</h4>
            <CircularProgressbar value={per2} text={`${per2}%`} />
            <div className="frame-btm row">
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-2">
                    <i className="fa fa-check-circle mg-top-20 green" />
                  </div>
                  <div className="col-lg-10">
                    <p className="bold fs-20">0/48</p>
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
                    <p className="bold fs-20">1</p>
                    <span className="gray">In-scope Controls</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <h4 className="blue-txt mg-btm-10">Client E8 Demo</h4>
            <CircularProgressbar value={per3} text={`${per3}%`} />
            <div className="frame-btm row">
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-2">
                    <i className="fa fa-check-circle mg-top-20 green" />
                  </div>
                  <div className="col-lg-10">
                    <p className="bold fs-20">0/110</p>
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
                    <p className="bold fs-20">0</p>
                    <span className="gray">In-scope Controls</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-lg-4">
          <div className="card">
            <h4 className="blue-txt mg-btm-10">CMMC</h4>
            <CircularProgressbar value={per4} text={`${per4}%`} />
            <div className="frame-btm row">
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-2">
                    <i className="fa fa-check-circle mg-top-20 green" />
                  </div>
                  <div className="col-lg-10">
                    <p className="bold fs-20">10/410</p>
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
                    <p className="bold fs-20">10</p>
                    <span className="gray">In-scope Controls</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <h4 className="blue-txt mg-btm-10">FedRAMP</h4>
            <CircularProgressbar value={per5} text={`${per5}%`} />
            <div className="frame-btm row">
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-2">
                    <i className="fa fa-check-circle mg-top-20 green" />
                  </div>
                  <div className="col-lg-10">
                    <p className="bold fs-20">0/349</p>
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
                    <p className="bold fs-20">0</p>
                    <span className="gray">In-scope Controls</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <h4 className="blue-txt mg-btm-10">FFIEC</h4>
            <CircularProgressbar value={per6} text={`${per6}%`} />
            <div className="frame-btm row">
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-2">
                    <i className="fa fa-check-circle mg-top-20 green" />
                  </div>
                  <div className="col-lg-10">
                    <p className="bold fs-20">12/197</p>
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
                    <p className="bold fs-20">251</p>
                    <span className="gray">In-scope Controls</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Frameworks;
