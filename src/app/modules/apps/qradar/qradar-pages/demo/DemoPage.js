import { useState } from "react";
import { DemoAlert } from "./DemoAlert";
import { render } from "react-dom";
import { Modal } from "react-bootstrap";
import { MasterLayout } from "../../../../../../_metronic/layout/MasterLayout";
import { HeaderWrapper } from "../../../../../../_metronic/layout/components/header";
import { Sidebar } from "../../../../../../_metronic/layout/components/sidebar";
import { Content } from "../../../../../../_metronic/layout/components/content";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const DemoPage = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  const [alert, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  function createIncidentSubmit() {
    setTimeout(() => {
      navigate("/qradar/incidentscollaboration");
    }, 500);
  }

  const datatoBeadded = [
    {
      alertID: 11,
      alertDevicePKID: 0,
      toolID: 1,
      orgID: 1,
      name: "Add SMB  Exploit Alert",
      severity: "Low",
      score: 8,
      status: "New",
      sla: "1h 11m",
      statusID: null,
      detectedtime: null,
      observableTagID: 1,
      observableTag: "BruteForce",
      ownerUserID: 0,
      ownerusername: "admin",
      source: "QRadar",
      alertData: null,
      createdUser: null,
      processed: 0,
    },
    {
      alertID: 12,
      alertDevicePKID: 0,
      toolID: 1,
      orgID: 1,
      name: "Add CYREN Alert",
      severity: "Low",
      score: 7,
      status: "New",
      sla: "2h 10m",
      statusID: null,
      detectedtime: null,
      observableTagID: 1,
      observableTag: "Authentication",
      ownerUserID: 0,
      ownerusername: "analyst",
      source: "QRadar",
      alertData: null,
      createdUser: null,
      processed: 0,
    },
    {
      alertID: 13,
      alertDevicePKID: 0,
      toolID: 1,
      orgID: 1,
      name: "Add Insights Alert",
      severity: "Low",
      score: 6,
      status: "New",
      sla: "3h 21m",
      statusID: null,
      detectedtime: null,
      observableTagID: "null",
      observableTag: "Credential Access",
      ownerUserID: 0,
      ownerusername: "admin",
      source: "QRadar",
      alertData: null,
      createdUser: null,
      processed: 0,
    },
    {
      alertID: 14,
      alertDevicePKID: 0,
      toolID: 1,
      orgID: 1,
      name: "Failed Login Alert",
      sla: "5h 11m",
      severity: "Medium",
      score: 3,
      status: "New",
      statusID: null,
      detectedtime: null,
      observableTagID: null,
      observableTag: "BruteForce",
      ownerUserID: 0,
      ownerusername: "Global Admin",
      source: "QRadar",
      alertData: null,
      createdUser: null,
      processed: 0,
    },
    {
      alertID: 15,
      alertDevicePKID: 0,
      toolID: 1,
      orgID: 1,
      name: "Add Channel Post",
      severity: "Medium",
      score: 2,
      status: "New",
      statusID: null,
      detectedtime: null,
      observableTagID: null,
      observableTag: "BruteForce",
      ownerUserID: 0,
      ownerusername: null,
      source: "QRadar",
      alertData: null,
      createdUser: null,
      processed: 0,
    },
    {
      alertID: 16,
      alertDevicePKID: 0,
      toolID: 1,
      orgID: 1,
      name: " Add Checkpoint Alert",
      severity: "Medium",
      score: 1,
      status: "New",
      statusID: null,
      detectedtime: null,
      observableTagID: null,
      observableTag: "Credential Access",
      ownerUserID: 0,
      ownerusername: null,
      source: "QRadar",
      alertData: null,
      createdUser: null,
      processed: 0,
    },
    {
      alertID: 17,
      alertDevicePKID: 0,
      toolID: 1,
      orgID: 1,
      name: " New XML Incident",
      severity: "Medium",
      score: 2,
      status: "New",
      statusID: null,
      detectedtime: null,
      observableTagID: null,
      observableTag: "Credential Access",
      ownerUserID: 0,
      ownerusername: null,
      source: "QRadar",
      alertData: null,
      createdUser: null,
      processed: 0,
    },
    {
      alertID: 18,
      alertDevicePKID: 0,
      toolID: 1,
      orgID: 1,
      name: "Add Scanning Alert",
      severity: "High",
      score: 3,
      status: "New",
      sla: "2h 10m",
      statusID: null,
      detectedtime: null,
      observableTagID: null,
      observableTag: "Credential Access",
      ownerUserID: 0,
      ownerusername: null,
      source: "QRadar",
      alertData: null,
      createdUser: null,
      processed: 0,
    },
    {
      alertID: 19,
      alertDevicePKID: 0,
      toolID: 1,
      orgID: 1,
      name: " Add WDATP Alert",
      severity: "High",
      score: 4,
      status: "New",
      statusID: null,
      detectedtime: null,
      observableTagID: null,
      observableTag: "Credential Access",
      ownerUserID: 0,
      ownerusername: null,
      source: "QRadar",
      alertData: null,
      createdUser: null,
      processed: 0,
    },
    {
      alertID: 20,
      alertDevicePKID: 0,
      toolID: 1,
      orgID: 1,
      name: "Suspecious mail",
      sla: "4h 40m",
      severity: "High",
      score: 2,
      status: "New",
      statusID: null,
      detectedtime: null,
      observableTagID: null,
      observableTag: "Authentication",
      ownerUserID: 0,
      ownerusername: null,
      source: "QRadar",
      alertData: null,
      createdUser: null,
      processed: 0,
    },
  ];
  const localAlert = JSON.parse(localStorage.getItem("alertData"));
  if (localStorage.getItem("alertData") === null) {
    localStorage.setItem("alertData", JSON.stringify([]));
  }

  const notify = (e) => {
    // console.log(e)
    toast.success(e, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };
  if (status === "v2") {
    console.log("status == ", status);
    // setTimeout(() => {
    //   navigate("/qradar/demoalert/updated");
    // }, 4000);
    navigate("/qradar/demoalert/updated");
  }
  const addalerttolocal = (e) => {
    localAlert.push(e);
    setLoading(true);
    localStorage.setItem("alertData", JSON.stringify(localAlert));
    localStorage.setItem("alertadded", JSON.stringify(1));
    navigate("/qradar/demoalert/updated");
  };

  const addalerttolocalv1 = (e) => {
    localAlert.push(e);
    setLoading(true);
    localStorage.setItem("alertData", JSON.stringify(localAlert));
    localStorage.setItem("alertadded", JSON.stringify(1));
    navigate("/qradar/demoalertv1/updated");
  };

  const addLoginFailAlert = () => {
    setLoading(true);
    setTimeout(() => {
      addalerttolocal(datatoBeadded["3"]);
      navigate("/qradar/demo/v2");
      // navigate('/qradar/demoalert/updated')
    }, 500);
  };

  return (
    <div className="row demo-page">
      <ToastContainer />
      <div className="mb-10">
        <a
          href="#"
          onClick={() => {
            localStorage.setItem("alertData", JSON.stringify([]));
          }}
          className="btn btn-danger btn-small"
        >
          Reset
        </a>
      </div>

      {/* Begin Col */}
      <div className="col-lg-5">
        <div className="card mb-5 mb-xl-8">
          <h5 className="bg-heading">Security Monitoring</h5>
          <div className="card-body">
            <div className="demo-block">
              <p>
                Add an alert from Int Sight about SMB exploit named EternalBlue
              </p>
              <a
                onClick={() => {
                  addalerttolocal(datatoBeadded["0"]);
                }}
              >
                <button className="btn btn-new">Add SMB Exploit Alert</button>
              </a>
            </div>
            <div className="demo-block">
              <p>Start collaboration on the latest modified incident</p>
              <button
                onClick={() => {
                  addalerttolocal(datatoBeadded["0"]);
                }}
                className="btn btn-success"
              >
                Start Collaboration
              </button>
            </div>
          </div>
        </div>
        <div className="card mb-5 mb-xl-8 h-420px">
          <h5 className="bg-heading">Leaked Credentials - Use Cases</h5>
          <div className="card-body">
            <div className="demo-block">
              <p>Add Insights alert</p>
              <button
                onClick={() => {
                  addalerttolocal(datatoBeadded["2"]);
                }}
                className="btn btn-new"
              >
                Add Insights Alert
              </button>
            </div>
            <div className="demo-block">
              <p>Start collaboration on the latest Intsights incident</p>
              <button
                onClick={() => {
                  addalerttolocalv1(datatoBeadded["2"]);
                }}
                className="btn btn-success"
              >
                Start Collaboration
              </button>
            </div>
            <div className="demo-block">
              <p>Failed Login Alert</p>

              <button
                onClick={() => {
                  addalerttolocal(datatoBeadded["3"]);
                }}
                className="btn btn-new"
              >
                Add Failed Login Alert
              </button>
            </div>
            <div className="demo-block">
              <p>Start collaboration on the latest failed login incident</p>
              <button
                onClick={() => {
                  addalerttolocalv1(datatoBeadded["3"]);
                }}
                className="btn btn-success"
              >
                Start Collaboration
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End Col */}

      {/* Begin Col */}
      <div className="col-lg-7">
        <div className="card mb-5 mb-xl-8">
          <h5 className="bg-heading">Automation</h5>
          <div className="card-body">
            <div className="demo-block">
              <p>
                Add an alert with known IOC (Open incident automatically -
                CYREN)
              </p>
              <button
                onClick={() => {
                  addalerttolocal(datatoBeadded["1"]);
                }}
                className="btn btn-new"
              >
                Add CYREN Alert
              </button>
            </div>
          </div>
        </div>
        <div className="mb-5 mb-xl-8">
          <div className="row">
            <div className="col-lg-6">
              <div className="card">
                <h5 className="bg-heading">Threat Intelligence</h5>
                <div className="card-body">
                  <div className="demo-block">
                    <p>Add Channel Post</p>
                    {/* <button className='btn btn-new'>Add Channel Post</button> */}
                    <button
                      onClick={() => {
                        addalerttolocal(datatoBeadded["4"]);
                      }}
                      className="btn btn-new"
                    >
                      Add Channel Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card">
                <h5 className="bg-heading">Malware Alert</h5>
                <div className="card-body">
                  <div className="demo-block">
                    <p>Add Checkpoint</p>
                    <button
                      onClick={() => {
                        addalerttolocal(datatoBeadded["5"]);
                      }}
                      className="btn btn-new"
                    >
                      Add Checkpoint Alert
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5 mb-xl-8">
          <div className="row">
            <div className="col-lg-7">
              <div className="card">
                <h5 className="bg-heading">Vulnerability Management</h5>
                <div className="card-body">
                  <div className="demo-block">
                    <p>New XML Incident</p>
                    <button
                      onClick={() => {
                        addalerttolocal(datatoBeadded["6"]);
                      }}
                      className="btn btn-new"
                    >
                      New XML Incident
                    </button>
                  </div>
                  <div className="demo-block">
                    <p>Start collaborating on latest XM incident</p>

                    <button
                      onClick={() => {
                        addalerttolocal(datatoBeadded["6"]);
                      }}
                      className="btn btn-success"
                    >
                      Start Collaboration
                    </button>
                  </div>
                </div>
              </div>
              <div className="card mt-8">
                <h5 className="bg-heading">Suspicious mail</h5>
                <div className="card-body">
                  <div className="demo-block">
                    <p>Start Collaboration </p>

                    <button
                      onClick={() => {
                        addalerttolocalv1(datatoBeadded["9"]);
                      }}
                      className="btn btn-success"
                    >
                      Start Collaboration
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card">
                <h5 className="bg-heading">Blacklist</h5>
                <div className="card-body">
                  <div className="demo-block">
                    <p>Add Scanning Alert</p>
                    <button
                      onClick={() => {
                        addalerttolocal(datatoBeadded["7"]);
                      }}
                      className="btn btn-new"
                    >
                      Add Scanning Alert
                    </button>
                    {/* <a href='alerts'>
                      <button className='btn btn-new'>Add Scanning Alert</button>
                    </a> */}
                  </div>
                </div>
              </div>
              <div className="card mt-8">
                <h5 className="bg-heading">Malicious code</h5>
                <div className="card-body">
                  <div className="demo-block">
                    <p>Add WDATP Alert</p>
                    <button
                      className="btn btn-new"
                      onClick={() => {
                        addalerttolocal(datatoBeadded["8"]);
                      }}
                    >
                      Add WDATP Alert
                    </button>
                    {/* <a href='alerts'>
                      <button className='btn btn-new'>Add WDATP Alert</button>
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Col */}
    </div>
  );
};

export { DemoPage };
