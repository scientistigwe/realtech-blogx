import React, { useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../../styles/Layout.css";

const HeroCarousel = ({ posts, onPostsLoaded }) => {
  useEffect(() => {
    if (posts.length > 0 && onPostsLoaded) {
      onPostsLoaded(posts); // Notify the parent component
    }
  }, [posts, onPostsLoaded]);

  if (!posts || posts.length === 0) {
    return <div>No posts available for the carousel.</div>;
  }

  return (
    <Carousel>
      <Carousel.Item>
        <div className="hero-slide d-flex justify-content-center align-items-center text-center">
          <div className="hero-content">
            <h1>Welcome to RealTech BlogX</h1>
            <p>Explore our latest blogs and insights.</p>
            <Link
              to="/blog"
              className="cta-button btn btn-primary"
              aria-label="Explore our blog"
            >
              Explore Blogs
            </Link>
          </div>
        </div>
      </Carousel.Item>

      {posts.slice(0, 3).map((post) => (
        <Carousel.Item key={post.id}>
          <img
            className="d-block w-100"
            src={post.image}
            alt={post.title}
            loading="lazy"
          />
          <Carousel.Caption>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <Link
              to={`/post/${post.id}`}
              className="btn btn-primary"
              aria-label={`Read more about ${post.title}`}
            >
              Read More
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HeroCarousel;
