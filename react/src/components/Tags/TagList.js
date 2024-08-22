import React, { useEffect, useState } from "react";
import api from "../../api/apiClient"; // Adjust the import path according to your project structure

const TagList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.tags.list(); // Assuming api.tags.list() fetches tags
        setTags(response.data);
      } catch (error) {
        setError(error.message || "An error occurred while fetching tags.");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) return <div>Loading tags...</div>;

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="tag-list">
      <h3>Tags</h3>
      <ul>
        {tags.length === 0 ? (
          <p>No tags available.</p>
        ) : (
          tags.map((tag) => (
            <li key={tag.id}>
              <a href={`/tags/${tag.id}`}>{tag.name}</a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TagList;
