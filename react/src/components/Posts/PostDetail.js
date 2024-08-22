import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import api from "../../api/apiClient"; // Import the API functions
import CommentList from "../Comments/CommentList";
import CommentForm from "../Comments/CommentCreate";
import useAuth from "../../hooks/userAuth"; // Import the custom hook for authentication

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Get the current user
  const [post, setPost] = React.useState(null);
  const [engagement, setEngagement] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await api.posts.fetchById(postId);
        setPost(response.data);
        const engagementResponse = await api.posts.fetchEngagementMetrics(
          postId
        );
        setEngagement(engagementResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const isAuthor = post && user && post.author.id === user.id;

  const handleEdit = () => {
    navigate(`/edit-post/${postId}`); // Navigate to the edit page
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.posts.delete(postId);
        navigate("/posts"); // Redirect to the posts list
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mt-4 post-detail">
      <h1>{post.title}</h1>
      {post.thumbnail && (
        <img
          src={api.getImageUrl(post.thumbnail)} // Adjusted to use api method if available
          alt={post.title}
          className="img-fluid"
        />
      )}
      <div className="post-content mt-3">
        <p>{post.content}</p>
      </div>
      <div className="post-meta mt-3">
        <p>Author: {post.author.username}</p>
        <p>Category: {post.primary_category?.name || "Uncategorized"}</p>
        <p>Tags: {post.tags.map((tag) => tag.name).join(", ")}</p>
      </div>
      <CommentList postId={post.id} />

      {isAuthenticated && (
        <div>
          <CommentForm postId={post.id} />
          <h3>Engagement Metrics:</h3>
          {engagement ? (
            <>
              <p>Clicks: {engagement.clicks}</p>
              <p>Sessions: {engagement.sessions}</p>
              <p>Conversions: {engagement.conversions}</p>
            </>
          ) : (
            <p>No engagement metrics available.</p>
          )}
        </div>
      )}

      {isAuthenticated && isAuthor && (
        <div className="mt-3">
          <Button onClick={handleEdit} variant="primary" className="me-2">
            Edit Post
          </Button>
          <Button onClick={handleDelete} variant="danger">
            Delete Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
