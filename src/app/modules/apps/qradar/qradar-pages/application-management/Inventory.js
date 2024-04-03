import { useEffect, useState } from "react";
import { fetchEndPointApplicationsUrl } from "../../../../../api/ApplicationSectionApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { getCurrentTimeZone } from "../../../../../../utils/helper";

function Inventory({ id }) {
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]);
  console.log(id, "id");
  console.log(inventory, "inventory");
  const fetchData = async () => {
    const data = {
      orgID: orgId,
      endPointId: id,
    };
    try {
      setLoading(true);
      const response = await fetchEndPointApplicationsUrl(data);
      setInventory(response.data);
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
      <table className="table align-middle gs-0 gy-4 dash-table alert-table mt-2 h-300px scroll-y">
        <thead>
          <tr className="fw-bold text-muted bg-blue">
            <th>Name </th>
            <th>Installed Date</th>
            <th>Size</th>
            <th>Version</th>
            <th>Publisher</th>
          </tr>
        </thead>
        <tbody>
          {inventory?.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{getCurrentTimeZone(item.installedDate)}</td>
              <td>{item.size ?? 0}</td>
              <td>{item.version}</td>
              <td>{item.publisher}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
