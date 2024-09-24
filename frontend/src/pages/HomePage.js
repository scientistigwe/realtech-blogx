import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import HeroCarousel from "../components/common/HeroCarousel";
import { fetchMostViewedPosts } from "../redux/post/postThunks";
import {
  selectMostViewedPosts,
  selectPostsLoading,
  selectPostsError,
} from "../redux/post/postSlice";
import "../styles/HomePage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const mostViewedPosts = useSelector(selectMostViewedPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (!dataFetched) {
      dispatch(fetchMostViewedPosts());
      setDataFetched(true);
    }
  }, [dispatch, dataFetched]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="sr-only"></span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="error-alert">
        {error.message || "An error occurred while fetching posts."}
      </Alert>
    );
  }

  const heroCarouselPosts = mostViewedPosts.slice(0, 3);
  const remainingPosts = mostViewedPosts.slice(3);

  return (
    <Container fluid className="home-page">
      <div className="hero-section">
        <HeroCarousel posts={heroCarouselPosts} />
      </div>

      <Container>
        <section className="most-viewed-posts">
          <h2 className="section-title mb-4">Most Viewed Posts</h2>
          {remainingPosts.length > 0 ? (
            <Row>
              {remainingPosts.map((post) => (
                <Col md={6} key={post.id} className="mb-4">
                  <Card className="post-card">
                    <Row noGutters>
                      <Col md={6}>
                        <Card.Img
                          src={post.thumbnail || "/api/placeholder/400/300"}
                          alt={post.title}
                          className="h-100 object-fit-cover"
                        />
                      </Col>
                      <Col md={6}>
                        <Card.Body>
                          <Card.Title className="h4 mb-3">
                            {post.title}
                          </Card.Title>
                          <Card.Text className="post-excerpt mb-3">
                            {post.excerpt}
                          </Card.Text>
                          <div className="post-meta mb-2">
                            <small className="text-muted">
                              By {post.author.first_name}{" "}
                              {post.author.last_name} |
                              {new Date(
                                post.publication_date
                              ).toLocaleDateString()}
                            </small>
                          </div>
                          <div className="post-tags mb-2">
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag.id}
                                variant="secondary"
                                className="mr-1"
                              >
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                          <div className="post-category mb-2">
                            {post.category && (
                              <Badge variant="info">{post.category.name}</Badge>
                            )}
                          </div>
                          <div className="post-stats d-flex justify-content-between align-items-center">
                            <div className="views">
                              <small>Views: {post.view_count}</small>
                            </div>
                            <div className="post-votes">
                              <span className="upvotes mr-2">
                                👍 {post.upvotes}
                              </span>
                              <span className="downvotes">
                                👎 {post.downvotes}
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/posts/${post.id}`}
                            className="btn btn-primary mt-3"
                          >
                            Read More
                          </Link>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert variant="info">
              No additional posts available at the moment.
            </Alert>
          )}
        </section>
      </Container>
    </Container>
  );
};

export default HomePage;
