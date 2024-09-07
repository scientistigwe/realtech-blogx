import React from "react";
import { Spinner, Alert } from "react-bootstrap";
import { useUsersList } from "../../hooks/useUsers"; // Import the hook for fetching user list

const AuthorList = () => {
  const { users: authors, loading, error } = useUsersList(); // Fetch list of authors

  if (loading) return <div>Author list Loading...</div>;
  if (error)
    return (
      <div>
        <Alert variant="danger">{error}</Alert>
      </div>
    );

  return (
    <div className="author-list-page">
      <h2>Authors</h2>
      <ul>
        {authors.length > 0 ? (
          authors.map((author) => (
            <li key={author.id}>
              <a href={`/authors/${author.id}`}>{author.username}</a>
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
