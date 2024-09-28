import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Button,
} from "react-bootstrap";
import { ThumbsUp, ThumbsDown, MessageCircle, Mail } from "lucide-react";
import styled from "styled-components";
import HeroCarousel from "../components/common/HeroCarousel";
import {
  fetchMostViewedPosts,
  fetchFeaturedPosts,
  fetchPostsByCategory,
  fetchPostsByTag,
} from "../redux/post/postThunks";
import { fetchCategories } from "../redux/category/categoryThunks";
import { fetchTags } from "../redux/tag/tagThunks";

import {
  selectMostViewedPosts,
  selectFeaturedPosts,
  selectPostsByCategory,
  selectPostsByTag,
  selectPostsLoading,
  selectPostsError,
} from "../redux/post/postSlice";

import { selectCategories } from "../redux/category/categorySlice";
import { selectTags } from "../redux/tag/tagSelectors";

const PageWrapper = styled.div`
  background-color: #f8f9fa; /* Light background */
  padding: 2rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #212529; /* Dark grey */
  margin-bottom: 2rem;
  text-align: center;
`;

const PostCard = styled(Card)`
  border-radius: 10px;
  background-color: #ffffff; /* White for cards */
  border: 1px solid #d3d3d3; /* Light grey border */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  overflow: hidden;

  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const PostTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529; /* Dark grey */
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #007bff; /* Primary color */
  }
`;

const PostExcerpt = styled.p`
  color: #6c757d; /* Medium grey */
  font-size: 0.95rem;
  line-height: 1.6;
  max-height: 75px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const MetaInfo = styled.div`
  font-size: 0.85rem;
  color: #6c757d; /* Medium grey */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const EngagementInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  margin-top: 1rem;
`;

const EngagementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AuthorImage = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
`;

const ErrorMessage = styled(Alert)`
  margin-top: 2rem;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;

  &::after {
    content: "";
    width: 40px;
    height: 40px;
    border: 5px solid #007bff; /* Primary color */
    border-radius: 50%;
    border-top: 5px solid transparent;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const HomePage = () => {
  const dispatch = useDispatch();
  const mostViewedPosts = useSelector(selectMostViewedPosts) ?? [];
  const featuredPosts = useSelector(selectFeaturedPosts) ?? [];
  const postsByCategory = useSelector(selectPostsByCategory) ?? [];
  const postsByTag = useSelector(selectPostsByTag) ?? [];
  const categories = useSelector(selectCategories) ?? [];
  const tags = useSelector(selectTags) ?? [];
  const loading = useSelector(selectPostsLoading) ?? false;
  const error = useSelector(selectPostsError) ?? null;
  const [dataFetched, setDataFetched] = useState(false);

  const carouselPosts = mostViewedPosts.slice(0, 3);
  const remainingMostViewedPosts = mostViewedPosts.slice(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchMostViewedPosts()),
          dispatch(fetchFeaturedPosts()),
          dispatch(fetchCategories()),
          dispatch(fetchTags()),
        ]);
        setDataFetched(true);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (!dataFetched) {
      fetchData();
    }
  }, [dispatch, dataFetched]);

  useEffect(() => {
    if (categories.length > 0 && tags.length > 0) {
      dispatch(fetchPostsByCategory(categories[0].slug));
      dispatch(fetchPostsByTag(tags[0].slug));
    }
  }, [dispatch, categories, tags]);

  const renderPostCard = (post) => {
    if (!post) return null;
    return (
      <Col md={4} key={post.id} className="mb-4">
        <PostCard>
          <Card.Body>
            <Row>
              <Col md={8}>
                <PostTitle>{post.title}</PostTitle>
                <PostExcerpt>{post.excerpt}</PostExcerpt>
                <MetaInfo>
                  <AuthorInfo>
                    <AuthorImage
                      src={
                        post.author?.profile_picture || "/api/placeholder/35/35"
                      }
                      alt={post.author?.first_name}
                    />
                    {post.author?.first_name} {post.author?.last_name}
                  </AuthorInfo>
                  <div>
                    {new Date(post.publication_date).toLocaleDateString()}
                  </div>
                </MetaInfo>
                <div>
                  {post.tags?.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="mr-1">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </Col>
              <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
              >
                <img
                  src={post.thumbnail || "/api/placeholder/200/150"}
                  alt={post.title}
                  style={{
                    width: "150px", // Adjust the width as needed
                    height: "auto", // Maintain aspect ratio
                    objectFit: "cover", // Cover the area without distortion
                  }}
                  className="img-fluid"
                />
              </Col>
            </Row>
            <EngagementInfo>
              <EngagementItem>
                <ThumbsUp size={14} /> {post.upvotes}
              </EngagementItem>
              <EngagementItem>
                <ThumbsDown size={14} /> {post.downvotes}
              </EngagementItem>
              <EngagementItem>
                <MessageCircle size={14} /> {post.comments}
              </EngagementItem>
              <Button variant="outline-primary" size="sm">
                <Mail size={14} /> Contact
              </Button>
            </EngagementInfo>
          </Card.Body>
        </PostCard>
      </Col>
    );
  };

  if (loading)
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  if (error)
    return (
      <Container>
        <ErrorMessage variant="danger">Error: {error}</ErrorMessage>
      </Container>
    );

  return (
    <PageWrapper>
      {carouselPosts.length > 0 && <HeroCarousel posts={carouselPosts} />}
      <Container>
        {remainingMostViewedPosts.length > 0 && (
          <>
            <SectionTitle>Most Viewed Posts</SectionTitle>
            <Row>{mostViewedPosts.map(renderPostCard)}</Row>
          </>
        )}

        {featuredPosts.length > 0 && (
          <>
            <SectionTitle>Featured Posts</SectionTitle>
            <Row>{featuredPosts.slice(0, 3).map(renderPostCard)}</Row>
          </>
        )}

        {postsByCategory.length > 0 && categories.length > 0 && (
          <>
            <SectionTitle>Posts in {categories[0].name}</SectionTitle>
            <Row>{postsByCategory.slice(0, 3).map(renderPostCard)}</Row>
          </>
        )}

        {postsByTag.length > 0 && tags.length > 0 && (
          <>
            <SectionTitle>Posts tagged with {tags[0].name}</SectionTitle>
            <Row>{postsByTag.slice(0, 3).map(renderPostCard)}</Row>
          </>
        )}
      </Container>
    </PageWrapper>
  );
};

export default HomePage;
