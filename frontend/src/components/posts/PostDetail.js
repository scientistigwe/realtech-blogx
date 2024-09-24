import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Card,
  Button,
  Alert,
  Spinner,
  Form,
  ListGroup,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchPostById } from "../../redux/post/postThunks";
import {
  selectCurrentPost,
  selectPostsLoading,
  selectPostsError,
} from "../../redux/post/postSlice";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const post = useSelector(selectCurrentPost);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        await dispatch(fetchPostById(id)).unwrap();
        setIsLoaded(true);
        toast.success("Post loaded successfully!");
      } catch (error) {
        setIsLoaded(true);
        toast.error("Failed to load post. Please try again later.");
        console.error(error);
      }
    };

    fetchPost();
  }, [dispatch, id]);

  if (loading || !isLoaded) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error.message} />;
  }

  if (!post || Object.keys(post).length === 0) {
    return <Alert variant="info">Post not found</Alert>;
  }

  const filteredContent = post.content
    ?.split("\n")
    .filter((line) => line.toLowerCase().includes(searchTerm.toLowerCase()))
    .join("\n");

  return (
    <Container className="my-5">
      <ToastContainer />
      <Card>
        <Card.Header as="h2">{post.title}</Card.Header>
        <Card.Body>
          <SearchForm setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
          <PostContent content={filteredContent || post.content} />
          <hr />
          <AuthorInfo author={post.author} />
          <hr />
          <CategoriesAndTags category={post.category} tags={post.tags} />
          <hr />
          <PublicationDetails
            publicationDate={post.publication_date}
            editHistory={post.edit_history}
          />
          <hr />
          <RelatedPosts posts={post.related_posts} navigate={navigate} />
          <hr />
          <Comments comments={post.comments} />
          <hr />
          <ShareButtons />
          <hr />
          <BackButton navigate={navigate} />
        </Card.Body>
      </Card>
    </Container>
  );
};

const LoadingSpinner = () => (
  <Container
    className="d-flex justify-content-center align-items-center"
    style={{ height: "100vh" }}
  >
    <Spinner animation="border" />
  </Container>
);

const ErrorAlert = ({ message }) => (
  <Alert variant="danger">{message || "Error loading post"}</Alert>
);

const SearchForm = ({ setSearchTerm, searchTerm }) => (
  <Form.Group className="mb-3">
    <Form.Control
      type="text"
      placeholder="Search within post..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </Form.Group>
);

const PostContent = ({ content }) => <Card.Text>{content}</Card.Text>;

const AuthorInfo = ({ author }) => (
  <>
    <h4>Author Information</h4>
    <p>{author?.bio || "Author information not available"}</p>
    <p>Contact: {author?.email || "Email not available"}</p>
  </>
);

const CategoriesAndTags = ({ category, tags }) => (
  <>
    <h4>Categories and Tags</h4>
    <p>Category: {category?.name || "Uncategorized"}</p>
    <p>
      Tags: {tags?.map((tag) => tag.name).join(", ") || "No tags available"}
    </p>
  </>
);

const PublicationDetails = ({ publicationDate, editHistory }) => (
  <>
    <h4>Publication Details</h4>
    <p>Published on: {new Date(publicationDate).toLocaleString()}</p>
    {editHistory && editHistory.length > 0 && (
      <>
        <h5>Edit History</h5>
        <ListGroup>
          {editHistory.map((edit, index) => (
            <ListGroup.Item key={index}>
              Edited on: {new Date(edit.date).toLocaleString()}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </>
    )}
  </>
);

const RelatedPosts = ({ posts, navigate }) => (
  <>
    <h4>Related Posts</h4>
    <ListGroup>
      {posts?.length > 0 ? (
        posts.map((relatedPost) => (
          <ListGroup.Item
            key={relatedPost.id}
            action
            onClick={() => navigate(`/posts/${relatedPost.id}`)}
          >
            {relatedPost.title}
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item>No related posts available</ListGroup.Item>
      )}
    </ListGroup>
  </>
);

const Comments = ({ comments }) => (
  <>
    <h4>Comments</h4>
    {comments?.length > 0 ? (
      comments.map((comment) => (
        <Card key={comment.id} className="mb-3">
          <Card.Body>
            <Card.Text>{comment.content}</Card.Text>
            <Card.Footer>
              By {comment.author} on {new Date(comment.date).toLocaleString()}
            </Card.Footer>
          </Card.Body>
        </Card>
      ))
    ) : (
      <p>No comments available</p>
    )}
  </>
);

const ShareButtons = () => (
  <>
    <h4>Share this post</h4>
    <Button variant="primary" className="me-2">
      Share on Facebook
    </Button>
    <Button variant="info">Share on Twitter</Button>
  </>
);

const BackButton = ({ navigate }) => (
  <Button
    variant="primary"
    onClick={() => {
      navigate(-1);
      toast.info("Returning to previous page");
    }}
  >
    Back to List
  </Button>
);

// Add this function outside the component
const fetchPost = async (dispatch, id) => {
  try {
    await dispatch(fetchPostById(id)).unwrap();
    toast.success("Post loaded successfully!");
  } catch (error) {
    toast.error("Failed to load post. Please try again later.");
    console.error(error);
  }
};

export default PostDetail;
