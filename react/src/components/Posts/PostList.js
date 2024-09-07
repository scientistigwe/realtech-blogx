import React from "react";
import { Spinner, Alert, ListGroup } from "react-bootstrap";
import { usePostsList } from "../../hooks/usePosts";

const PostList = () => {
  const { posts, error } = usePostsList();

  if (error) return <Alert variant="danger">Error fetching posts</Alert>;

  return (
    <div className="post-list">
      <h3>Posts</h3>
      {posts.length > 0 ? (
        <ListGroup>
          {posts.map((post) => (
            <ListGroup.Item key={post.id}>
              <a href={`/posts/${post.id}`}>{post.title}</a>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default PostList;
