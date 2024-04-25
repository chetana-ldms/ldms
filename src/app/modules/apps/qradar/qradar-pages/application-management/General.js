import { useEffect, useState } from "react";
import { fetchAEndPointDetailsUrl } from "../../../../../api/ApplicationSectionApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";

function General({ id }) {
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [loading, setLoading] = useState(false);
  const [general, setGeneral] = useState([]);
  console.log(id, "id");
  const fetchData = async () => {
    const data = {
      orgID: orgId,
      endPiontId: id,
    };
    try {
      setLoading(true);
      const response = await fetchAEndPointDetailsUrl(data);
      const [firstEndpoint] = response;
      setGeneral(firstEndpoint);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <div className="row mb-2 pad-10">
        {loading && <UsersListLoading />}
        <div className="col-md-2">
          <p className="bold">OS :</p>
        </div>
        <div className="col-md-10">
          <div>
            {general?.osName}({general.osArch})
          </div>
          <div>
            {general?.accountName}/{general.groupName}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <table className="table">
            <tr>
              <td className="bold">Last Active :</td>
              <td>{general?.lastActiveDate}</td>
              <td className="bold">Last Logged In :</td>
              <td>{general?.lastLoggedInUserName}</td>
            </tr>
            <tr>
              <td className="bold">Agent Version :</td>
              <td>{general?.agentVersion}</td>
              <td className="bold">Full disc scan :</td>
              <td>{general?.fullDiskScanLastUpdatedAt}</td>
            </tr>
            <tr>
              <td className="bold">CPU :</td>
              <td>{general?.cpuId}</td>
              <td className="bold">Core Count :</td>
              <td>{general?.coreCount}</td>
            </tr>
            <tr>
              <td className="bold">Ranger Version :</td>
              <td>{general?.rangerVersion}</td>
              <td className="bold">Installer Type :</td>
              <td>{general?.installerType}</td>
            </tr>
            <tr>
              <td className="bold">UUID :</td>
              <td>{general?.uuid}</td>
              <td className="bold">Network Status :</td>
              <td>{general?.networkStatus}</td>
            </tr>
            <tr>
              <td className="bold">Domain :</td>
              <td>{general?.domain}</td>
              <td className="bold">IP Address :</td>
              <td>{general?.externalIp}</td>
            </tr>
            <tr>
              <td className="bold">Serial Number :</td>
              <td>{general?.serialNumber}</td>
            </tr>
          </table>
        </div>
      </div>
      <div className="bold fs-14 mt-3">Network Adapter</div>
      <table className="table align-middle gs-0 gy-4 dash-table alert-table mt-2">
        <thead>
          <tr className="fw-bold text-muted bg-blue">
            <th>Name </th>
            <th>IP</th>
            <th>Mac Address</th>
          </tr>
        </thead>
        <tbody>
          {general?.networkInterfaces?.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.inet[0]}</td>
              <td>{item.gatewayMacAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default General;
