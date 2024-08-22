import React, { useEffect } from "react";
import { Container, Breadcrumb, Spinner, Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import useSearchPosts from "./../hooks/useSearchPosts"; // Adjust import path as necessary
import SearchBar from "./../components/Search/searchBar"; // Assuming SearchBar is the search component
import PostCard from "./../components/Posts/PostCard"; // Assuming PostCard displays individual posts
import Pagination from "./../components/common/Pagination"; // Assuming Pagination handles pagination

const SearchResultsPage = () => {
  const location = useLocation();
  const { q: searchQuery } = queryString.parse(location.search);
  const { results, loading, error, performSearch } =
    useSearchPosts(searchQuery);

  // Perform search when query changes
  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery, performSearch]);

  return (
    <Container className="mt-4">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Search Results</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Search Results</h1>
      <SearchBar />
      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      )}
      {error && (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      )}
      <div>
        {results.length > 0
          ? results.map((post) => <PostCard key={post.id} post={post} />)
          : !loading && <p>No results found.</p>}
      </div>
      <Pagination /> {/* Adjust if pagination is needed */}
    </Container>
  );
};

export default SearchResultsPage;
