import React from 'react';

const TicketUpdateBadge = ({ count, onClick }) => {
  if (count <= 0) return null;

  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '120px',
        left: '20%',
        zIndex: 1050,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#fff',
        border: '1px solid #d0d5dd',
        borderRadius: '999px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        padding: '6px 12px',
        cursor: 'pointer',
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      <div
        style={{
          backgroundColor: '#1a73e8',
          borderRadius: '50%',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
      >
        <i className="bi bi-arrow-clockwise" style={{ fontSize: '16px' }}></i>
      </div>
      <span style={{ fontSize: '14px', color: '#1a1a1a' }}>
        {count} new ticket{count > 1 ? 's' : ''}
      </span>
    </div>
  );
};

export default TicketUpdateBadge;
