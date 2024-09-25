import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Search } from "lucide-react";
import { searchPosts } from "../../redux/post/postThunks";
import { selectSearchResults } from "../../redux/post/postSelectors";
import debounce from "lodash/debounce";

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background-color: #f1f3f5;
  border-radius: 24px;
  padding: 8px 16px;
  transition: box-shadow 0.3s ease;

  &:focus-within {
    box-shadow: 0 0 0 2px #4dabf7;
  }
`;

const SearchIcon = styled(Search)`
  color: #868e96;
  margin-right: 8px;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  padding: 8px;
  outline: none;
`;

const SearchButton = styled.button`
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3b8de0;
  }
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
`;

const ResultItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const ResultTitle = styled.h3`
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #343a40;
`;

const ResultExcerpt = styled.p`
  margin: 0;
  font-size: 14px;
  color: #868e96;
`;

const SearchNavbar = () => {
  const dispatch = useDispatch();
  const searchResults = useSelector(selectSearchResults);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);

  const debouncedSearch = debounce((query) => {
    if (query.trim()) {
      dispatch(searchPosts(query.trim()));
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchPosts(searchTerm.trim()));
      setShowResults(true);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  const handleResultClick = (postId) => {
    // Implement navigation to the post page
    console.log(`Navigate to post with ID: ${postId}`);
    setShowResults(false);
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit}>
        <SearchIcon size={20} />
        <SearchInput
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search posts..."
        />
        <SearchButton type="submit">Search</SearchButton>
      </SearchForm>

      {showResults && searchResults.length > 0 && (
        <ResultsContainer>
          {searchResults.map((post) => (
            <ResultItem
              key={post.id}
              onClick={() => handleResultClick(post.id)}
            >
              <ResultTitle>{post.title}</ResultTitle>
              <ResultExcerpt>{post.excerpt}</ResultExcerpt>
            </ResultItem>
          ))}
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};

export default SearchNavbar;
