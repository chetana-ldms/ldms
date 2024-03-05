import React, {useState, useEffect} from 'react'
import {fetchApplicationsAndRisksUrl} from '../../../../../api/ApplicationSectionApi'
import { getCurrentTimeZone } from '../../../../../../utils/helper'
import { UsersListLoading } from '../components/loading/UsersListLoading';

function RisksComponent() {
  const [loading, setLoading] = useState(false);
  const [risk, setRisk] = useState([])
  console.log(risk, 'risk')
  const orgId = Number(sessionStorage.getItem('orgId'))

  const fetchData = async () => {
    const data = {
      orgID: orgId,
    }
    try {
      setLoading(true);
      const response = await fetchApplicationsAndRisksUrl(data)
      setRisk(response)
    } catch (error) {
      console.error( error)
    }finally{
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <table className="table align-middle gs-0 gy-4 dash-table alert-table">
        <thead>
        <tr className="fw-bold text-muted bg-blue">
            <th className="min-w-50px fs-12">Application Name</th>
            <th className="min-w-50px fs-12">Type </th>
            <th className="min-w-50px fs-12">Versions </th>
            <th className="min-w-50px fs-12">Vender </th>
            <th className="min-w-50px fs-12"> Highest Severity </th>
            <th className="min-w-50px fs-12">Highest Vulnerability score </th>
            <th className="min-w-50px fs-12">Highest NVD base score </th>
            <th className="min-w-50px fs-12">Most common Status </th>
            <th className="min-w-50px fs-12">Exploited in the Wild </th>
            <th className="min-w-50px fs-12">Exploited Maturity </th>
            <th className="min-w-50px fs-12">Remediation Level </th>
            <th className="min-w-50px fs-12">Number of CVEs</th>
            <th className="min-w-50px fs-12">Number of Endpoints </th>
            <th className="min-w-50px fs-12">Application Detection Date </th>
            <th className="min-w-50px fs-12">Date from Detection </th>
          </tr>
        </thead>
        <tbody>
        {loading && <UsersListLoading />}
          {risk.map((item) => (
            <tr>
              <td>{item.name}</td>
              <td>{item.applicationType}</td>
              <td>{item.versionCount}</td>
              <td>{item.vendor}</td>
              <td>{item.highestSeverity}</td>
              <td></td>
              <td>{item.highestNvdBaseScore ?? 0}</td>
              <td>{item.statuses.find(status => status.count === Math.max(...item.statuses.map(status => status.count))).label}</td>
              <td></td>
              <td></td>
              <td>{item.remediationLevel ?? 0}</td>
              <td>{item.cveCount}</td>
              <td>{item.endpointCount}</td>
              <td>{getCurrentTimeZone(item.detectionDate)}</td>
              <td></td>
           
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RisksComponent
