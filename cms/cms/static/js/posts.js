// postDetails.js
document.addEventListener("DOMContentLoaded", () => {
  const postId = document.body.dataset.postId;
  if (postId) {
    initializePostDetails(postId);
  }
});

function initializePostDetails(postId) {
  fetchPostDetails(postId);
  fetchComments(postId);
  setupEngagementListeners(postId);
  setupCommentForm(postId);
}

async function fetchPostDetails(postId) {
  try {
    const post = await api.posts.get(postId);
    updatePostUI(post);
    api.posts.view(postId);
  } catch (error) {
    utils.displayError("Error fetching post details: " + error.message);
  }
}

function updatePostUI(post) {
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
}

async function fetchComments(postId) {
  try {
    const comments = await api.comments.list(postId);
    updateCommentsUI(comments);
  } catch (error) {
    utils.displayError("Error fetching comments: " + error.message);
  }
}

function updateCommentsUI(comments) {
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
}

function setupEngagementListeners(postId) {
  document
    .getElementById("upvote-btn")
    .addEventListener("click", () => engagePost(postId, "upvote"));
  document
    .getElementById("downvote-btn")
    .addEventListener("click", () => engagePost(postId, "downvote"));
}

async function engagePost(postId, type) {
  try {
    await api.posts.engage(postId, type);
    fetchPostDetails(postId);
  } catch (error) {
    utils.displayError(`Error ${type}ing post: ${error.message}`);
  }
}

function setupCommentForm(postId) {
  document
    .getElementById("comment-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const content = document.getElementById("comment-content").value;
      try {
        await api.comments.create({ post: postId, content });
        fetchComments(postId);
        document.getElementById("comment-content").value = "";
      } catch (error) {
        utils.displayError("Error submitting comment: " + error.message);
      }
    });
}

// search.js
document
  .getElementById("search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = document.getElementById("search-query").value.trim();
    if (query) {
      try {
        const results = await api.posts.search(query);
        displaySearchResults(results);
      } catch (error) {
        utils.displayError("Error searching posts: " + error.message);
      }
    }
  });

function displaySearchResults(results) {
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
      paginationContainer.innerHTML = generatePaginationButtons(
        results.totalPages
      );
      setupPaginationListeners();
    } else {
      paginationContainer.innerHTML = "";
    }
  } else {
    resultsContainer.innerHTML = "<p>No results found.</p>";
    paginationContainer.innerHTML = "";
  }
}

function generatePaginationButtons(totalPages) {
  return Array.from(
    { length: totalPages },
    (_, i) => `
      <button class="btn btn-secondary pagination-btn" data-page="${i + 1}">${
      i + 1
    }</button>
    `
  ).join("");
}

function setupPaginationListeners() {
  document.querySelectorAll(".pagination-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const page = button.getAttribute("data-page");
      const query = document.getElementById("search-query").value.trim();
      try {
        const results = await api.posts.search(query, page);
        displaySearchResults(results);
      } catch (error) {
        utils.displayError("Error fetching paginated posts: " + error.message);
      }
    });
  });
}

// createPost.js
document
  .getElementById("create-post-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      await api.posts.create(formData);
      utils.displaySuccess("Post created successfully!");
    } catch (error) {
      utils.displayError("Error creating post: " + error.message);
    }
  });

document
  .getElementById("coreCategory")
  .addEventListener("change", async (event) => {
    const coreCategoryId = event.target.value;
    const subcategorySelect = document.getElementById("subcategory");

    if (coreCategoryId) {
      try {
        const subcategories = await api.categories.getSubcategories(
          coreCategoryId
        );
        updateSubcategoryOptions(subcategories);
      } catch (error) {
        utils.displayError("Error fetching subcategories: " + error.message);
      }
    } else {
      resetSubcategoryOptions();
    }
  });

function updateSubcategoryOptions(subcategories) {
  const subcategorySelect = document.getElementById("subcategory");
  subcategorySelect.innerHTML =
    '<option value="">Select a subcategory</option>' +
    subcategories
      .map((subcat) => `<option value="${subcat.id}">${subcat.name}</option>`)
      .join("");
  subcategorySelect.disabled = false;
}

function resetSubcategoryOptions() {
  const subcategorySelect = document.getElementById("subcategory");
  subcategorySelect.innerHTML =
    '<option value="">Select a subcategory</option>';
  subcategorySelect.disabled = true;
}

// updatePost.js
document
  .getElementById("update-post-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const postId = document.body.dataset.postId;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    try {
      await api.posts.update(postId, { title, content });
      utils.displaySuccess("Post updated successfully!");
    } catch (error) {
      utils.displayError("Error updating post: " + error.message);
    }
  });

// Initialize everything when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const postId = document.body.dataset.postId;
  if (postId) {
    initializePostDetails(postId);
  }
});
