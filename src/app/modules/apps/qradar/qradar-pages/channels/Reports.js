import React, { useState, useEffect, useRef } from "react";
import { fetchSubItemsByOrgChannel } from "../../../../../api/ChannelApi";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

const Reports = ({ channelId, channelName }) => {
  const [channelSubItems, setChannelSubItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const dropdownRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const orgId = Number(sessionStorage.getItem("orgId"));
    const data = { channelId, orgId };

    fetchSubItemsByOrgChannel(data)
      .then((subItems) => {
        setChannelSubItems(subItems);
      })
      .catch((error) => {
        console.log(error);
        setError("Error occurred while fetching channel sub-item data");
      });
  }, [channelId]);

  const handleItemCheckboxChange = (subItemId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(subItemId)) {
        return prevSelectedItems.filter((id) => id !== subItemId);
      } else {
        return [...prevSelectedItems, subItemId];
      }
    });
  };

  return (
    <div>
      <div className="clearfix">
        <p className="float-left channel-heading">
          <strong>{channelName}</strong>
        </p>
        <div className="float-right teams-channel">
          <Dropdown
            isOpen={dropdownOpen}
            toggle={toggleDropdown}
            innerRef={dropdownRef}
          >
            <DropdownToggle caret>
              Teams{" "}
              <img
                alt="Logo"
                src={toAbsoluteUrl("/media/icons/teams-icon.png")}
                width="20"
              />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={openModal}>
                Add Channel in Teams
              </DropdownItem>
              <DropdownItem>Share File to Teams</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {error ? (
        <p>Error occurred while fetching data</p>
      ) : (
        <div className="channel-report">
          {/* Generate Report */}
          <div className="generate-report">
            {channelSubItems.length > 0 ? (
              channelSubItems.map((subItem) => (
                <div
                  className="report-files mb-2"
                  key={subItem.channelSubItemId}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(subItem.channelSubItemId)}
                      onChange={() =>
                        handleItemCheckboxChange(subItem.channelSubItemId)
                      }
                    />
                    <a
                      className="doc-section"
                      href={subItem.documentUrl}
                      download="Document"
                    >
                      <i className="far fa-file-pdf" />{" "}
                      <span className="text-blue">
                        {subItem.channelSubItemName} Report
                      </span>
                    </a>
                  </label>
                </div>
              ))
            ) : (
              <div>Loading...</div>
            )}
            <button className="btn btn-new btn-primary btn-small mt-5">
              Generate Report
            </button>
          </div>

          {/* Download Report */}
          <div className="download-report mt-10">
            <p>
              <strong>Download Report:</strong>{" "}
            </p>
            {channelSubItems.length > 0 ? (
              channelSubItems.map((subItem) => (
                <div
                  className="report-files mb-2"
                  key={subItem.channelSubItemId}
                >
                  <label>
                    <a
                      className="doc-section"
                      href={subItem.documentUrl}
                      download="Document"
                    >
                      <i className="far fa-file-pdf" />{" "}
                      <span className="text-blue">
                        {subItem.channelSubItemName} Report{" "}
                      </span>
                    </a>
                  </label>
                  <button className="btn btn-new">
                    <a href={subItem.documentUrl} download="Document">
                      <i className="fas fa-download"></i>
                    </a>
                  </button>
                </div>
              ))
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      )}
      {/* Add channels in teams modal */}
      <Modal isOpen={modalOpen} toggle={closeModal} className="teams-modal">
        <ModalHeader toggle={closeModal}>Add Channel in Teams</ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label htmlFor="teamSelect">Select Team:</label>
              <select id="teamSelect" className="form-select form-select-solid">
                <option value="">Select a team</option>
                <option>LDC Teams</option>
              </select>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary btn-small">Submit</button>
          <button className="btn btn-secondary btn-small" onClick={closeModal}>
            Close
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Reports;
