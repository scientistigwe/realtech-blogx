import React from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import useSearchPosts from "../hooks/useSearchPosts"; // Adjust import path as necessary
import PostCard from "../components/PostCard"; // Adjust import path as necessary
import Pagination from "../components/Pagination"; // Adjust import path as necessary
import usePagination from "../hooks/usePagination"; // Adjust import path as necessary

const SearchPosts = () => {
  const location = useLocation();
  const { q: searchQuery } = queryString.parse(location.search);
  const { posts, loading, error } = useSearchPosts(searchQuery);

  // Assuming usePagination is used to handle pagination
  const {
    currentPage,
    totalPages,
    items,
    loading: paginationLoading,
  } = usePagination((page) => api.posts.fetchBySearch(searchQuery, page), 10);

  if (loading || paginationLoading) {
    return <div>Loading search results...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p>No results found.</p>
      )}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
};

export default SearchPosts;
