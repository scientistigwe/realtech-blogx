import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../../styles/Layout.css";

console.log("HeroCarousel starting...");

const HeroCarousel = ({ posts, onPostsLoaded }) => {
  useEffect(() => {
    if (posts.length > 0 && onPostsLoaded) {
      console.log("Posts loaded into carousel: ", posts);
      onPostsLoaded(posts); // Notify the parent component
    }
  }, [posts, onPostsLoaded]);

  if (!posts || posts.length === 0) {
    console.log("No posts available for the carousel.");
    return (
      <div className="text-center">No posts available for the carousel.</div>
    ); // Centered text for no posts
  }

  return (
    <div className="carousel-container">
      <Carousel>
        <Carousel.Item>
          <div className="carousel-caption">
            <h1>Welcome to RealTech BlogX</h1>
            <p>Explore our latest blogs and insights.</p>
            <Link to="/blogs" className="btn btn-primary">
              Explore Blogs
            </Link>
          </div>
        </Carousel.Item>

        {posts.slice(0, 3).map((post) => (
          <Carousel.Item key={post.id}>
            <div className="carousel-caption">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link to={`/posts/${post.id}`} className="btn btn-secondary">
                Read More
              </Link>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

HeroCarousel.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string.isRequired,
    })
  ).isRequired,
  onPostsLoaded: PropTypes.func,
};

export default HeroCarousel;
