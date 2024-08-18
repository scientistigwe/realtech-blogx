import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  fetchEngagementMetrics,
  deletePost,
  clearError,
} from "../../redux/slices/postsSlice";
import {
  selectCurrentPost,
  selectEngagementMetrics,
  selectLoading,
  selectError,
} from "../../redux/selectors/postsSelectors";
import { AuthContext } from "../../context/AuthProvider";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = React.useContext(AuthContext);
  const dispatch = useDispatch();

  // Use selectors to access state
  const post = useSelector(selectCurrentPost);
  const engagement = useSelector(selectEngagementMetrics(id));
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const isAuthor = isAuthenticated && post?.author.id === user.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchPostById(id));

        // Only fetch engagement metrics if the user is authenticated
        if (isAuthenticated) {
          await dispatch(fetchEngagementMetrics(id));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      dispatch(clearError());
    };
  }, [id, dispatch, isAuthenticated]);

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await dispatch(deletePost(id)).unwrap();
        navigate("/"); // Redirect to home after deletion
      } catch (error) {
        console.error("Error deleting post:", error);
        dispatch(clearError());
      }
    }
  };

  const getImageUrl = (url) => {
    if (url.startsWith("/media/")) {
      return `http://localhost:8000${url}`;
    }
    return url; // Assuming the URL is already absolute
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4 post-detail">
      {post ? (
        <>
          <h1>{post.title}</h1>
          {post.thumbnail && (
            <img
              src={getImageUrl(post.thumbnail)}
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

          {isAuthenticated && (
            <div>
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
        </>
      ) : (
        <p className="text-center">No post found.</p>
      )}
    </div>
  );
};

export default PostDetail;
