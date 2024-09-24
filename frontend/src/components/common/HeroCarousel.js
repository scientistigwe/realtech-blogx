import React from "react";
import { Carousel, Card, Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../styles/HeroCarousel.css";

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
    <Carousel className="hero-carousel">
      {carouselItems.map((item, index) => (
        <Carousel.Item key={item.id}>
          {item.isWelcome ? (
            <div
              className="welcome-slide d-flex align-items-center justify-content-center"
              style={{ height: "400px" }}
            >
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
              <Card className="hero-card border-0">
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
                      <Card.Title className="h3 mb-3">{item.title}</Card.Title>
                      <Card.Text className="post-excerpt mb-3">
                        {item.excerpt}
                      </Card.Text>
                      <div className="post-meta mb-2">
                        <small className="text-muted">
                          By {item.author.first_name} {item.author.last_name} |
                          {new Date(item.publication_date).toLocaleDateString()}
                        </small>
                      </div>
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
                      <div className="post-stats d-flex justify-content-between align-items-center">
                        <div className="views">
                          <small>Views: {item.view_count}</small>
                        </div>
                        <div className="post-votes">
                          <span className="upvotes mr-2">
                            👍 {item.upvotes}
                          </span>
                          <span className="downvotes">👎 {item.downvotes}</span>
                        </div>
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
              </Card>
            </div>
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HeroCarousel;
