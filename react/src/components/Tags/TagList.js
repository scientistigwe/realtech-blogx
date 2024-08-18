// src/components/TagList.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags } from "../../redux/slices/tagSlice"; // Adjust import path if necessary

const TagList = () => {
  const dispatch = useDispatch();
  const { tags, loading, error } = useSelector((state) => state.tags);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

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
