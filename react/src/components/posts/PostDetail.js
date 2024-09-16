import React, { useEffect, useState } from "react";
import { Container, Button, Alert, Card, Badge } from "react-bootstrap"; // Added Badge for categories/tags
import { useParams } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share"; // Import social share buttons
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const mediaBaseUrl =
  process.env.REACT_APP_MEDIA_BASE_URL || "http://localhost:8000/media/";
const defaultImageUrl = `${mediaBaseUrl}posts/default-image.png`;

// Helper function to format the date
const formatDate = (dateString) => {
  if (!dateString) {
    return "Date not available";
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Function to get image URL
const getImageUrl = (post) => {
  if (post.thumbnail) {
    return post.thumbnail;
  } else if (post.image_url) {
    return post.image_url;
  } else {
    return defaultImageUrl;
  }
};

const PostDetail = () => {
  const { id } = useParams();
  const { fetchPostById, upvotePost, downvotePost, deletePost, loading } =
    usePosts();

  const [post, setPost] = useState(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const fetchedPost = await fetchPostById(id);
        setPost(fetchedPost);
      } catch (err) {
        setShowError(true);
        console.error(err);
      }
    };

    loadPost();
  }, [id, fetchPostById]);

  const handleUpvote = async () => {
    try {
      await upvotePost(id);
      setPost(await fetchPostById(id)); // Refresh post details
    } catch (err) {
      setShowError(true);
      console.error(err);
    }
  };

  const handleDownvote = async () => {
    try {
      await downvotePost(id);
      setPost(await fetchPostById(id)); // Refresh post details
    } catch (err) {
      setShowError(true);
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(id);
      // Optionally redirect or show a success message
    } catch (err) {
      setShowError(true);
      console.error(err);
    }
  };

  return (
    <Container>
      {loading && <p>Loading...</p>}
      {showError && <Alert variant="danger">Error loading post details</Alert>}
      {post && (
        <Card className="my-4">
          <Card.Img variant="top" src={getImageUrl(post)} alt={post.title} />
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <Card.Text>{post.content}</Card.Text>

            {/* Author and Published Date */}
            <p>
              <strong>Author:</strong> {post.author_name || "Unknown"} <br />
              <strong>Published on:</strong> {formatDate(post.created_at)}
            </p>

            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div>
                <strong>Categories: </strong>
                {post.categories.map((category) => (
                  <Badge key={category.id} className="me-1" bg="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div>
                <strong>Tags: </strong>
                {post.tags.map((tag) => (
                  <Badge key={tag.id} className="me-1" bg="info">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Social Share Buttons */}
            <div className="mt-3">
              <strong>Share this post: </strong>
              <FacebookShareButton
                url={window.location.href}
                quote={post.title}
                className="me-2"
              >
                <Button variant="primary">Facebook</Button>
              </FacebookShareButton>

              <TwitterShareButton
                url={window.location.href}
                title={post.title}
                className="me-2"
              >
                <Button variant="info">Twitter</Button>
              </TwitterShareButton>

              <LinkedinShareButton
                url={window.location.href}
                title={post.title}
                className="me-2"
              >
                <Button variant="primary">LinkedIn</Button>
              </LinkedinShareButton>
            </div>

            {/* Post actions */}
            <div className="d-flex justify-content-start mt-3">
              <Button className="me-2" onClick={handleUpvote}>
                Upvote
              </Button>
              <Button className="me-2" onClick={handleDownvote}>
                Downvote
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default PostDetail;
