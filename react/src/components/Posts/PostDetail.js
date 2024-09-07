import React from "react";
import { Spinner, Alert, Button } from "react-bootstrap";
import {
  usePostById,
  useUpdatePost,
  useDeletePost,
  usePostEngagements,
} from "../../hooks/usePosts";

const PostDetail = ({ id }) => {
  const { post, error } = usePostById(id);
  const { response: updateResponse, error: updateError } = useUpdatePost(
    id,
    {}
  );
  const { deletePost, error: deleteError } = useDeletePost(); // Updated line
  const { engagements } = usePostEngagements(id);

  if (error) return <Alert variant="danger">Error fetching post</Alert>;

  const handleDelete = async () => {
    try {
      await deletePost(id); // Use deletePost from the hook
      // Handle successful deletion (e.g., redirect or update state)
    } catch (err) {
      // Handle error
      console.error("Error deleting post:", err);
    }
  };

  return (
    <div className="post-detail">
      {post ? (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <Button onClick={handleDelete}>Delete Post</Button>
          {/* Display post engagements, e.g., views, comments */}
        </>
      ) : (
        <Spinner animation="border" />
      )}
    </div>
  );
};

export default PostDetail;
