import React from "react";
import ReactPaginate from "react-paginate";

const CustomPagination = ({ list, itemsPerPage, handlePageChange }) => (
  <div className="pagination-block">
    <ReactPaginate
      nextLabel={<i className="mdi mdi-chevron-right mdi-18px"></i>}
      previousLabel={<i className="mdi mdi-chevron-left mdi-18px"></i>}
      nextClassName="pagination-next-button"
      previousClassName="pagination-previous-button"
      nextLinkClassName="pagination-button-text"
      pageClassName="pagination-page-button"
      pageLinkClassName="pagination-button-text"
      activeClassName="pagination-page-button-active"
      activeLinkClassName="pagination-active-button-text"
      pageCount={Math.ceil(list.length / itemsPerPage)}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageChange}
      containerClassName={"custom-pagination pagination"}
    />
  </div>
);

export default CustomPagination;
