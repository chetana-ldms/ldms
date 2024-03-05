import React from 'react';

function Cves({ id }) {
  const cvesId = id;

  return (
    <div>
      <h2>Cves</h2>
      <p>ID: {cvesId}</p>
    </div>
  );
}

export default Cves;
