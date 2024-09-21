import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { usePosts } from "../../hooks/usePosts"; // Adjusted hook import
import PostCard from "../posts/PostCard";
import Pagination from "../common/Pagination";

const SearchPosts = () => {
  const location = useLocation();
  const { q: searchQuery } = queryString.parse(location.search);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(""); // Define state for error

  const {
    posts,
    error: fetchError,
    loading: fetchLoading,
  } = usePosts.searchPosts(searchQuery, currentPage);

  useEffect(() => {
    if (fetchError) {
      setError(fetchError.message || "Failed to fetch posts.");
    } else {
      setError("");
      setTotalPages(posts.totalPages || 1);
    }
  }, [fetchError, posts]);

  if (fetchLoading) {
    return <div>Loading search results...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; // Use error state
  }

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p>No results found.</p>
      )}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default SearchPosts;
