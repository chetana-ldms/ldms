import React from 'react';

function Endpoints({ id }) {
  const endpointId = id; 

  return (
    <div>
      <h2>Endpoints</h2>
      <p>ID: {endpointId}</p>
    </div>
  );
}

export default Endpoints;
