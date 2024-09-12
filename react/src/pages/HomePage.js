import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Spinner,
  Alert,
  Container,
  Button,
  Modal,
  ListGroup,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import HeroCarousel from "../components/common/HeroCarousel";
import { postService } from "../services/postsService";
import { tagService } from "../services/tagsService";
import "./../styles/HomePage.css";

const HomePage = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [mostViewedPosts, setMostViewedPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMoreTags, setShowMoreTags] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [featuredResponse, mostViewedResponse, tagsResponse] =
        await Promise.all([
          postService.fetchFeaturedPosts(),
          postService.fetchMostViewedPosts(),
          tagService.listTags(),
        ]);

      // Ensure that responses are arrays before slicing
      const featured = Array.isArray(featuredResponse) ? featuredResponse : [];
      const mostViewed = Array.isArray(mostViewedResponse)
        ? mostViewedResponse
        : [];
      const tagsData = Array.isArray(tagsResponse) ? tagsResponse : [];

      console.log("Featured Posts:", featured);
      console.log("Most Viewed Posts:", mostViewed);
      console.log("Tags:", tagsData);

      setFeaturedPosts(featured.slice(0, 1)); // Display only the first featured post
      setMostViewedPosts(mostViewed.slice(0, 10)); // Display up to 10 most viewed posts
      setTags(tagsData.slice(0, 10)); // Display top 10 tags

      // Store all tags for modal view
      setAllTags(tagsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLoadMoreTags = () => {
    setShowMoreTags(true);
  };

  const renderError = (error) => {
    if (typeof error === "string") {
      return error;
    } else if (error && typeof error === "object") {
      if (error.message === "ERR_INSUFFICIENT_RESOURCES") {
        return "The system is currently overloaded. Please try again later.";
      } else if (error.status === 429) {
        return "Too many requests. Please wait a moment before trying again.";
      }
      return error.message || JSON.stringify(error);
    }
    return "An unknown error occurred";
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {renderError(error)}
      </Alert>
    );
  }

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Home</Breadcrumb.Item>
      </Breadcrumb>

      <HeroCarousel />

      <section className="my-4">
        <h2>Featured Post</h2>
        <Row>
          {featuredPosts.map((post) => (
            <Col md={12} lg={6} key={post.id} className="mb-4">
              <Card>
                <Card.Img variant="top" src={post.imageUrl} alt={post.title} />
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.excerpt}</Card.Text>
                  <Button variant="primary" href={`/posts/${post.id}`}>
                    Read More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="my-4">
        <h2>Most Viewed Posts</h2>
        <Row>
          {mostViewedPosts.map((post) => (
            <Col md={6} lg={4} key={post.id} className="mb-4">
              <Card>
                <Card.Img variant="top" src={post.imageUrl} alt={post.title} />
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.excerpt}</Card.Text>
                  <Button variant="secondary" href={`/posts/${post.id}`}>
                    Read More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="my-4">
        <h2>Top Tags</h2>
        <Row>
          {tags.map((tag) => (
            <Col md={4} lg={3} key={tag.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{tag.name}</Card.Title>
                  <Button
                    variant="outline-primary"
                    href={`/posts?tag=${tag.name}`}
                  >
                    View Posts
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {tags.length > 10 && !showMoreTags && (
          <Button variant="link" onClick={handleLoadMoreTags}>
            Load More Tags
          </Button>
        )}
      </section>

      <Modal show={showMoreTags} onHide={() => setShowMoreTags(false)}>
        <Modal.Header closeButton>
          <Modal.Title>All Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {allTags.map((tag) => (
              <ListGroup.Item key={tag.id}>{tag.name}</ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMoreTags(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HomePage;
