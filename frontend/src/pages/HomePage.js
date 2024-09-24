import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import HeroCarousel from "../components/common/HeroCarousel";
import { fetchMostViewedPosts } from "../redux/post/postThunks";
import {
  selectMostViewedPosts,
  selectPostsLoading,
  selectPostsError,
} from "../redux/post/postSlice";

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
          <span className="sr-only">Loading...</span>
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
          <h2>Most Viewed Posts</h2>
          {remainingPosts.length > 0 ? (
            <Row>
              {remainingPosts.map((post) => (
                <Col md={6} lg={4} key={post.id} className="mb-4">
                  <Card className="post-card">
                    <Card.Img
                      variant="top"
                      src={post.thumbnail || "/api/placeholder/400/300"}
                      alt={post.title}
                    />
                    <Card.Body>
                      <Card.Title>{post.title}</Card.Title>
                      <Card.Text className="post-excerpt">
                        {post.excerpt}
                      </Card.Text>
                      <div className="post-meta">
                        <span className="author">
                          By {post.author.first_name} {post.author.last_name}
                        </span>

                        <div className="views">
                          No of Views: {post.view_count}
                        </div>
                        <span className="date">
                          Published:{" "}
                          {new Date(post.publication_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="post-tags">
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
                      <div className="post-category">
                        {post.category && (
                          <Badge variant="info">{post.category.name}</Badge>
                        )}
                      </div>
                      <div className="post-votes">
                        <span className="upvotes">👍 {post.upvotes}</span>
                        <span className="downvotes">👎 {post.downvotes}</span>
                      </div>
                      <Link
                        to={`/posts/${post.id}`}
                        className="btn btn-primary mt-2"
                      >
                        Read More
                      </Link>
                    </Card.Body>
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
