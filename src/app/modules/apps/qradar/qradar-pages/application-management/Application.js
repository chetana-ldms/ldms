import React, { useState } from 'react';
import RisksComponent from './RisksComponent'; 
import InventoryComponent from './InventoryComponent'; 

function Application() {
  const [activeTab, setActiveTab] = useState('risks');

  return (
    
    <div className='row'>
      <div className='col-md-2'>
        <div>Application Management</div>
      </div>
      <div className='row'>
      <div className='col-md-12'>
        <div className='d-flex'>
          <ul className='nav nav-tabs p-0 border-0 fs-8'>
            <li className='nav-item'>
              <a
                className={`nav-link ${activeTab === 'risks' ? 'active' : ''}`}
                onClick={() => setActiveTab('risks')}
              >
                RISKS
              </a>
            </li>
            <li className='nav-item'>
              <a
                className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
                onClick={() => setActiveTab('inventory')}
              >
                INVENTORY
              </a>
            </li>
          </ul>
        </div>
        {activeTab === 'risks' && <RisksComponent /> }
        {activeTab === 'inventory' && <InventoryComponent /> }
      </div>
      </div>
    </div>
  );
}

export default Application;
