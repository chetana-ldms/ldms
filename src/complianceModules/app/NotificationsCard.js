import React from 'react';

function NotificationsCard() {
  return (
    <div className="col-lg-3">
      <div className="card">
        <div className="bg-default alert-chart">
          <h4>Notifications</h4>
          <div className="notification">
            <div className="not-section">
              <div className="float-left">
                <p className="blue-txt">SOC 2 Type 2</p>
                <p>Active Audit</p>
              </div>
              <div className="float-right">
                <span className="not-red">6</span>
              </div>
            </div>
            <div className="not-section">
              <div className="float-left">
                <p className="blue-txt">PCI DSS</p>
                <p>Active Audit</p>
              </div>
              <div className="float-right">
                <span className="not-red">5</span>
              </div>
            </div>
            <div className="not-section">
              <div className="float-left">
                <p className="blue-txt">SOC 2 Type 2</p>
                <p>Active Audit</p>
              </div>
              <div className="float-right">
                <span className="not-red">3</span>
              </div>
            </div>
            <div className="not-section">
              <div className="float-left">
                <p className="blue-txt">SOC 2 Type 2</p>
                <p>Active Audit</p>
              </div>
              <div className="float-right">
                <span className="not-red">6</span>
              </div>
            </div>
            <div className="not-section">
              <div className="float-left">
                <p className="blue-txt">PCI DSS</p>
                <p>Active Audit</p>
              </div>
              <div className="float-right">
                <span className="not-red">5</span>
              </div>
            </div>
            <div className="not-section">
              <div className="float-left">
                <p className="blue-txt">SOC 2 Type 2</p>
                <p>Active Audit</p>
              </div>
              <div className="float-right">
                <span className="not-red">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsCard;
