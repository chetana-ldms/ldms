import React from 'react';
import ReactPaginate from 'react-paginate';

function Pagination({ pageCount, handlePageClick, itemsPerPage, handlePageSelect }) {
  return (
    <div className="d-flex justify-content-end align-items-center pagination-bar">
      <ReactPaginate
        previousLabel={<i className="fa fa-chevron-left" />}
        nextLabel={<i className="fa fa-chevron-right" />}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={8}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-end"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item custom-previous"}
        previousLinkClassName={"page-link custom-previous-link"}
        nextClassName={"page-item custom-next"}
        nextLinkClassName={"page-link custom-next-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
      <div className="col-md-3 d-flex justify-content-end align-items-center">
        <span className="col-md-4">Count: </span>
        <select
          className="form-select form-select-sm col-md-4"
          value={itemsPerPage}
          onChange={handlePageSelect}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>
    </div>
  );
}

export default Pagination;
