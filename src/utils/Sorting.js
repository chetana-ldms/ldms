import React, { useState } from 'react';

const sortTable = (sortConfig, setSortConfig, key) => {
  let direction = 'ascending';
  if (sortConfig.key === key && sortConfig.direction === 'ascending') {
    direction = 'descending';
  }
  setSortConfig({ key, direction });
};

const sortedItems = (data, sortConfig) => {
  if (sortConfig.key !== null) {
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }
  return data;
};

const renderSortIcon = (sortConfig, key) => {
  if (sortConfig.key === key) {
    return sortConfig.direction === 'ascending' ? (
      <i className='fa fa-caret-up white ps-3' />
    ) : (
      <i className='fa fa-caret-down white ps-3' />
    );
  } else {
    return <i className='fa fa-sort white ps-3' />;
  }
};

export { sortTable, sortedItems, renderSortIcon };
