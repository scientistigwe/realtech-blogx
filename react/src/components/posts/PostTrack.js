// components/PostTrack.js
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { postService } from "../../services/postsService";
import "../../styles/Components.css";

const PostTrack = () => {
  const { id } = useParams();

  useEffect(() => {
    const trackView = async () => {
      try {
        await postService.trackPostView(id);
      } catch (err) {
        console.error("Error tracking post view:", err);
      }
    };

    trackView();
  }, [id]);

  return null; // This component does not render anything
};

export default PostTrack;
