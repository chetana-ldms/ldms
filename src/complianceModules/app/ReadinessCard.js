import React, { useState } from 'react';
import { toAbsoluteUrl } from '../../_metronic/helpers';

const data = [
  {
    "type": "SOC 2",
    "progress": 26, 
    "remaining_controls": {
      "current": 218,
      "total": 319
    },
    "bg_color": "bg-secondary",
  },
  {
    "type": "NIST SP 800-53",
    "progress": 24,
    "remaining_controls": {
      "current": 131,
      "total": 190
    },
    "bg_color": "bg-light-success",
  },
  {
    "type": "NIST CSF",
    "progress": 22,
    "remaining_controls": {
      "current": 117,
      "total": 170
    },
    "bg_color": "bg-light-danger",
  },
  {
    "type": "ISO 27001",
    "progress": 30,
    "remaining_controls": {
      "current": 95,
      "total": 150
    },
    "bg_color": "bg-light-info",
  },
  {
    "type": "HIPAA",
    "progress": 40,
    "remaining_controls": {
      "current": 62,
      "total": 100
    },
    "bg_color": "bg-light-info",
  },
  {
    "type": "PCI DSS",
    "progress": 18,
    "remaining_controls": {
      "current": 220,
      "total": 270
    },
    "bg_color": "bg-light-primary",
  }
];
function ReadinessCard() {
  const [currentPage, setCurrentPage] = useState(0);
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const startIndex = currentPage * 3;
  const endIndex = startIndex + 3;

  return (
    <div>
      <div className="row">
        {data.slice(startIndex, endIndex).map((item, index) => (
          <div className="col-xl-4" key={index}>
            <div className={`card readiness ${item.bg_color}`}>
              <div className="readiness-top">
                <img
                  alt="Logo"
                  src={toAbsoluteUrl("/media/icons/misc.png")}
                  className="h-40px w-40px"
                />
                <p className="blue-txt">{item.type}</p>
                <progress value={item.progress} max={100}></progress> 
                <p>{item.progress}% ready</p> 
              </div>
              <div className="rediness-btm">
                <p>Remaining controls</p>
                <p>
                  <span className="highlight-txt">{item.remaining_controls.current}</span> out of {item.remaining_controls.total} total
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='d-flex justify-content-end'>
        <button className='btn btn-small btn-primary me-3 ' onClick={prevPage} disabled={currentPage === 0}>Previous</button>
        <button className='btn btn-small btn-primary ' onClick={nextPage} disabled={(currentPage + 1) * 3 >= data.length}>Next</button>
      </div>
    </div>
  );
}

export default ReadinessCard;
