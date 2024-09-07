import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMostViewedPosts } from "../../hooks/usePosts";

const HeroCarousel = () => {
  const { posts, error, loading, fetchMostViewedPosts } = useMostViewedPosts();
  const [lastFetchTime, setLastFetchTime] = useState(
    localStorage.getItem("lastFetchTime") || 0
  );

  const fetchData = async () => {
    const currentTime = Date.now();
    // Check if 24 hours have passed since the last fetch
    if (currentTime - lastFetchTime >= 24 * 60 * 60 * 1000) {
      try {
        await fetchMostViewedPosts();
        setLastFetchTime(currentTime);
        localStorage.setItem("lastFetchTime", currentTime);
      } catch (fetchError) {
        console.error("Error fetching most viewed posts:", fetchError);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchMostViewedPosts]);

  if (loading) return <div>Loading...</div>;
  if (error)
    return <div>Error: {error.message || "Failed to load posts."}</div>;

  if (!posts || posts.length === 0) return <div>No posts available.</div>;

  return (
    <Carousel className="hero-carousel">
      <Carousel.Item>
        <div className="hero-slide">
          <div className="hero-content">
            <h1>Welcome to RealTech BlogX</h1>
            <p>Explore our latest blogs and insights.</p>
            <Link to="/blogs" className="btn btn-primary">
              Explore Blogs
            </Link>
          </div>
        </div>
      </Carousel.Item>
      {posts.slice(0, 3).map((post) => (
        <Carousel.Item key={post.id}>
          <div className="hero-slide">
            <div className="hero-content">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link to={`/posts/${post.id}`} className="btn btn-secondary">
                Read More
              </Link>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HeroCarousel;
