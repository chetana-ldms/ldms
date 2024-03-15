import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { fetchInventoryApplicationsEndpointsUrl } from '../../../../../api/ApplicationSectionApi';
import EndpointPopup from './EndpointPopup';
import { getCurrentTimeZone } from '../../../../../../utils/helper';
import { UsersListLoading } from '../components/loading/UsersListLoading';

const InventoryEndpointPopUp = ({ showModal, setShowModal, selectedItem }) => {
    console.log(selectedItem, "selectedItem")
    const name = selectedItem?.applicationName;
    const vendor = selectedItem?.applicationVendor;
    const orgId = Number(sessionStorage.getItem("orgId"));
    const [loading, setLoading] = useState(false);
    const [endpoints, setEndpoints] = useState([]);
    console.log(endpoints, "endpoints");
    const [selectedEndpoint, setSelectedEndpoint] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const fetchData = async () => {
        const data = {
          orgID: orgId,
          applicationName: name,
          applicationVendor: vendor,
        };
        try {
          setLoading(true);
          const response = await fetchInventoryApplicationsEndpointsUrl(data);
          setEndpoints(response);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      useEffect(() => {
          fetchData();
      }, [name, vendor]);
   
    const handleEndpointClick = (item) => {
        setSelectedEndpoint(item);
        setShowPopup(true);
      };
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Inventory Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <table className="table alert-table scroll-x mg-top-20">
          <thead>
            <tr>
              <th className="fs-12">Endpoint Name</th>
              <th className="fs-12">Endpoint Type</th>
              <th className="fs-12">OS</th>
              <th className="fs-12">OS Version</th>
              <th className="fs-12">Type</th>
              <th className="fs-12">Account</th>
              <th className="fs-12">Site</th>
              <th className="fs-12">Group</th>
              <th className="fs-12">Vesion</th>
              <th className="fs-12">Size</th>
              <th className="fs-12">First Detected</th>
              <th className="fs-12">Installation Date</th>
              <th className="fs-12">Installation Path</th>
            </tr>
          </thead>
          <tbody>
            {loading && <UsersListLoading />}
            {endpoints !== null && endpoints !== undefined && endpoints.length > 0 ? (
              endpoints?.map((item) => (
                <tr key={item.id}>
                  <td onClick={() => handleEndpointClick(item)}>
                    {item.endpointName}
                  </td>
                  <td>{item.endpointType}</td>
                  <td>{item.osType}</td>
                  <td>{item.osVersion}</td>
                  <td>{item.osType}</td>
                  <td>{item.accountName}</td>
                  <td>{item.siteName}</td>
                  <td>{item.groupName}</td>
                  <td>{item.version}</td>
                  <td>{item.fileSize}</td>
                  <td>{getCurrentTimeZone(item.detectionDate)}</td>
                  <td>{getCurrentTimeZone(item.applicationInstallationDate)}</td>
                  <td>{item.applicationInstallationPath}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
        <EndpointPopup
        selectedEndpoint={selectedEndpoint}
        showModal={showPopup}
        setShowModal={setShowPopup}
      />
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InventoryEndpointPopUp;
