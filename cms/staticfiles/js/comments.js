// commentHandlers.js
const commentHandlers = {
  createComment: async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    try {
      await api.createComment(formData);
      utils.showMessage("Comment created successfully!");
      form.reset();
      await commentHandlers.fetchComments();
    } catch (error) {
      utils.handleError(error);
    }
  },

  fetchComments: async () => {
    try {
      const response = await api.listComments();
      const comments = await response.json();
      const commentsList = document.getElementById("comments-list");
      commentsList.innerHTML = comments
        .map(
          (comment) =>
            `<li>${comment.text} (Upvotes: ${comment.upvotes}, Downvotes: ${comment.downvotes})</li>`
        )
        .join("");
    } catch (error) {
      utils.handleError(error);
    }
  },

  moderateComment: async (event) => {
    event.preventDefault();
    const form = event.target;
    const id = form.querySelector('[name="id"]').value;
    try {
      await api.moderateComment(id);
      utils.showMessage("Comment moderated successfully!");
      form.reset();
      await commentHandlers.fetchComments();
    } catch (error) {
      utils.handleError(error);
    }
  },

  deleteComment: async (event) => {
    event.preventDefault();
    const form = event.target;
    const id = form.querySelector('[name="id"]').value;
    try {
      await api.deleteComment(id);
      utils.showMessage("Comment deleted successfully!");
      form.reset();
      await commentHandlers.fetchComments();
    } catch (error) {
      utils.handleError(error);
    }
  },

  updateComment: async (event) => {
    event.preventDefault();
    const form = event.target;
    const id = form.querySelector('[name="id"]').value;
    const formData = new FormData(form);
    try {
      await api.updateComment(id, formData);
      utils.showMessage("Comment updated successfully!");
      form.reset();
      await commentHandlers.fetchComments();
    } catch (error) {
      utils.handleError(error);
    }
  },

  voteComment: async (event, voteType) => {
    event.preventDefault();
    const form = event.target;
    const id = form.querySelector('[name="id"]').value;
    try {
      await api.voteComment(id, voteType);
      utils.showMessage(`Comment ${voteType}d successfully!`);
      form.reset();
      await commentHandlers.fetchComments();
    } catch (error) {
      utils.handleError(error);
    }
  },
};

// main.js
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("create-comment-form")
    .addEventListener("submit", commentHandlers.createComment);
  document
    .getElementById("moderate-comment-form")
    .addEventListener("submit", commentHandlers.moderateComment);
  document
    .getElementById("delete-comment-form")
    .addEventListener("submit", commentHandlers.deleteComment);
  document
    .getElementById("update-comment-form")
    .addEventListener("submit", commentHandlers.updateComment);
  document
    .getElementById("upvote-comment-form")
    .addEventListener("submit", (event) =>
      commentHandlers.voteComment(event, "upvote")
    );
  document
    .getElementById("downvote-comment-form")
    .addEventListener("submit", (event) =>
      commentHandlers.voteComment(event, "downvote")
    );

  // Initial fetch of comments
  commentHandlers.fetchComments();
});
