import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { fetchApplicationsAndRisksUrl } from '../../../../../api/ApplicationSectionApi';
import { getCurrentTimeZone } from '../../../../../../utils/helper';
import { UsersListLoading } from '../components/loading/UsersListLoading';
import RiskEndpointPopUp from './RiskEndpointPopUp';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { renderSortIcon, sortedItems } from '../../../../../../utils/Sorting';
import Pagination from '../../../../../../utils/Pagination';
import { fetchExportDataAddUrl } from '../../../../../api/Api';

function RisksComponent() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [risk, setRisk] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  console.log(currentPage, "currentPage")
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [activePage, setActivePage] = useState(0); 
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });
  const orgId = Number(sessionStorage.getItem('orgId'));
  const accountId = sessionStorage.getItem('accountId');
  const siteId = sessionStorage.getItem('siteId');
  const groupId = sessionStorage.getItem('groupId');

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
      const response = await fetchApplicationsAndRisksUrl(data);
      setRisk(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accountId, siteId, groupId, itemsPerPage]);

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = risk
    ? sortedItems(
        risk.filter((item) => item.name.toLowerCase().includes(filterValue.toLowerCase())),
        sortConfig
      ).slice(indexOfFirstItem, indexOfLastItem)
    : null;

  const filteredList = filterValue
    ? risk.filter((item) => item.name.toLowerCase().includes(filterValue.toLowerCase()))
    : risk;

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    setSortConfig({ key, direction });
  };

  const handlePageSelect = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
    setActivePage(0) 
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected);
    setActivePage(selected.selected);
  };

  const exportTableToCSV = async () => {
    const tableData = extractTableData(filteredList);
    exportToCSV(tableData);
    const data = {
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'Risk',
    };
    try {
      const response = await fetchExportDataAddUrl(data);
    } catch (error) {
      console.error(error);
    }
  };

  const exportCurrentTableToCSV = async () => {
    const tableData = extractTableData(currentItems);
    exportToCSV(tableData);
    const data = {
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'Risk',
    };
    try {
      const response = await fetchExportDataAddUrl(data);
    } catch (error) {
      console.error(error);
    }
  };

  const extractTableData = (items) => {
    return items.map((item) => ({
      Name: item.name,
      Vendor: item.vendor,
      'Highest Severity': item.highestSeverity,
      'Highest NVD Base Score': item.highestNvdBaseScore ?? 0,
      'Number of CVEs': item.cveCount,
      'Number of Endpoints': item.endpointCount,
      'Application Detection Date': getCurrentTimeZone(item.detectionDate),
      'Days from Detection': item.daysDetected,
    }));
  };

  const convertToCSV = (data) => {
    const header = Object.keys(data[0]).join(',') + '\n';
    const body = data.map((item) => Object.values(item).join(',')).join('\n');
    return header + body;
  };

  const exportToCSV = (data) => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const fileName = 'risk_data.csv';
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleFilterChange = (event) => {
    setCurrentPage(0); // Set to 0 for the first page
    setActivePage(0); // Set to 0 for the first page
    setFilterValue(event.target.value);
  };

  return (
    <div>
      {loading ? (
        <UsersListLoading />
      ) : (
        <>
          <div className='application-section card pad-10 mt-5 mb-5'>
            <div className='row header-filter mb-5'>
              <div className='col-lg-9'>
                <input
                  type='text'
                  placeholder='Search...'
                  className='form-control'
                  value={filterValue}
                  onChange={handleFilterChange}
                />
              </div>
              <div className='col-lg-3 d-flex justify-content-between'>
                <div className='fs-15 mt-2'>
                  {' '}
                  Total({currentItems.length}/{filteredList.length})
                </div>
                <div className=''>
                  <div className='export-report border-0 float-right'>
                    <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                      <DropdownToggle className='no-pad'>
                        <div className='btn btn-border btn-small'>
                          Export <i className='fa fa-file-export link mg-left-5' />
                        </div>
                      </DropdownToggle>
                      <DropdownMenu className='w-auto'>
                        <DropdownItem onClick={exportTableToCSV} className='border-btm'>
                          <i className='fa fa-file-excel link mg-right-5' /> Export Full Report
                        </DropdownItem>
                        <DropdownItem onClick={exportCurrentTableToCSV}>
                          <i className='fa fa-file-excel link mg-right-5' /> Export Current Page
                          Report
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>

            <table className='table alert-table fixed-table scroll-x'>
              <thead>
                <tr className='fw-bold text-muted bg-blue'>
                  <th onClick={() => handleSort('name')}>
                    Name {renderSortIcon(sortConfig, 'name')}
                  </th>
                  <th onClick={() => handleSort('vendor')}>
                    Vendor {renderSortIcon(sortConfig, 'vendor')}
                  </th>
                  <th onClick={() => handleSort('highestSeverity')}>
                    Highest Severity {renderSortIcon(sortConfig, 'highestSeverity')}
                  </th>
                  <th onClick={() => handleSort('highestNvdBaseScore')}>
                    Highest NVD Base Score {renderSortIcon(sortConfig, 'highestNvdBaseScore')}
                  </th>
                  <th onClick={() => handleSort('cveCount')}>
                    Number of CVEs {renderSortIcon(sortConfig, 'cveCount')}
                  </th>
                  <th onClick={() => handleSort('endpointCount')}>
                    Number of Endpoints {renderSortIcon(sortConfig, 'endpointCount')}
                  </th>
                  <th onClick={() => handleSort('detectionDate')}>
                    Application Detection Date {renderSortIcon(sortConfig, 'detectionDate')}
                  </th>
                  <th onClick={() => handleSort('daysDetected')}>
                    Days From Detection {renderSortIcon(sortConfig, 'daysDetected')}
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentItems !== null ? (
                  currentItems.map((item, index) => (
                    <tr key={index} className='table-row'>
                      <td onClick={() => handleItemClick(item)} className='link-txt'>
                        {item.name}
                      </td>
                      <td>{item.vendor}</td>
                      <td>{item.highestSeverity}</td>
                      <td>{item.highestNvdBaseScore ?? 0}</td>
                      <td>{item.cveCount}</td>
                      <td>{item.endpointCount}</td>
                      <td>{getCurrentTimeZone(item.detectionDate)}</td>
                      <td>{item.daysDetected}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
            <RiskEndpointPopUp
              selectedItem={selectedItem}
              showModal={showPopup}
              setShowModal={setShowPopup}
            />
            {risk && (
              <Pagination
                pageCount={Math.ceil(filteredList.length / itemsPerPage)}
                handlePageClick={handlePageClick}
                itemsPerPage={itemsPerPage}
                handlePageSelect={handlePageSelect}
                forcePage={activePage}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default RisksComponent;
