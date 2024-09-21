import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchMostViewedPosts } from "../../redux/post/postThunks";
import {
  selectMostViewedPosts,
  selectPostsLoading,
  selectPostsError,
} from "../../redux/post/postSlice";

import "../../styles/HeroCarousel.css";

const HeroCarousel = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectMostViewedPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const [carouselItems, setCarouselItems] = useState([]);
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
    }, 500);
  }, [dispatch]);

  useEffect(() => {
    const now = Date.now();
    if (!lastFetchTime || now - lastFetchTime >= 86400000) {
      debouncedFetch();
      setLastFetchTime(now);
    }
  }, [debouncedFetch, lastFetchTime]);

  useEffect(() => {
    if (Array.isArray(posts)) {
      const welcomeSlide = {
        id: "welcome",
        title: "Welcome to RealTech BlogX",
        content: "Explore our latest blogs and insights.",
        link: "/blogs",
        isWelcome: true,
      };

      const mostViewedPosts = posts.slice(0, 3);
      console.log(`Most viewed posts: ${mostViewedPosts}`);

      setCarouselItems([welcomeSlide, ...mostViewedPosts]);
    }
  }, [posts]);

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
