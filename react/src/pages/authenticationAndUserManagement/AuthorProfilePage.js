import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Spinner,
  Modal,
  Button,
  Form,
  Breadcrumb,
  Alert,
} from "react-bootstrap";
import api from "./../../api/apiClient"; // Adjust the path if needed
import "./../../styles/Layout.css";
import "./../../styles/Pages.css";
import "./../../styles/Global.css";
import "./../../styles/Components.css";

const AuthorProfilePage = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const fetchAuthorAndPosts = async () => {
      try {
        const [authorResponse, postsResponse] = await Promise.all([
          api.authors.detail(id),
          api.posts.fetchByUser(id),
        ]);
        setAuthor(authorResponse.data);
        setPosts(postsResponse.data);
      } catch (err) {
        setError(err.message || "Failed to fetch author and posts");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorAndPosts();
  }, [id]);

  const handleContactClick = () => setShowContactModal(true);

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.authors.contactAuthor(id, contactForm.message);
      setShowContactModal(false);
      setContactForm({ name: "", email: "", message: "" });
      alert("Message sent successfully!");
    } catch {
      alert("Failed to send message. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container mt-4 author-profile-page">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/authors">Authors</Breadcrumb.Item>
        <Breadcrumb.Item active>
          {author ? author.userId : "Author Profile Page Loading..."}
        </Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mb-4 text-center">Author Profile</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {author && (
        <div className="profile-section mb-4 p-4 rounded shadow-sm">
          <div className="profile-container d-flex">
            <div className="profile-image me-3">
              <img
                src={author.image}
                alt={`${author.userId}'s profile`}
                className="img-fluid rounded-circle"
              />
            </div>
            <div className="profile-details">
              <h2>{author.userId}</h2>
              {author.bio && <p className="profile-bio">Bio: {author.bio}</p>}
              {author.location && <p>Location: {author.location}</p>}
              {author.website && (
                <p>
                  Website:{" "}
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {author.website}
                  </a>
                </p>
              )}
              <Button onClick={handleContactClick} variant="primary">
                Contact Author
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        {posts.length > 0 ? (
          <div className="post-section mb-4">
            <h3 className="mb-3">Posts by {author?.userId}</h3>
            <div className="list-group">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h5 className="mb-1">{post.title}</h5>
                    <p className="mb-1">{post.snippet}</p>
                  </div>
                  <Link
                    to={`/posts/${post.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Read More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Alert variant="info">
            No posts available from this author at the moment.
          </Alert>
        )}
      </div>

      {/* Contact Modal */}
      <Modal show={showContactModal} onHide={() => setShowContactModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Contact {author?.userId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleContactSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={contactForm.name}
                onChange={handleContactFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={contactForm.email}
                onChange={handleContactFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                value={contactForm.message}
                onChange={handleContactFormChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Send Message
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AuthorProfilePage;
