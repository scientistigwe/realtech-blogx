import React, { useEffect, useState } from "react";
import { Breadcrumb, Spinner, Alert, Container, Button } from "react-bootstrap";
import HeroCarousel from "../components/Layouts/HeroCarousel";
import PostList from "../components/Posts/PostList";
import { usePostsList } from "../hooks/usePosts";
import { useTagsList } from "../hooks/useTags";

const HomePage = () => {
  const [retryCount, setRetryCount] = useState(0);
  const {
    posts: allPosts,
    error: postsError,
    loading: postsLoading,
    fetchPosts,
  } = usePostsList();
  const {
    tags,
    error: tagsError,
    loading: tagsLoading,
    fetchTags,
  } = useTagsList();

  const fetchData = async () => {
    try {
      await Promise.all([fetchPosts(), fetchTags()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [retryCount]); // Remove timer, directly call fetchData

  const handleRetry = () => {
    setRetryCount((prevCount) => prevCount + 1);
  };

  // Extract the first 3 posts for the HeroCarousel
  const heroPosts = Array.isArray(allPosts) ? allPosts.slice(0, 3) : [];
  // Extract the remaining posts for the PostList
  const remainingPosts = Array.isArray(allPosts) ? allPosts.slice(3) : [];

  const renderError = (error) => {
    if (typeof error === "string") {
      return error;
    } else if (error && typeof error === "object") {
      if (error.message === "ERR_INSUFFICIENT_RESOURCES") {
        return "The system is currently overloaded. Please try again later.";
      } else if (error.status === 429) {
        return "Too many requests. Please wait a moment before trying again.";
      }
      return error.message || JSON.stringify(error);
    }
    return "An unknown error occurred";
  };

  const isLoading = postsLoading || tagsLoading;
  const hasError = postsError || tagsError;

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Home</Breadcrumb.Item>
      </Breadcrumb>

      {isLoading && (
        <Spinner animation="border" className="d-block mx-auto mt-4" />
      )}
      {hasError && (
        <Alert variant="danger" className="text-center mt-4">
          {renderError(postsError || tagsError)}
          <Button onClick={handleRetry} className="mt-2">
            Retry
          </Button>
        </Alert>
      )}
      {!isLoading && !hasError && (
        <>
          <HeroCarousel posts={heroPosts} />
          <PostList posts={remainingPosts} />
        </>
      )}
    </Container>
  );
};

export default HomePage;
