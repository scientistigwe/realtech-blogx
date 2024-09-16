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
import { usePosts } from "../hooks/usePosts";
import { useTags } from "../hooks/useTags";
import "./../styles/HomePage.css";

// Define mediaBaseUrl and default image
const mediaBaseUrl =
  process.env.REACT_APP_MEDIA_BASE_URL || "http://localhost:8000/media/";
const defaultImageUrl = `${mediaBaseUrl}posts/default-image.png`;

const HomePage = () => {
  const {
    fetchFeaturedPosts,
    fetchMostViewedPosts,
    loading: postsLoading,
    error: postsError,
  } = usePosts();
  const { listTags, loading: tagsLoading, error: tagsError } = useTags();

  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [mostViewedPosts, setMostViewedPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMoreTags, setShowMoreTags] = useState(false);

  const getImageUrl = (post) => {
    if (post.thumbnail) {
      // The thumbnail is already a complete URL, so return it as is
      return post.thumbnail;
    } else if (post.image_url) {
      // If image_url is provided, use it (it should already be a complete URL)
      return post.image_url;
    } else {
      // Use default image if no valid image information is available
      return defaultImageUrl;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [featuredResponse, mostViewedResponse, tagsResponse] =
          await Promise.all([
            fetchFeaturedPosts(),
            fetchMostViewedPosts(),
            listTags(),
          ]);

        console.log(
          "Featured Posts Response:",
          JSON.stringify(featuredResponse, null, 2)
        );
        console.log(
          "Most Viewed Posts Response:",
          JSON.stringify(mostViewedResponse, null, 2)
        );

        const processedFeaturedPosts = Array.isArray(featuredResponse)
          ? featuredResponse.slice(0, 2)
          : [];
        const processedMostViewedPosts = Array.isArray(mostViewedResponse)
          ? mostViewedResponse.slice(0, 10)
          : [];

        setFeaturedPosts(processedFeaturedPosts);
        setMostViewedPosts(processedMostViewedPosts);
        setTags(tagsResponse.results.slice(0, 12) || []);
        setAllTags(tagsResponse.results || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFeaturedPosts, fetchMostViewedPosts, listTags]);

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

  if (loading || postsLoading || tagsLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only"></span>
        </Spinner>
      </div>
    );
  }

  if (error || postsError || tagsError) {
    return (
      <Alert variant="danger" className="text-center">
        {renderError(error || postsError || tagsError)}
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
                <Card.Img
                  variant="top"
                  src={getImageUrl(post)}
                  alt={post.title}
                />
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
                <Card.Img
                  variant="top"
                  src={getImageUrl(post)}
                  alt={post.title}
                />
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
        {allTags.length > 12 && !showMoreTags && (
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
