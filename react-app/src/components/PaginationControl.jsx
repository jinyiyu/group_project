import React from "react";
import Pagination from "@mui/material/Pagination";

const PaginationControl = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={onPageChange}
      color="primary"
      style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
    />
  );
};

export default PaginationControl;
