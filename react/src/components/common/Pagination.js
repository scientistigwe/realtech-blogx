import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";

const Pagination = ({ totalPages, currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePageChange = (page) => {
    const query = queryString.parse(location.search);
    navigate(`${location.pathname}?page=${page}`);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={currentPage === i ? "active" : ""}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="pagination">
      <ul>{renderPageNumbers()}</ul>
    </div>
  );
};

export default Pagination;
