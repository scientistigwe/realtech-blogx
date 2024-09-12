import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Breadcrumb,
  Alert,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { postService } from "../../services/postsService";
import { commentService } from "../../services/commentsService";
import { authorService } from "../../services/authorService";
import { authService } from "../../services/authService";
import "../../styles/PostDetail.css";

// Import default avatar
import defaultAvatar from "../../assets/images/default-avatar.png"; // Adjust path as necessary

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const fetchedPost = await postService.fetchPostById(postId);
        setPost(fetchedPost);
        const fetchedAuthor = await authorService.getAuthorById(
          fetchedPost.authorId
        );
        setAuthor(fetchedAuthor);
        setComments(await commentService.listComments(postId));

        // Check if the user is authenticated
        const authStatus = await authService.checkAuth();
        setIsAuthenticated(authStatus);

        // Optionally fetch user data to determine if the user is an admin
        if (authStatus) {
          const userResponse = await fetch("/api/user-details", {
            credentials: "include",
          });
          const userData = await userResponse.json();
          setIsAdmin(userData.is_staff || false);
        }
      } catch (err) {
        setError("Error fetching post details.");
        console.error(err);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("Please sign in to add a comment.");
      return;
    }

    try {
      await commentService.createComment({ postId, content: commentContent });
      setCommentContent("");
      setComments(await commentService.listComments(postId));
    } catch (err) {
      setError("Error submitting comment.");
      console.error(err);
    }
  };

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      setError("Please sign in to upvote.");
      return;
    }

    try {
      await postService.upvotePost(postId);
      setPost(await postService.fetchPostById(postId)); // Refresh post details
    } catch (err) {
      setError("Error upvoting post.");
      console.error(err);
    }
  };

  const handleDownvote = async () => {
    if (!isAuthenticated) {
      setError("Please sign in to downvote.");
      return;
    }

    try {
      await postService.downvotePost(postId);
      setPost(await postService.fetchPostById(postId)); // Refresh post details
    } catch (err) {
      setError("Error downvoting post.");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      setError("You do not have permission to delete this post.");
      return;
    }

    try {
      await postService.deletePost(postId);
      navigate("/posts"); // Redirect to post list
    } catch (err) {
      setError("Error deleting post.");
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/posts">Posts</Breadcrumb.Item>
        <Breadcrumb.Item active>Post Detail</Breadcrumb.Item>
      </Breadcrumb>

      {error && <Alert variant="danger">{error}</Alert>}

      {post && (
        <>
          <Card className="post-detail-card">
            <Card.Img
              variant="top"
              src={post.thumbnailUrl || defaultAvatar} // Use defaultAvatar if thumbnailUrl is not available
              className="post-thumbnail"
            />
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Published on{" "}
                {new Date(post.publicationDate).toLocaleDateString()}
              </Card.Subtitle>
              <Card.Text>{post.content}</Card.Text>
              <Card.Text>Views: {post.viewCount}</Card.Text>
              <Card.Text>Votes: {post.voteCount}</Card.Text>
              <Card.Text>Comments: {comments.length}</Card.Text>
              <Card.Text>
                Author: {author?.name}
                <img
                  src={author?.profilePicture || defaultAvatar} // Use defaultAvatar if profilePicture is not available
                  alt="Author Avatar"
                  className="author-avatar"
                />
              </Card.Text>
              {isAuthenticated && (
                <>
                  <Button variant="primary" onClick={handleUpvote}>
                    Upvote
                  </Button>
                  <Button variant="secondary" onClick={handleDownvote}>
                    Downvote
                  </Button>
                </>
              )}
              {isAdmin && (
                <Button variant="danger" onClick={handleDelete}>
                  Delete Post
                </Button>
              )}
            </Card.Body>
          </Card>

          <Form onSubmit={handleCommentSubmit} className="mt-4">
            <Form.Group controlId="commentContent">
              <Form.Label>Add a Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit Comment
            </Button>
          </Form>

          {comments.map((comment) => (
            <Card key={comment.id} className="mt-3 comment-card">
              <Card.Body>
                <Card.Text>{comment.content}</Card.Text>
                {/* Add comment actions if needed */}
              </Card.Body>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
};

export default PostDetail;
