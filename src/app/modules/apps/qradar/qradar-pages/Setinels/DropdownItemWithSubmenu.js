import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import './DropdownItemWithSubmenu.css';

const DropdownItemWithSubmenu = ({ item, subItems }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  // const handleMouseEnter = () => setSubmenuOpen(true);
  // const handleMouseLeave = () => setSubmenuOpen(false);

  return (
    <div 
      className="position-relative" 
      // onMouseEnter={handleMouseEnter} 
      // onMouseLeave={handleMouseLeave}
    >
      <Dropdown.Item>
        {item} <i className='fa fa-caret-right float-right pt-1' />
      </Dropdown.Item>
      {submenuOpen && (
        <div className="submenu position-absolute top-0 start-100 mt-0 bg-white border">
          {subItems.map((subItem, index) => (
            <Dropdown.Item
              key={index}
            >
              {subItem}
            </Dropdown.Item>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownItemWithSubmenu;
