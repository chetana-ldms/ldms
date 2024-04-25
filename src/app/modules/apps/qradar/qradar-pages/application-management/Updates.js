import { useEffect, useState } from "react";
import { fetchEndPointUpdatesUrl } from "../../../../../api/ApplicationSectionApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { getCurrentTimeZone } from "../../../../../../utils/helper";

function Updates({ id }) {
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]);
  const fetchData = async () => {
    const data = {
      orgID: orgId,
      endPointId: id,
    };
    try {
      setLoading(true);
      const response = await fetchEndPointUpdatesUrl(data);
      setInventory(response);
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
      {loading && <UsersListLoading />}
      <table className="table align-middle gs-0 gy-4 dash-table alert-table mt-2">
        <thead>
          <tr className="fw-bold text-muted bg-blue">
            <th>Name </th>
            <th>Category</th>
            <th>ID</th>
            <th>Applied Date</th>
          </tr>
        </thead>
        <tbody>
          {inventory !== null ? (
            inventory?.map((item, index) => (
              <tr key={index}>
                <td>{item.displayName}</td>
                <td>{item.assetFamilyType}</td>
                <td>{item.liveUpdateId}</td>
                <td>{getCurrentTimeZone(item.appliedAt)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Updates;
