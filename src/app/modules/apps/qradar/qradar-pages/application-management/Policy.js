import React, { useEffect, useState } from 'react';
import { UsersListLoading } from '../components/loading/UsersListLoading';
import { fetchApplicationManagementSettingsUrl } from '../../../../../api/ApplicationSectionApi';

function Policy() {
  const [loading, setLoading] = useState(false);
  const [policy, setPolicy] = useState({});
  console.log(policy, "policy")

  const orgId = Number(sessionStorage.getItem("orgId"));
  useEffect(() => {
    const fetchData = async () => {
      const data = {
        orgID: orgId,
      };
      try {
        setLoading(true);
        const response = await fetchApplicationManagementSettingsUrl(data);
        setPolicy(response.appSettings);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orgId]);

  const handleVulnerabilitiesScanEnabledChange = (event) => {
    setPolicy({
      ...policy,
      vulnerabilitiesScanEnabled: event.target.checked,
    });
  };

  const handleExtensiveScanEnabledChange = (event) => {
    setPolicy({
      ...policy,
      extensiveScanEnabled: event.target.checked,
    });
  };

  const handleExtensiveLinuxScanEnabledChange = (event) => {
    setPolicy({
      ...policy,
      extensiveLinuxScanEnabled: event.target.checked,
    });
  };

  return (
    <div className="container mt-4"> 
      {loading && <UsersListLoading />}
      {/* Scan Policy Card */}
      <div className="card">
        <div className='card-header'>
          Scan Policy
        </div>
        <div className="card-body">
          <div className="form-check"> 
            <input
              className="form-check-input"
              type="checkbox"
              id="vulnerabilitiesScanEnabled"
              checked={policy.vulnerabilitiesScanEnabled || false}
              onChange={handleVulnerabilitiesScanEnabledChange} 
            />
            <label className="form-check-label" htmlFor="vulnerabilitiesScanEnabled">
              Vulnerabilities and Application Scanning
            </label>
            <p>schedule weekly scan for wednesdays 10:30AM</p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className='card-header'>
          Extensive Scan
        </div>
        <div className="card-body">
          <div className="card-title">
            <p>  Produces a more Vulnerability assement levaraging patch data and additional security source.</p>
            <p> OS-level Vulnerability Detection is available for Windows and Linux(Requires ranger Insights)</p>
          </div>
          <div className="form-check"> 
            <input
              className="form-check-input"
              type="checkbox"
              id="extensiveScanEnabled"
              checked={policy.extensiveScanEnabled || false}
              onChange={handleExtensiveScanEnabledChange}
            />
            <label className="form-check-label" htmlFor="extensiveScanEnabled">
              Windows Agents
            </label>
            <p>When Updated requires Approximately 20MB download</p>
          </div>
          <div className="form-check"> 
            <input
              className="form-check-input"
              type="checkbox"
              id="extensiveLinuxScanEnabled"
              checked={policy.extensiveLinuxScanEnabled || false}
              onChange={handleExtensiveLinuxScanEnabledChange} 
            />
            <label className="form-check-label" htmlFor="extensiveLinuxScanEnabled">
              Linux Agents
            </label>
            <p>When updated requires Approximately 35MB download</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Policy;
