import React, { useEffect, useState, useRef } from "react";
import { Breadcrumb } from "react-bootstrap";
import HeroCarousel from "../components/Layouts/HeroCarousel";
import PostList from "../components/Posts/PostList";
import TagList from "../components/Tags/TagList"; // Ensure this component exists
import api from "./../api/apiClient"; // Adjust the path according to your project structure

console.log("Homepage starting...");

const HomePage = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [carouselLoaded, setCarouselLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      console.log("Fetching posts for the first time...");
      const fetchPosts = async () => {
        try {
          const response = await api.posts.fetchAll(); // Using your apiClient's fetchAll method
          setAllPosts(response.data);
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
      hasFetched.current = true;
    }
  }, []);

  const handlePostsLoaded = () => {
    console.log("Carousel has loaded posts.");
    setCarouselLoaded(true);
  };

  const remainingPosts = allPosts.slice(3);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item active>Home</Breadcrumb.Item>
      </Breadcrumb>

      <HeroCarousel posts={allPosts} onPostsLoaded={handlePostsLoaded} />

      {carouselLoaded && <PostList posts={remainingPosts} />}

      <TagList />
    </div>
  );
};

export default HomePage;
