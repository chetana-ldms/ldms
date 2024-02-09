import React from 'react';

const TestTrendComponent = () => {
  const testTrendData = {
    title: "Test trend",
    totalFailingTests: 48,
    failurePercentage: "9%",
    categories: [
      {
        icon: "fa fa-file",
        name: "Policy",
        failingTests: 16,
        failurePercentage: "33%"
      },
      {
        icon: "fa fa-cube",
        name: "In Drata",
        failingTests: 13,
        failurePercentage: "0%"
      },
      {
        icon: "fa fa-file",
        name: "Policy",
        failingTests: 16,
        failurePercentage: "33%"
      },
      {
        icon: "fa fa-cube",
        name: "In Drata",
        failingTests: 13,
        failurePercentage: "0%"
      },
      {
        icon: "fa fa-file",
        name: "Policy",
        failingTests: 16,
        failurePercentage: "33%"
      },
      {
        icon: "fa fa-cube",
        name: "In Drata",
        failingTests: 13,
        failurePercentage: "0%"
      }
    ]
  };

  return (
    <div className='col-lg-4'>
      <div className='card'>
        <h4>{testTrendData.title}</h4>
        <div className='table'>
          <table className='table'>
            <thead>
              <tr>
                <th>Total failing tests</th>
                <th className='red bold fs-15'>{testTrendData.totalFailingTests}</th>
                <th className='red fs-12'>{testTrendData.failurePercentage}</th>
              </tr>
            </thead>
            <tbody>
              <tr className='inner-table'>
                <td>Category</td>
                <td>Failing tests</td>
                <td>info</td>
              </tr>
              {testTrendData.categories.map((category, index) => (
                <tr key={index}>
                  <td>
                    <i className={category.icon} /> {category.name}
                  </td>
                  <td className='red bold fs-15'>{category.failingTests}</td>
                  <td className='red fs-12'>
                    {category.failurePercentage}{' '}
                    <span>
                      <i className='fa fa-chevron-right' />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestTrendComponent;
