import React, { useState, useEffect } from 'react';

function RisksComponent() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('API_URL');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []); 

  return (
    <div>
      <h2>RisksComponent</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RisksComponent;
