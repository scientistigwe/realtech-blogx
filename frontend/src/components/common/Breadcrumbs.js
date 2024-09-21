import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ crumbs }) => {
  if (!crumbs || crumbs.length === 0) return null;

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {crumbs.map((crumb, index) => (
          <li
            key={index}
            className={`breadcrumb-item ${
              index === crumbs.length - 1 ? "active" : ""
            }`}
          >
            {/* Check if the crumb is the last one or if the path is missing */}
            {index === crumbs.length - 1 || !crumb.path ? (
              crumb.label
            ) : (
              <Link
                to={crumb.path}
                aria-current={index === crumbs.length - 1 ? "page" : undefined}
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string, // path is optional
    })
  ).isRequired,
};

export default Breadcrumbs;
