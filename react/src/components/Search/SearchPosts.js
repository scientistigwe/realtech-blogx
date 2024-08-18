import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { performSearch } from "../../redux/slices/searchSlice"; // Adjust the import path if necessary
import {
  selectSearchResults,
  selectSearchLoading,
  selectSearchError,
} from "../../redux/selectors/searchSelectors"; // Adjust the import path if necessary

const SearchPost = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  // Using selectors
  const results = useSelector(selectSearchResults);
  const loading = useSelector(selectSearchLoading);
  const error = useSelector(selectSearchError);

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(performSearch(query));
    }
  };

  return (
    <div className="search-post">
      <input
        type="text"
        placeholder="Search for posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Allow pressing Enter to search
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
      {error && <p className="error-message">{error}</p>}
      <div className="search-results">
        {results && results.length > 0
          ? results.map((post) => (
              <div key={post.id} className="post-result">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <a href={`/posts/${post.id}`} className="read-more">
                  Read More
                </a>
              </div>
            ))
          : !loading && <p>No results found.</p>}
      </div>
    </div>
  );
};

export default SearchPost;
