import React from 'react';

function NotificationsCard() {
  const notificationsData = [
    { type: "SOC 2 Type 2", status: "Active Audit", count: 6 },
    { type: "PCI DSS", status: "Active Audit", count: 5 },
    { type: "SOC 2 Type 2", status: "Active Audit", count: 3 },
    { type: "SOC 2 Type 2", status: "Active Audit", count: 6 },
    { type: "PCI DSS", status: "Active Audit", count: 5 },
    { type: "SOC 2 Type 2", status: "Active Audit", count: 3 }
  ];

  return (
    <div className="col-lg-3">
      <div className="card">
        <div className="bg-default alert-chart">
          <h4>Notifications</h4>
          <div className="notification">
            {notificationsData.map((notification, index) => (
              <div className="not-section" key={index}>
                <div className="float-left">
                  <p className="blue-txt">{notification.type}</p>
                  <p>{notification.status}</p>
                </div>
                <div className="float-right">
                  <span className="not-red">{notification.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsCard;
