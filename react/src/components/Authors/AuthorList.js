import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthors } from "../../redux/slices/authorsSlice"; // Adjust import paths as needed
import {
  selectAllAuthors,
  selectLoading,
  selectError,
} from "../../redux/selectors/authorsSelectors"; // Adjust import paths as needed

const AuthorList = () => {
  const dispatch = useDispatch();

  // Use selectors to access the state
  const authors = useSelector(selectAllAuthors);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchAuthors());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="author-list-page">
      <h2>Authors</h2>
      <ul>
        {authors.length > 0 ? (
          authors.map((author) => (
            <li key={author.id}>
              <a href={`/authors/${author.id}`}>{author.name}</a>
            </li>
          ))
        ) : (
          <p>No authors found.</p>
        )}
      </ul>
    </div>
  );
};

export default AuthorList;
