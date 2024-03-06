import React from "react";

function Endpoints({ id, shouldRender }) {
  const endpointId = id;

  if (!shouldRender) {
    return null;
  }

  return (
    <div>
      <h2>Endpoints</h2>
      <p>ID: {endpointId}</p>
    </div>
  );
}

export default Endpoints;