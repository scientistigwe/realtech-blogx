import { useState, useEffect, useCallback } from "react";
import api from "./../api/apiClient"; // Ensure this path is correct

// Post Hooks
export const usePostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await api.posts.fetchAll();
        setPosts(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return { posts, loading, error };
};

export const usePostDetails = (postId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      setLoading(true);
      try {
        const response = await api.posts.fetchById(postId);
        setPost(response.data);
      } catch (err) {
        setError(
          err.message || "Failed to fetch post details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetails();
  }, [postId]);

  return { post, loading, error };
};

export const useUpdatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePost = useCallback(async (postId, postData) => {
    setLoading(true);
    setError(null);
    try {
      await api.posts.update(postId, postData);
    } catch (err) {
      setError(err.message || "Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { updatePost, loading, error };
};

export const useCreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    metaDescription: "",
    metaTitle: "",
    metaKeywords: "",
    publicationDate: "",
    primaryCategory: "",
    subcategory: "",
    tags: "",
    isPublic: true,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (type === "file") {
      setImage(files[0]);
    }
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const { title, content, ...rest } = formData;
        const postResponse = await api.posts.create({
          title,
          content,
          ...rest,
        });
        const postId = postResponse.data.id;

        if (image) {
          const formDataImage = new FormData();
          formDataImage.append("thumbnail", image);

          await api.posts.uploadThumbnail(postId, formDataImage);
        }

        setSuccessMessage("Post created successfully!");
        // Clear form data
        setFormData({
          title: "",
          content: "",
          excerpt: "",
          metaDescription: "",
          metaTitle: "",
          metaKeywords: "",
          publicationDate: "",
          primaryCategory: "",
          subcategory: "",
          tags: "",
          isPublic: true,
        });
        setImage(null);
      } catch (err) {
        setError(err.message || "Failed to create post. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [formData, image]
  );

  return {
    formData,
    image,
    loading,
    error,
    successMessage,
    handleChange,
    handleSubmit,
  };
};
