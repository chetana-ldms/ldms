import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { fetchAEndPointDetailsUrl } from '../../../../../api/ApplicationSectionApi';
import { UsersListLoading } from '../components/loading/UsersListLoading';
import Pagination from '../../../../../../utils/Pagination';
import { getCurrentTimeZone } from '../../../../../../utils/helper';
import { fetchExclusionListUrl } from '../../../../../api/SentinalApi';

function Exclusions() {
  const orgId = Number(sessionStorage.getItem('orgId'));
  const [loading, setLoading] = useState(false);
  const [exlusions, setExlusions] = useState([]);
  console.log(exlusions, "exlusions111")
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const fetchData = async () => {
    const data = {
      orgID: orgId,
    };
    try {
      setLoading(true);
      const response = await fetchExclusionListUrl(data);
      setExlusions(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageSelect = event => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = exlusions.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = selected => {
    setCurrentPage(selected.selected);
  };

  return (
    <div>
      {loading ? (
        <UsersListLoading />
      ) : (
        <>
         <div className="row">
          <div className="col-lg-6">
            <button className="btn btn-new btn-small float-left mb-3">
              New Exclusion <i className="fa fa-chevron-down white" />
            </button>
          </div>
          <div className="col-lg-6 text-right">
            <span className="gray inline-block mg-righ-20">{exlusions.length} Items</span>
            <span className="inline-block mg-left-10 link">
              Export <i className="fas fa-file-export link" />
            </span>
          </div>
        </div>
        <table className='table alert-table scroll-x'>
          <thead>
            <tr>
                <th>Exclusion Type</th>
                <th>OS</th>
                <th>Application Name</th>
                <th>Inventory Listed</th>
                <th>Description</th>
                <th>Value</th>
                <th>Scope path </th>
                <th>User</th>
                <th>Mode</th>
                <th>Last Update</th>
                <th>Source</th>
                <th>Scope</th>
                <th>Imported</th>
            </tr>
          </thead>
          <tbody>
            {currentItems !== null ? (
              currentItems?.map((item, index) => (
                <tr className='table-row' key={index}>
                  <td></td>
                  <td>{item.osType}</td>
                  <td>{item.applicationName}</td>
                  <td></td>
                  <td>{item.description}</td>
                  <td>{item.value}</td>
                  <td>{item?.scopePath}</td>
                  <td>{item.userName}</td>
                  <td>{item.mode}</td>
                  <td>{getCurrentTimeZone(item.updatedAt)}</td>
                  <td>{item.source}</td>
                  <td>{item.scopeName}</td>
                  <td>{item.imported ? "Yes" : "No"}</td>
                 
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='24'>No data found</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
        pageCount={Math.ceil(exlusions.length / itemsPerPage)}
        handlePageClick={handlePageClick}
        itemsPerPage={itemsPerPage}
        handlePageSelect={handlePageSelect}
      />
      </>
      )}
      
    </div>
  );
}

export default Exclusions;
