import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import HeroCarousel from "../components/common/HeroCarousel";
import { usePosts } from "../hooks/usePosts";
import "./../styles/HomePage.css";

const HomePage = () => {
  const {
    fetchMostViewedPosts,
    loading: postsLoading,
    error: postsError,
  } = usePosts();
  const [latestPosts, setLatestPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const latestPostsData = await fetchMostViewedPosts();
        setLatestPosts(latestPostsData.slice(0, 6)); // Show only 6 latest posts
      } catch (err) {
        console.error("Error fetching latest posts:", err);
        setError(err.message || "Failed to load latest posts");
      }
    };

    fetchLatestData();
  }, [fetchMostViewedPosts]);

  if (postsLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only"></span>
        </Spinner>
      </div>
    );
  }

  if (error || postsError) {
    return (
      <Alert variant="danger" className="text-center">
        {error || postsError}
      </Alert>
    );
  }

  return (
    <Container>
      <HeroCarousel />

      <section className="my-4">
        <h2>Latest Posts</h2>
        <Row>
          {latestPosts.map((post) => (
            <Col md={6} lg={4} key={post.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>
                    {post.excerpt || post.content.slice(0, 200)}
                  </Card.Text>
                  <Button variant="secondary" href={`/posts/${post.id}`}>
                    Read More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  );
};

export default HomePage;
