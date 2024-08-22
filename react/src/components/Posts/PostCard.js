import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import api from "./../../api/apiClient"; // Import API endpoints
import "./../../styles/Components.css"; // Import the CSS file for styling

const PostCard = ({ post, currentUser }) => {
  const {
    id,
    title,
    excerpt,
    thumbnail,
    author,
    publication_date,
    upvotes,
    downvotes,
    comments_count,
  } = post;

  const [localUpvotes, setLocalUpvotes] = useState(upvotes || 0);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes || 0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      console.error("Post ID is missing.");
    }
  }, [id]);

  const imageUrl = thumbnail
    ? thumbnail.startsWith("http://") || thumbnail.startsWith("https://")
      ? thumbnail
      : `http://localhost:8000${thumbnail}`
    : null;

  const handleUpvote = async () => {
    try {
      const response = await api.posts.upvote(id); // Adjust the API call to match your implementation
      if (response.status === 200) {
        setLocalUpvotes(localUpvotes + 1);
      } else {
        console.error("Upvote failed");
      }
    } catch (error) {
      console.error("Error upvoting the post:", error);
    }
  };

  const handleDownvote = async () => {
    try {
      const response = await api.posts.downvote(id); // Adjust the API call to match your implementation
      if (response.status === 200) {
        setLocalDownvotes(localDownvotes + 1);
      } else {
        console.error("Downvote failed");
      }
    } catch (error) {
      console.error("Error downvoting the post:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await api.posts.delete(id); // Adjust the API call to match your implementation
        if (response.status === 204) {
          navigate("/posts");
        } else {
          console.error("Delete failed");
        }
      } catch (error) {
        console.error("Error deleting the post:", error);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/posts/edit/${id}`);
  };

  return (
    <div className="post-card">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="post-image" />
      ) : (
        <div className="post-image-placeholder">No Image Available</div>
      )}
      <div className="post-content">
        <h2 className="post-title">{title}</h2>
        <p className="post-excerpt">{excerpt || "No excerpt available."}</p>
        <p className="post-info">
          <span className="post-author">Author: {author}</span>
          <span className="post-date">
            Published: {new Date(publication_date).toLocaleDateString()}
          </span>
        </p>
        <div className="post-actions">
          <button onClick={handleUpvote} className="vote-button">
            Upvote ({localUpvotes})
          </button>
          <button onClick={handleDownvote} className="vote-button">
            Downvote ({localDownvotes})
          </button>
          <button className="comments-button">
            Comments ({comments_count})
          </button>
          {currentUser === author && (
            <div className="crud-actions">
              <button onClick={handleEdit} className="crud-button">
                Edit
              </button>
              <button onClick={handleDelete} className="crud-button">
                Delete
              </button>
            </div>
          )}
          <Link to={`/posts/${id}`} className="read-more">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

// Define propTypes to ensure correct prop usage
PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    thumbnail: PropTypes.string,
    author: PropTypes.string.isRequired,
    publication_date: PropTypes.string.isRequired,
    upvotes: PropTypes.number,
    downvotes: PropTypes.number,
    comments_count: PropTypes.number,
  }).isRequired,
  currentUser: PropTypes.string.isRequired,
};

// Define default props in case some props are not provided
PostCard.defaultProps = {
  post: {
    excerpt: "No excerpt available.",
    thumbnail: "",
    upvotes: 0,
    downvotes: 0,
    comments_count: 0,
  },
};

export default PostCard;
