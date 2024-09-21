import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { fetchMostViewedPosts } from "./../redux/post/postThunks";
import {
  selectMostViewedPosts,
  selectPostsLoading,
  selectPostsError,
} from "./../redux/post/postSlice";

import "./../styles/HomePage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const mostViewedPosts = useSelector(selectMostViewedPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Debounce function
  const debounce = (func, wait) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedFetch = useMemo(() => {
    return debounce(() => {
      dispatch(fetchMostViewedPosts()); // Call the thunk directly
    }, 500); // Wait 500ms before fetching
  }, [dispatch]);

  useEffect(() => {
    const now = Date.now();
    if (!lastFetchTime || now - lastFetchTime >= 86400000) {
      // 24 hours in milliseconds
      debouncedFetch();
      setLastFetchTime(now);
    }
  }, [debouncedFetch, lastFetchTime]);

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
        {error}
      </Alert>
    );
  }

  return (
    <Container>
      <HeroCarousel />

      <section className="my-4">
        <h2>Most Viewed Posts</h2>
        {Array.isArray(mostViewedPosts) && mostViewedPosts.length > 0 ? (
          <Row>
            {mostViewedPosts.slice(0, 6).map((post) => (
              <Col md={6} lg={4} key={post.id} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>
                      {post.excerpt ||
                        (post.content && post.content.slice(0, 200))}
                    </Card.Text>
                    <Button variant="secondary" href={`/posts/${post.id}`}>
                      Read More
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info">No posts available at the moment.</Alert>
        )}
      </section>
    </Container>
  );
};

export default HomePage;
