import { useEffect, useState } from 'react';
import { fetchBlokckedListUrl } from '../../../../../api/SentinalApi';
import { UsersListLoading } from '../components/loading/UsersListLoading';
import Pagination from '../../../../../../utils/Pagination';
import { getCurrentTimeZone } from '../../../../../../utils/helper';
import BlockListPopUp from './BlockListPopUp';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

function BlockList() {
  const orgId = Number(sessionStorage.getItem('orgId'));
  const [loading, setLoading] = useState(false);
  const [blockList, setBlockList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showPopup, setShowPopup] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [includeChildren, setIncludeChildren] = useState(true); // Initially set to true
  const [includeParents, setIncludeParents] = useState(true); // Initially set to true
  const [formSubmitted, setFormSubmitted] = useState(false);

  const fetchData = async () => {
    const data = {
      orgID: orgId,
      includeChildren: includeChildren,
      includeParents: includeParents,
    };
    try {
      setLoading(true);
      const response = await fetchBlokckedListUrl(data);
      setBlockList(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [includeChildren, includeParents]);

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = blockList !== null ? blockList.slice(indexOfFirstItem, indexOfLastItem) : [];

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected);
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  const handleCheckboxChange = (event) => {
    const checkboxName = event.target.name;
    const isChecked = event.target.checked;

    if (checkboxName === 'thisScopeAndItsAncestors') {
      setIncludeParents(isChecked);
    } else if (checkboxName === 'thisScopeAndItsDescendants') {
      setIncludeChildren(isChecked);
    }
  };

  
  return (
    <div>
      {loading ? (
        <UsersListLoading />
      ) : (
        <>
          <div className='row'>
            <div className='col-lg-6'>
              <Dropdown isOpen={dropdown} toggle={() => setDropdown(!dropdown)}>
                <DropdownToggle className='no-pad'>
                  <div className='btn btn-new btn-small'>All related scopes</div>
                </DropdownToggle>
                <DropdownMenu className='w-auto px-5'>
                  <label className='dropdown-checkbox'>
                    <input
                      type='checkbox'
                      name='thisScopeAndItsAncestors'
                      onChange={handleCheckboxChange}
                      checked={includeParents} // Set checked state
                    />
                    <span>
                      <i className='link mg-right-5' /> This scope and its ancestors
                    </span>
                  </label>{' '}
                  <br />
                  <label className='dropdown-checkbox'>
                    <input
                      type='checkbox'
                      name='thisScopeAndItsDescendants'
                      onChange={handleCheckboxChange}
                      checked={includeChildren} // Set checked state
                    />
                    <span>
                      <i className='link mg-right-5' /> This scope and its descendants
                    </span>
                  </label>
                </DropdownMenu>
              </Dropdown>

              <button className='btn btn-new btn-small float-left' onClick={openPopup}>
                Add New
              </button>
              {showPopup && <BlockListPopUp show={openPopup} onClose={closePopup} />}
              <div className='float-left mg-left-10'>
                <button className='btn btn-new btn-small float-left'>Delete selection</button>
              </div>
            </div>
            <div className='col-lg-6 text-right'>
              <span className='gray inline-block mg-righ-20'>530 Items</span>
              <span className='inline-block mg-left-10 link'>
                Export <i className='fas fa-file-export link' />
              </span>
            </div>
          </div>
          {currentItems.length > 0 && (
            <>
              <table className='table alert-table scroll-x'>
                <thead>
                  <tr>
                    <th>
                      <input type='checkbox' name='selectAll' />
                    </th>
                    <th>OS</th>
                    <th>Description </th>
                    <th>Hash</th>
                    <th>Scope Path</th>
                    <th>User </th>
                    <th>warning</th>
                    <th>Last Update</th>
                    <th>Source </th>
                    <th>Scope </th>
                    <th>Imported</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems !== null ? (
                    currentItems?.map((item) => (
                      <tr className='table-row' key={item.id}>
                        <td>
                          <input type='checkbox' name={`checkbox_${item.id}`} />
                        </td>
                        <td>{item.osType}</td>
                        <td>{item.description}</td>
                        <td>{item.value}</td>
                        <td>{item.scopePath}</td>
                        <td>{item.userName}</td>
                        <td>{item.notRecommended}</td>
                        <td>{getCurrentTimeZone(item.updatedAt)}</td>
                        <td>{item.source}</td>
                        <td>{item.scopeName}</td>
                        <td>{item.imported ? 'Yes' : 'No'}</td>
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
                pageCount={Math.ceil(blockList.length / itemsPerPage)}
                handlePageClick={handlePageClick}
                itemsPerPage={itemsPerPage}
                handlePageSelect={handlePageSelect}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default BlockList;
