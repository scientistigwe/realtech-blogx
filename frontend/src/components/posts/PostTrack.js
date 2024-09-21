import React from "react";
import { useParams } from "react-router-dom";
import { trackPostView } from "../../hooks/usePosts";

const PostTrack = () => {
  const { id } = useParams();
  trackPostView(id);

  return null; // This component does not render anything
};

export default PostTrack;
