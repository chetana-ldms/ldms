import React, { useEffect, useState } from "react";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { fetchApplicationManagementSettingsUrl } from "../../../../../api/ApplicationSectionApi";

function Policy() {
  const [loading, setLoading] = useState(false);
  const [policy, setPolicy] = useState({});
  console.log(policy, "policy");

  const orgId = Number(sessionStorage.getItem("orgId"));
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  useEffect(() => {
    const fetchData = async () => {
      const data = {
        orgID: orgId,
      orgAccountStructureLevel: [
        {
          levelName: 'AccountId',
          levelValue: accountId || '',
        },
        {
          levelName: 'SiteId',
          levelValue: siteId || '',
        },
        {
          levelName: 'GroupId',
          levelValue: groupId || '',
        },
      ],
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
    <div className="mt-4 application-policy">
      {loading && <UsersListLoading />}
      {/* Scan Policy Card */}
      <div className="card mb-10 pad-10">
        <h2 className="text-blue">Scan Policy</h2>
        <div className="card-body no-pad">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="vulnerabilitiesScanEnabled"
              checked={policy.vulnerabilitiesScanEnabled || false}
              onChange={handleVulnerabilitiesScanEnabledChange}
            />
            <label
              className="form-check-label black"
              htmlFor="vulnerabilitiesScanEnabled"
            >
              Vulnerabilities and Application Scanning
            </label>
            <p className="gray">schedule weekly scan for wednesdays 10:30AM</p>
          </div>
        </div>
      </div>
      <div className="card pad-10">
        <h2 className="text-blue">Extensive Scan</h2>
        <div className="card-body">
          <div className="card-title">
            <p>
              {" "}
              Produces a more Vulnerability assement levaraging patch data and
              additional security source.
            </p>
            <p>
              {" "}
              OS-level Vulnerability Detection is available for Windows and
              Linux(Requires ranger Insights)
            </p>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="extensiveScanEnabled"
              checked={policy.extensiveScanEnabled || false}
              onChange={handleExtensiveScanEnabledChange}
            />
            <label
              className="form-check-label black"
              htmlFor="extensiveScanEnabled"
            >
              Windows Agents
            </label>
            <p className="gray">
              When Updated requires Approximately 20MB download
            </p>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="extensiveLinuxScanEnabled"
              checked={policy.extensiveLinuxScanEnabled || false}
              onChange={handleExtensiveLinuxScanEnabledChange}
            />
            <label
              className="form-check-label black"
              htmlFor="extensiveLinuxScanEnabled"
            >
              Linux Agents
            </label>
            <p className="gray">
              When updated requires Approximately 35MB download
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Policy;
