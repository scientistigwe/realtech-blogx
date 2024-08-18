import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumb } from "react-bootstrap";
import HeroCarousel from "../components/Layouts/HeroCarousel";
import PostList from "../components/Posts/PostList";
import TagList from "../components/Tags/TagList";
import { fetchPosts } from "../redux/slices/postsSlice";
import { selectAllPosts } from "../redux/selectors/postsSelectors";

const HomePage = () => {
  const dispatch = useDispatch();
  const allPosts = useSelector(selectAllPosts);
  const [carouselLoaded, setCarouselLoaded] = useState(false);

  useEffect(() => {
    if (!carouselLoaded && allPosts.length === 0) {
      dispatch(fetchPosts()); // Fetch posts only once when carousel is not loaded
    }
  }, [dispatch, allPosts, carouselLoaded]);

  const handlePostsLoaded = () => {
    setCarouselLoaded(true); // Mark that the carousel has loaded posts
  };

  const remainingPosts = allPosts.slice(3);

  return (
    <div className="container mt-4">
      <Breadcrumb>
        <Breadcrumb.Item active>Home</Breadcrumb.Item>
      </Breadcrumb>

      <section className="hero-carousel mb-5">
        <HeroCarousel
          posts={allPosts.slice(0, 3)}
          onPostsLoaded={handlePostsLoaded}
        />
      </section>

      <section className="post-list mb-5">
        <h2 className="mb-4">Latest Posts</h2>
        <PostList posts={remainingPosts} />
      </section>

      <section className="tag-list mb-5">
        <h2 className="mb-4">Popular Tags</h2>
        <TagList />
      </section>
    </div>
  );
};

export default HomePage;
