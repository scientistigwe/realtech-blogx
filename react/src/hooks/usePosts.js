import { useState, useCallback } from "react";
import { postService } from "../services/postsService"; // Adjust the path as necessary

export const usePosts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executePostOperation = useCallback(async (operation, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation(...args);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const postOperations = {
    fetchPosts: useCallback(
      () => executePostOperation(postService.fetchPosts),
      [executePostOperation]
    ),
    createPost: useCallback(
      (data) => executePostOperation(postService.createPost, data),
      [executePostOperation]
    ),
    fetchPostsByCategory: useCallback(
      (category) =>
        executePostOperation(postService.fetchPostsByCategory, category),
      [executePostOperation]
    ),
    fetchPostsByTag: useCallback(
      (tag) => executePostOperation(postService.fetchPostsByTag, tag),
      [executePostOperation]
    ),
    checkPostSlug: useCallback(
      (slug) => executePostOperation(postService.checkPostSlug, slug),
      [executePostOperation]
    ),
    fetchFeaturedPosts: useCallback(
      () => executePostOperation(postService.fetchFeaturedPosts),
      [executePostOperation]
    ),
    fetchMostViewedPosts: useCallback(
      () => executePostOperation(postService.fetchMostViewedPosts),
      [executePostOperation]
    ),
    searchPosts: useCallback(
      (query) => executePostOperation(postService.searchPosts, query),
      [executePostOperation]
    ),
    fetchPostById: useCallback(
      (id) => executePostOperation(postService.fetchPostById, id),
      [executePostOperation]
    ),
    updatePost: useCallback(
      (id, data) => executePostOperation(postService.updatePost, id, data),
      [executePostOperation]
    ),
    partialUpdatePost: useCallback(
      (id, data) =>
        executePostOperation(postService.partialUpdatePost, id, data),
      [executePostOperation]
    ),
    deletePost: useCallback(
      (id) => executePostOperation(postService.deletePost, id),
      [executePostOperation]
    ),
    downvotePost: useCallback(
      (id) => executePostOperation(postService.downvotePost, id),
      [executePostOperation]
    ),
    engagePost: useCallback(
      (id) => executePostOperation(postService.engagePost, id),
      [executePostOperation]
    ),
    upvotePost: useCallback(
      (id) => executePostOperation(postService.upvotePost, id),
      [executePostOperation]
    ),
    trackPostView: useCallback(
      (id) => executePostOperation(postService.trackPostView, id),
      [executePostOperation]
    ),
    viewPost: useCallback(
      (id) => executePostOperation(postService.viewPost, id),
      [executePostOperation]
    ),
    fetchUserPosts: useCallback(
      (userId) =>
        executePostOperation(async () => {
          const allPosts = await postService.fetchPosts();
          return userId
            ? allPosts.filter((post) => post.user.id === userId)
            : [];
        }),
      [executePostOperation]
    ),
  };

  return {
    ...postOperations,
    loading,
    error,
  };
};
