import React from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";

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
            <div className="welcome-slide">
              <div className="welcome-content">
                <h1>{item.title}</h1>
                <p>{item.content}</p>
                <Link to={item.link} className="btn btn-primary">
                  Explore Blogs
                </Link>
              </div>
            </div>
          ) : (
            <div className="hero-slide">
              <div className="hero-card">
                <div className="hero-image">
                  <img
                    src={item.thumbnail || "/api/placeholder/800/600"}
                    alt={`${item.title} thumbnail`}
                  />
                </div>
                <div className="hero-content">
                  <h2>{item.title}</h2>
                  <p className="excerpt">{item.excerpt}</p>
                  <div className="post-meta">
                    <span className="author">
                      By {item.author.first_name} {item.author.last_name}
                    </span>
                    <span className="views">Views: {item.view_count}</span>
                    <span className="date">
                      Published:{" "}
                      {new Date(item.publication_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="post-tags">
                    {item.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="mr-1">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  {item.category && (
                    <div className="post-category">
                      <Badge variant="info">{item.category.name}</Badge>
                    </div>
                  )}
                  <div className="post-votes">
                    <span className="upvotes">👍 {item.upvotes}</span>
                    <span className="downvotes">👎 {item.downvotes}</span>
                  </div>
                  <Link to={`/posts/${item.id}`} className="btn btn-secondary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HeroCarousel;
