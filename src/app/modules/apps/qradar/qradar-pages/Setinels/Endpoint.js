import {useEffect, useState} from 'react'
import {fetchAEndPointDetailsUrl} from '../../../../../api/ApplicationSectionApi'
import { UsersListLoading } from '../components/loading/UsersListLoading'

function Endpoint() {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [loading, setLoading] = useState(false)
  const [endpoints, setEndpoints] = useState([])
  console.log(endpoints, "endpoints11111")

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      endPiontId: "",
    };
    try {
      setLoading(true);
      const response = await fetchAEndPointDetailsUrl(data);
    //   const [firstEndpoint] = response;
      setEndpoints(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <div>
      <table className='table alert-table mg-top-20'>
        <thead>
          <tr>
            <th>Endpoint Name</th>
            <th>Account </th>
            <th> Site</th>
            <th>Last Logged in user</th>
            <th>Group</th>
            <th>Domain</th>
            <th>Console Visible Ip</th>
            <th>Agent Version</th>
            <th>Last Active</th>
            <th>Register on</th>
            <th>Device Type</th>
            <th>Os</th>
            <th>Os Version</th>
            <th>Architecture</th>
            <th>CPU Count</th>
            <th>Core count</th>
            <th>Network Status</th>
            <th>Full Disk Scan</th>
            <th>IP Adress</th>
            <th>Installer type</th>
            <th>Storage name</th>
            <th>Storage type</th>
            <th>Last successful scan time</th>
            <th>Locations</th>
          </tr>
        </thead>
        <tbody>
            {loading && <UsersListLoading />}
            {endpoints !== null ? (
              endpoints?.map((item, index) => (
                <tr className="table-row" key={index}>
                  <td>{item.computerName}</td>
                  <td>{item.accountName}</td>
                  <td>{item.siteName}</td>
                  <td>{item.lastLoggedInUserName}</td>
                  <td>{item.groupName}</td>
                  <td>{item.domain}</td>
                  <td>{item.externalIp}</td>
                  <td>{item.agentVersion}</td>
                  <td>{item.lastActiveDate}</td>
                  <td>{item.registeredAt}</td>
                  <td>{item.machineType}</td>
                  <td>{item.osName}</td>
                  <td>{item.osRevision}</td>
                  <td>{item.osArch}</td>
                  <td>{item.cpuCount}</td>
                  <td>{item.coreCount}</td>
                  <td>{item.networkStatus}</td>
                  <td>{item.lastSuccessfulScanDate}</td>
                  <td>{item.lastIpToMgmt}</td>
                  <td>{item.installerType}</td>
                  <td>{item.storageName ?? null}</td>
                  <td>{item.storageType ?? null}</td>
                  <td>{item.lastSuccessfulScanDate}</td>
                  <td>{item.locations[0].name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No data found</td>
              </tr>
            )}
          </tbody>
      </table>
    </div>
  )
}

export default Endpoint
