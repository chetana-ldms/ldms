import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchApplicationCVSUrl } from "../../../../../api/ApplicationSectionApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { getCurrentTimeZone } from "../../../../../../utils/helper";

function Cves({id}) {
  // let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [endpoints, setEndpoints] = useState([]);
  const orgId = Number(sessionStorage.getItem("orgId"));

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      applicationId: id,
    };
    try {
      setLoading(true);
      const response = await fetchApplicationCVSUrl(data);
      setEndpoints(response);
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
      <table className="table alert-table scroll-x mg-top-20">
        <thead>
          <tr>
            <th className="fs-12">
              <input type="checkbox" />
            </th>
            <th className="fs-12">CVE ID</th>
            <th className="fs-12">Severity</th>
            <th className="fs-12">NDV Base Score</th>
            <th className="fs-12">Published Date</th>
            <th className="fs-12">Discription</th>
            <th className="fs-12">Links</th>
          </tr>
        </thead>
        <tbody>
          {loading && <UsersListLoading />}
          {endpoints !== undefined ? (
            endpoints?.map((item) => (
              <tr key={item.cveId}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{item.cveId}</td>
                <td>{item.severity}</td>
                <td>{item.nvdBaseScore}</td>
                <td>{getCurrentTimeZone(item.publishedDate)}</td>
                <td className="w-200px">{item.description}</td>
                <td>{item.mitreUrl}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12">No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Cves;
