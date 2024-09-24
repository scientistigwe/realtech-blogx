import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts";
import {
  Container,
  Card,
  Button,
  Alert,
  Spinner,
  Form,
  ListGroup,
} from "react-bootstrap";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPostById, loading: postLoading } = usePosts();

  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadPost = useCallback(async () => {
    try {
      const fetchedPost = await fetchPostById(id);
      setPost(fetchedPost);
    } catch (err) {
      setError("Failed to load post details");
      console.error(err);
    }
  }, [id, fetchPostById]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  if (postLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!post) return null;

  const filteredContent = post.content
    .split("\n")
    .filter((line) => line.toLowerCase().includes(searchTerm.toLowerCase()))
    .join("\n");

  return (
    <Container className="my-5">
      <Card>
        <Card.Header as="h2">{post.title}</Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search within post..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>

          <Card.Text>{searchTerm ? filteredContent : post.content}</Card.Text>

          <hr />

          <h4>Author Information</h4>
          <p>{post.author.bio}</p>
          <p>Contact: {post.author.email}</p>

          <hr />

          <h4>Categories and Tags</h4>
          <p>
            Category: {post.category ? post.category.name : "Uncategorized"}
          </p>
          <p>Tags: {post.tags.map((tag) => tag.name).join(", ")}</p>

          <hr />

          <h4>Publication Details</h4>
          <p>
            Published on: {new Date(post.publication_date).toLocaleString()}
          </p>
          {post.edit_history && (
            <>
              <h5>Edit History</h5>
              <ListGroup>
                {post.edit_history.map((edit, index) => (
                  <ListGroup.Item key={index}>
                    Edited on: {new Date(edit.date).toLocaleString()}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}

          <hr />

          <h4>Related Posts</h4>
          <ListGroup>
            {post.related_posts &&
              post.related_posts.map((relatedPost) => (
                <ListGroup.Item
                  key={relatedPost.id}
                  action
                  onClick={() => navigate(`/post/${relatedPost.id}`)}
                >
                  {relatedPost.title}
                </ListGroup.Item>
              ))}
          </ListGroup>

          <hr />

          <h4>Comments</h4>
          {post.comments &&
            post.comments.map((comment) => (
              <Card key={comment.id} className="mb-3">
                <Card.Body>
                  <Card.Text>{comment.content}</Card.Text>
                  <Card.Footer>
                    By {comment.author} on{" "}
                    {new Date(comment.date).toLocaleString()}
                  </Card.Footer>
                </Card.Body>
              </Card>
            ))}

          <hr />

          <h4>Share this post</h4>
          <Button variant="primary" className="me-2">
            Share on Facebook
          </Button>
          <Button variant="info">Share on Twitter</Button>

          <hr />

          <Button variant="primary" onClick={() => navigate(-1)}>
            Back to List
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostDetail;
