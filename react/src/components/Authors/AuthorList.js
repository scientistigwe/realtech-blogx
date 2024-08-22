import React, { useEffect, useState } from "react";
import api from "./../../api/apiClient";

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      setError(""); // Clear previous errors

      try {
        const response = await api.authors.list(); // Fetch authors from API
        setAuthors(response.data); // Assuming response.data contains the list of authors
      } catch (err) {
        console.error("Error fetching authors:", err);
        setError(
          err.response?.data?.detail ||
            "Failed to fetch authors. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) return <div>Author list Loading...</div>;
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
