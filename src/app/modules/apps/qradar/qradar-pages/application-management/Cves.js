import React from 'react';
import { useParams } from 'react-router-dom';

function Cves() {
  let { name, vendor } = useParams();
  name = decodeURIComponent(name);
  vendor = decodeURIComponent(vendor);

  return (
    <div>
      <h2>Cves : {vendor}</h2>
      <p>ID: {name}</p>
    </div>
  );
}

export default Cves;
