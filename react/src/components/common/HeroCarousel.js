import React, { useEffect, useState } from "react";
import { Carousel, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts"; // Adjust the path as necessary
import "./../../styles/HeroCarousel.css"; // Add any custom styles here

const HeroCarousel = () => {
  const { fetchMostViewedPosts } = usePosts();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carouselItems, setCarouselItems] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchMostViewedPosts();
        setPosts(response || []); // Ensure response is always an array
        setLoading(false);
      } catch (fetchError) {
        console.error("Error fetching most viewed posts:", fetchError);
        setError(fetchError);
        setLoading(false);
      }
    };

    loadPosts();
  }, [fetchMostViewedPosts]);

  useEffect(() => {
    // Create carouselItems based on posts data
    if (Array.isArray(posts)) {
      setCarouselItems([
        {
          id: "welcome",
          title: "Welcome to RealTech BlogX",
          content: "Explore our latest blogs and insights.",
          link: "/blogs",
          isWelcome: true,
        },
        ...posts.slice(0, 3),
      ]);
    }
  }, [posts]);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only"></span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        Error: {error.message || "Failed to load posts."}
      </Alert>
    );
  }

  if (carouselItems.length === 0) {
    return <div className="text-center">No posts available.</div>;
  }

  return (
    <Carousel className="hero-carousel">
      {carouselItems.map((item) => (
        <Carousel.Item key={item.id}>
          <div className="hero-slide">
            <div className="hero-content">
              <h1>{item.title}</h1>
              <p>{item.content}</p>
              <Link
                to={item.link}
                className={`btn ${
                  item.isWelcome ? "btn-primary" : "btn-secondary"
                }`}
              >
                {item.isWelcome ? "Explore Blogs" : "Read More"}
              </Link>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HeroCarousel;
