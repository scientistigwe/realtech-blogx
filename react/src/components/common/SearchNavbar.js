import React, { useState, useRef } from "react";
import { Search } from "lucide-react";
import "./../../styles/SearchNavbar.css"; // We'll create this file for custom styles

const SearchNavbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClick = () => {
    inputRef.current.focus();
  };

  return (
    <div className="search-navbar-container" onClick={handleClick}>
      <form onSubmit={handleSubmit} className="search-form">
        <Search className="search-icon" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchNavbar;
