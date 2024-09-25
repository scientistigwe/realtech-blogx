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
import HeroCarousel from "./../components/common/HeroCarousel";
import { fetchMostViewedPosts } from "../redux/post/postThunks";
import {
  selectMostViewedPosts,
  selectPostsLoading,
  selectPostsError,
} from "../redux/post/postSlice";
import styled from "styled-components";

const PostCard = styled(Card)`
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PostTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
`;

const PostExcerpt = styled.p`
  color: #555;
  font-size: 1rem;
  line-height: 1.6;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #6c757d;
`;

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
                  <PostCard>
                    <Row className="no-gutters">
                      <Col md={6}>
                        <Card.Img
                          src={post.thumbnail || "/api/placeholder/400/300"}
                          alt={post.title}
                          className="h-100 object-fit-cover"
                        />
                      </Col>
                      <Col md={6}>
                        <Card.Body>
                          <PostTitle>{post.title}</PostTitle>
                          <PostExcerpt>{post.excerpt}</PostExcerpt>
                          <MetaInfo>
                            <small>
                              By {post.author.first_name}{" "}
                              {post.author.last_name} |{" "}
                              {new Date(
                                post.publication_date
                              ).toLocaleDateString()}
                            </small>
                            <div>
                              <span className="upvotes mr-2">
                                👍 {post.upvotes}
                              </span>
                              <span className="downvotes">
                                👎 {post.downvotes}
                              </span>
                            </div>
                          </MetaInfo>
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
                          <Link
                            to={`/posts/${post.id}`}
                            className="btn btn-primary mt-3"
                          >
                            Read More
                          </Link>
                        </Card.Body>
                      </Col>
                    </Row>
                  </PostCard>
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
