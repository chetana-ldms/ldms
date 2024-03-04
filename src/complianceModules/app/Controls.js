import React, { useState } from 'react';
import ControlesPopUp from './ControlesPopUp';
import CreateNewControlPopUp from './CreateNewControlPopUp';

const Controle = () => {
  const [activeTab, setActiveTab] = useState('inScope');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModalCreateNewControl, setShowModalCreateNewControl] = useState(false);

  const inScopeData = [
    { id: 1, description: 'Description 1', icons: ['fa-paperclip', 'fa-indent', 'fa-users'] },
    { id: 2, description: 'Description 2', icons: ['fa-paperclip', 'fa-indent', 'fa-users'] },
  ];

  const outScopeData = [
    { id: 1, description: 'Description Change 1', icons: ['fa-paperclip', 'fa-indent', 'fa-users'] },
    { id: 2, description: 'Description Change 2', icons: ['fa-paperclip', 'fa-indent', 'fa-users'] },
  ];

  const handleDescriptionClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCreateNewControl = () => {
    setShowModalCreateNewControl(true);
  };

  return (
    <div className='compliance-controls'>
      <h2>Controls In Scope</h2>
      <div className='row'>
        <div className='col-lg-12'>
          <div className='float-right'>
            <button className='btn btn-primary btn-new btn-small' onClick={handleCreateNewControl}>
              Create New Control
            </button>
          </div>
        </div>
      </div>
      <br />
      <hr />
      <div className='row'>
        <div className='col-lg-3 controls-left'>
          <h4>All Controls</h4>
          <hr />
          <h4>Frameworks</h4>
          <ul>
            <li>
              <i className='fa fa-compass' />
              CCM
            </li>
            <li>
              <i className='fa fa-compass' />
              CCPA
            </li>
            <li>
              <i className='fa fa-compass' />
              CMMC
            </li>
            <li>
              <i className='fa fa-compass' />
              COBIT
            </li>
          </ul>
        </div>
        <div className='col-lg-9'>
          <div className='sort-section row'>
            <div className='col-lg-3 d-flex '>
            <ul className='nav nav-tabs p-0 border-0 fs-8'>
                <li className='nav-item'>
                  <a
                    className={`nav-link ${activeTab === 'inScope' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inScope')}
                  >
                    In Scope
                  </a>
                </li>
                <li className='nav-item'>
                  <a
                    className={`nav-link ${activeTab === 'outScope' ? 'active' : ''}`}
                    onClick={() => setActiveTab('outScope')}
                  >
                    Out of Scope
                  </a>
                </li>
              </ul>
            </div>
            <div className='col-lg-6'>
              <input
                type='text'
                placeholder='Search controls by name, description, code'
                style={{ width: '100%' }}
              />
            </div>
            <div className='col-lg-3'>
              <select placeholder='Sort By:'>
                <option>Sort By:</option>
                <option>Name</option>
                <option>Control code</option>
                <option>All controls</option>
                <option>Filtered view</option>
                <option>Download CSV</option>
              </select>
            </div>
          </div>
          <br />
          <div className='controls-content'>
            {activeTab === 'inScope' && (
              <div className='tab-pane fade show active' id='inScope'>
                <table className='table'>
                  <tbody>
                    {inScopeData.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className='checkbox'>
                            <input type='checkbox' />
                            <i className='fa fa-check-square' />
                          </div>
                        </td>
                        <td onClick={() => handleDescriptionClick(item)}>{item.description}</td>
                        <td>
                          <div className='float-right right-icons'>
                            {item.icons.map((icon, index) => (
                              <i key={index} className={`fa ${icon}`} />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'outScope' && (
              <div className='tab-pane fade show active' id='outScope'>
                <table className='table'>
                  <tbody>
                    {outScopeData.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className='checkbox'>
                            <input type='checkbox' />
                            <i className='fa fa-check-square' />
                          </div>
                        </td>
                        <td onClick={() => handleDescriptionClick(item)}>{item.description}</td>
                        <td>
                          <div className='float-right right-icons'>
                            {item.icons.map((icon, index) => (
                              <i key={index} className={`fa ${icon}`} />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <CreateNewControlPopUp 
        showModal={showModalCreateNewControl} 
        setShowModal={setShowModalCreateNewControl} 
      />
       <ControlesPopUp 
        showModal={showModal} 
        setShowModal={setShowModal} 
        selectedItem={selectedItem} 
      />
    </div>
  );
};

export default Controle;
