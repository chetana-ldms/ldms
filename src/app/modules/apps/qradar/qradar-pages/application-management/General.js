import {useEffect, useState} from 'react'
import {fetchAEndPointDetailsUrl} from '../../../../../api/ApplicationSectionApi'
import { UsersListLoading } from '../components/loading/UsersListLoading'

function General({id}) {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [loading, setLoading] = useState(false)
  const [general, setGeneral] = useState([])
  console.log(general, 'general')
  const fetchData = async () => {
    const data = {
      orgID: orgId,
      endPiontId: id,
    }
    try {
      setLoading(true)
      const response = await fetchAEndPointDetailsUrl(data)
      const [firstEndpoint] = response
      setGeneral(firstEndpoint)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <div>
      <div className='row'>
      {loading && <UsersListLoading />}
        <div className='col-md-3'>
          <p>icon</p>
        </div>
        <div className='col-md-9'>
          <div>{general?.osName}({general.osArch})</div>
          <div>{general?.accountName}/{general.groupName}</div>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
            <p>Last Active {general?.lastActiveDate}</p>
            <p>Last Logged In {general?.lastLoggedInUserName}</p>
            <p>Agent Version {general?.agentVersion}</p>
            <p>Full disc scan {general?.fullDiskScanLastUpdatedAt}</p>
            <p>CPU {general?.cpuId}</p>
            <p>Core Count {general?.coreCount}</p>
            <p>Ranger Version {general?.rangerVersion}</p>
            <p>Installer Type {general?.installerType}</p>
        </div>
        <div className='col-md-6'>
        <p>UUID {general?.uuid}</p>
        <p>Installer Type {general?.installerType}</p>
        <p>Network Status {general?.networkStatus}</p>
        <p>Domain{general?.domain}</p>
        <p>IP Address {general?.externalIp}</p>
        {/* <p>Locations {general?.locations[0]?.name}</p> */}
        <p>Serial Number {general?.serialNumber}</p>
        </div>
      </div>
      <div>Network Adapter</div>
      <table className="table align-middle gs-0 gy-4 dash-table alert-table">
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
  )
}

export default General
