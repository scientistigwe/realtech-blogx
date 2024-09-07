import React from "react";
import { Spinner, Alert } from "react-bootstrap";
import { usePostEngagements } from "../../hooks/usePosts";

const PostEngagements = ({ id }) => {
  const { engagements, error } = usePostEngagements(id);

  if (error) return <Alert variant="danger">Error fetching engagements</Alert>;

  return (
    <div className="post-engagements">
      {engagements ? (
        <>
          <h4>Engagements</h4>
          <p>Upvotes: {engagements.upvotes}</p>
          <p>Downvotes: {engagements.downvotes}</p>
          {/* Additional engagement details can be added here */}
        </>
      ) : (
        <Spinner animation="border" />
      )}
    </div>
  );
};

export default PostEngagements;
