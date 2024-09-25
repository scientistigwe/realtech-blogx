import React from "react";
import { Carousel, Card, Row, Col, Badge, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";

const HeroSection = styled.div`
  background-color: #f8f9fa;
  padding: 4rem 0;
`;

const HeroCard = styled(Card)`
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PostTitle = styled.h3`
  font-size: 1.5rem;
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

const HeroCarousel = ({ posts }) => {
  const welcomeSlide = {
    id: "welcome",
    title: "Welcome to RealTech BlogX",
    content: "Explore our latest blogs and insights.",
    link: "/blogs",
    isWelcome: true,
  };

  const topPosts = posts.slice(0, 3);
  const carouselItems = [welcomeSlide, ...topPosts];

  return (
    <HeroSection>
      <Container>
        <Carousel className="hero-carousel">
          {carouselItems.map((item, index) => (
            <Carousel.Item key={item.id}>
              {item.isWelcome ? (
                <div className="welcome-slide d-flex align-items-center justify-content-center">
                  <div className="welcome-content text-center">
                    <h1 className="mb-3">{item.title}</h1>
                    <p className="mb-4">{item.content}</p>
                    <Link to={item.link} className="btn btn-primary">
                      Explore Blogs
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center">
                  <HeroCard>
                    <Row className="no-gutters">
                      <Col md={6}>
                        <Card.Img
                          src={item.thumbnail || "/api/placeholder/800/600"}
                          alt={`${item.title} thumbnail`}
                          className="h-100 object-fit-cover"
                        />
                      </Col>
                      <Col md={6}>
                        <Card.Body>
                          <PostTitle>{item.title}</PostTitle>
                          <PostExcerpt>{item.excerpt}</PostExcerpt>
                          <MetaInfo>
                            <small>
                              By {item.author.first_name}{" "}
                              {item.author.last_name} |{" "}
                              {new Date(
                                item.publication_date
                              ).toLocaleDateString()}
                            </small>
                            <div>
                              <span className="upvotes mr-2">
                                👍 {item.upvotes}
                              </span>
                              <span className="downvotes">
                                👎 {item.downvotes}
                              </span>
                            </div>
                          </MetaInfo>
                          <div className="post-tags mb-2">
                            {item.tags.map((tag) => (
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
                            {item.category && (
                              <Badge variant="info">{item.category.name}</Badge>
                            )}
                          </div>
                          <Link
                            to={`/posts/${item.id}`}
                            className="btn btn-primary mt-3"
                          >
                            Read More
                          </Link>
                        </Card.Body>
                      </Col>
                    </Row>
                  </HeroCard>
                </div>
              )}
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </HeroSection>
  );
};

export default HeroCarousel;
