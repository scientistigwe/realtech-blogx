import { api } from "./../apiUtils.js";
import { apiEndpoints } from "./../apiEndpoints.js";

const postsHandlers = {
  initializePostDetails: async (postId) => {
    await postsHandlers.fetchPostDetails(postId);
    await postsHandlers.fetchComments(postId);
    postsHandlers.setupEngagementListeners(postId);
    postsHandlers.setupCommentForm(postId);
  },

  fetchPostDetails: async (postId) => {
    try {
      const post = await api.get(apiEndpoints.posts.read(postId));
      postsHandlers.updatePostUI(post.data);
      await api.get(apiEndpoints.posts.view(postId)); // Update view count
    } catch (error) {
      utils.displayError("Error fetching post details: " + error.message);
    }
  },

  updatePostUI: (post) => {
    document.getElementById("post-title").textContent = post.title;
    document.getElementById(
      "post-author"
    ).textContent = `By ${post.author.username}`;
    document.getElementById("post-date").textContent = new Date(
      post.created_at
    ).toLocaleDateString();
    document.getElementById("post-content").innerHTML = post.content;
    document.getElementById("upvote-count").textContent = post.upvotes;
    document.getElementById("downvote-count").textContent = post.downvotes;
    document.getElementById("view-count").textContent = post.view_count;
  },

  setupEngagementListeners: (postId) => {
    document
      .getElementById("upvote-btn")
      .addEventListener("click", () =>
        postsHandlers.engagePost(postId, "upvote")
      );
    document
      .getElementById("downvote-btn")
      .addEventListener("click", () =>
        postsHandlers.engagePost(postId, "downvote")
      );
  },

  engagePost: async (postId, type) => {
    try {
      await api.get(apiEndpoints.posts.engage(postId, type));
      await postsHandlers.fetchPostDetails(postId); // Refresh post details
    } catch (error) {
      utils.displayError(`Error ${type}ing post: ${error.message}`);
    }
  },

  setupCommentForm: (postId) => {
    document
      .getElementById("comment-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const content = document.getElementById("comment-content").value;
        try {
          await api.get(apiEndpoints.comments.create(postId, content));
          await postsHandlers.fetchComments(postId); // Refresh comments
          document.getElementById("comment-content").value = "";
        } catch (error) {
          utils.displayError("Error submitting comment: " + error.message);
        }
      });
  },

  fetchComments: async (postId) => {
    try {
      const comments = await api.get(apiEndpoints.comments.list(postId));
      postsHandlers.updateCommentsUI(comments.data);
    } catch (error) {
      utils.displayError("Error fetching comments: " + error.message);
    }
  },

  updateCommentsUI: (comments) => {
    const commentsContainer = document.getElementById("comments-container");
    commentsContainer.innerHTML = comments
      .map(
        (comment) => `
        <div class="bg-gray-100 p-4 rounded">
          <p class="mb-2">${comment.content}</p>
          <div class="text-sm text-gray-600">
            By ${comment.author.username} on ${new Date(
          comment.created_at
        ).toLocaleString()}
          </div>
        </div>
      `
      )
      .join("");
  },

  handleSearch: async (event) => {
    event.preventDefault();
    const query = document.getElementById("search-query").value.trim();
    if (query) {
      try {
        const results = await api.get(apiEndpoints.posts.search(query));
        postsHandlers.displaySearchResults(results.data);
      } catch (error) {
        utils.displayError("Error searching posts: " + error.message);
      }
    }
  },

  displaySearchResults: (results) => {
    const resultsContainer = document.getElementById("search-results");
    const paginationContainer = document.getElementById("pagination");

    if (results.posts.length > 0) {
      resultsContainer.innerHTML = results.posts
        .map(
          (post) => `
          <div class="post-card">
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <a href="/posts/${post.id}" class="btn btn-info">Read More</a>
          </div>
        `
        )
        .join("");

      if (results.totalPages > 1) {
        paginationContainer.innerHTML = postsHandlers.generatePaginationButtons(
          results.totalPages
        );
        postsHandlers.setupPaginationListeners();
      } else {
        paginationContainer.innerHTML = "";
      }
    } else {
      resultsContainer.innerHTML = "<p>No results found.</p>";
      paginationContainer.innerHTML = "";
    }
  },

  generatePaginationButtons: (totalPages) => {
    return Array.from(
      { length: totalPages },
      (_, i) => `
      <button class="btn btn-secondary pagination-btn" data-page="${i + 1}">${
        i + 1
      }</button>
    `
    ).join("");
  },

  setupPaginationListeners: () => {
    document.querySelectorAll(".pagination-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const page = button.getAttribute("data-page");
        const query = document.getElementById("search-query").value.trim();
        try {
          const results = await api.get(apiEndpoints.posts.search(query, page));
          postsHandlers.displaySearchResults(results.data);
        } catch (error) {
          utils.displayError(
            "Error fetching paginated posts: " + error.message
          );
        }
      });
    });
  },

  handleCreatePost: async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      await api.get(apiEndpoints.posts.create(formData));
      utils.displaySuccess("Post created successfully!");
    } catch (error) {
      utils.displayError("Error creating post: " + error.message);
    }
  },

  handleCoreCategoryChange: async (event) => {
    const coreCategoryId = event.target.value;
    const subcategorySelect = document.getElementById("subcategory");

    if (coreCategoryId) {
      try {
        const subcategories = await api.get(
          apiEndpoints.categories.getSubcategories(coreCategoryId)
        );
        postsHandlers.updateSubcategoryOptions(subcategories.data);
      } catch (error) {
        utils.displayError("Error fetching subcategories: " + error.message);
      }
    } else {
      postsHandlers.resetSubcategoryOptions();
    }
  },

  updateSubcategoryOptions: (subcategories) => {
    const subcategorySelect = document.getElementById("subcategory");
    subcategorySelect.innerHTML =
      '<option value="">Select a subcategory</option>' +
      subcategories
        .map((subcat) => `<option value="${subcat.id}">${subcat.name}</option>`)
        .join("");
    subcategorySelect.disabled = false;
  },

  resetSubcategoryOptions: () => {
    const subcategorySelect = document.getElementById("subcategory");
    subcategorySelect.innerHTML =
      '<option value="">Select a subcategory</option>';
    subcategorySelect.disabled = true;
  },

  handleUpdatePost: async (event) => {
    event.preventDefault();
    const postId = document.body.dataset.postId;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    try {
      await api.get(apiEndpoints.posts.update(postId, { title, content }));
      utils.displaySuccess("Post updated successfully!");
    } catch (error) {
      utils.displayError("Error updating post: " + error.message);
    }
  },

  handleDeletePost: async () => {
    const postId = document.body.dataset.postId;
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await api.get(apiEndpoints.posts.delete(postId));
        window.location.href = "/posts";
      } catch (error) {
        utils.displayError("Error deleting post: " + error.message);
      }
    }
  },
};

// Export default postHandlers
export default postsHandlers;

// Named exports for individual functions
export const fetchPosts = async () => {
  try {
    const response = await api.get(apiEndpoints.posts.list);
    return response.data; // Adjust based on actual response structure
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const createPost = async (data) => {
  try {
    const response = await api.get(apiEndpoints.posts.create, data);
    return response.data; // Adjust based on actual response structure
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const fetchPostsByCategory = async (category) => {
  try {
    const response = await api.get(
      `${apiEndpoints.posts.byCategory}?category=${category}`
    );
    return response.data; // Adjust based on actual response structure
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    throw error;
  }
};

export const fetchPostById = async (postId) => {
  try {
    const response = await api.get(apiEndpoints.posts.read(postId));
    return response.data; // Adjust based on actual response structure
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
};

export const updatePost = async (postId, data) => {
  try {
    const response = await api.get(apiEndpoints.posts.update(postId, data));
    return response.data; // Adjust based on actual response structure
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    await api.get(apiEndpoints.posts.delete(postId));
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
