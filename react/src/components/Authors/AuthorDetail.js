import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Alert, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuthor,
  fetchPosts,
  contactAuthor,
  resetContactState,
  setContactMessage,
} from "../../redux/slices/authorSlice";
import {
  selectAuthor,
  selectPosts,
  selectLoading,
  selectError,
  selectContactMessage,
  selectContactError,
  selectContactSuccess,
} from "../../redux/selectors/authorSelectors";

const AuthorDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Selectors to get state from Redux store
  const author = useSelector(selectAuthor);
  const posts = useSelector(selectPosts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const contactMessage = useSelector(selectContactMessage);
  const contactError = useSelector(selectContactError);
  const contactSuccess = useSelector(selectContactSuccess);

  useEffect(() => {
    dispatch(fetchAuthor(id));
    dispatch(fetchPosts(id));

    // Reset contact state on component mount
    dispatch(resetContactState());
  }, [dispatch, id]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    dispatch(contactAuthor({ id, message: contactMessage }));
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="author-detail-page container mt-4">
      {author ? (
        <>
          <h2>{author.name}</h2>
          <p>{author.bio}</p>
          <h3>Posts by {author.name}</h3>
          <ul>
            {posts.length > 0 ? (
              posts.map((post) => (
                <li key={post.id}>
                  <a href={`/posts/${post.id}`}>{post.title}</a>
                </li>
              ))
            ) : (
              <p>No posts found for this author.</p>
            )}
          </ul>
          <div className="mt-4">
            <h3>Contact the Author</h3>
            {contactSuccess && (
              <Alert variant="success">{contactSuccess}</Alert>
            )}
            {contactError && <Alert variant="danger">{contactError}</Alert>}
            <Form onSubmit={handleContactSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Your Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={contactMessage}
                  onChange={(e) => dispatch(setContactMessage(e.target.value))}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary">
                Send Message
              </Button>
            </Form>
          </div>
        </>
      ) : (
        <p className="text-center">No author found.</p>
      )}
    </div>
  );
};

export default AuthorDetail;
