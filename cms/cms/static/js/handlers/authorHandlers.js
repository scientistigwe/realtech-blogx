// Import API endpoints and utility functions
import { api } from "./../apiUtils.js";
import { apiEndpoints } from "./../apiEndpoints.js";

// Utility function to get CSRF token
const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

// Handlers for author-related actions
const authorHandlers = {
  fetchAuthorDetails: async (authorId) => {
    try {
      const response = await api.get(apiEndpoints.users.read(authorId));
      const author = response.data;
      document.getElementById("author-name").textContent = author.username;
      document.getElementById("author-bio").textContent =
        author.bio || "No bio available";
      document.getElementById("author-website").textContent =
        author.website || "N/A";
      document.getElementById("author-website").href = author.website || "#";
      document.getElementById("author-location").textContent =
        author.location || "N/A";
      document.getElementById("author-joined").textContent = new Date(
        author.date_joined
      ).toLocaleDateString();

      if (document.getElementById("edit-profile-form")) {
        document.getElementById("bio").value = author.bio || "";
        document.getElementById("website").value = author.website || "";
        document.getElementById("location").value = author.location || "";
      }
    } catch (error) {
      console.error("Error fetching author details:", error);
    }
  },

  fetchAuthorPosts: async (authorId, currentPage, postsPerPage) => {
    try {
      const response = await api.get(
        `${apiEndpoints.posts.list}?author=${authorId}&page=${currentPage}&page_size=${postsPerPage}`
      );
      const data = response.data;
      const postsContainer = document.getElementById("author-posts");
      postsContainer.innerHTML = ""; // Clear previous posts
      data.results.forEach((post) => {
        postsContainer.innerHTML += `
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold mb-2">${post.title}</h3>
            <p class="text-gray-600 mb-4">${post.excerpt}</p>
            <a href="/post/${post.id}" class="text-blue-500 hover:underline">Read more</a>
          </div>
        `;
      });
      return !data.next;
    } catch (error) {
      console.error("Error fetching author posts:", error);
    }
  },

  updateAuthorProfile: async (authorId, bio, website, location) => {
    try {
      await api.patch(
        apiEndpoints.users.update(authorId),
        { bio, website, location },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
        }
      );
      await authorHandlers.fetchAuthorDetails(authorId);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  },

  contactUser: async (userId, message) => {
    try {
      await api.post(
        apiEndpoints.users.contact(userId),
        { message },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
        }
      );
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error contacting user:", error);
    }
  },

  updateUser: async (userId, username, email) => {
    try {
      await api.patch(
        apiEndpoints.users.update(userId),
        { username, email },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
        }
      );
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },
};

// User-related API functions
export const listUsers = async () => {
  try {
    const response = await api.get(apiEndpoints.users.list);
    return response.data;
  } catch (error) {
    console.error("Error listing users:", error);
    throw error;
  }
};

export const createUser = async (data) => {
  try {
    const response = await api.post(apiEndpoints.users.create, data);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getCurrentUserProfile = async () => {
  try {
    const response = await api.get(apiEndpoints.users.me);
    return response.data;
  } catch (error) {
    console.error("Error getting current user profile:", error);
    throw error;
  }
};

export const readUser = async (id) => {
  try {
    const response = await api.get(apiEndpoints.users.read(id));
    return response.data;
  } catch (error) {
    console.error(`Error reading user with ID ${id}:`, error);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await api.put(apiEndpoints.users.update(id), data);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

export const partialUpdateUser = async (id, data) => {
  try {
    const response = await api.patch(
      apiEndpoints.users.partialUpdate(id),
      data
    );
    return response.data;
  } catch (error) {
    console.error(`Error partially updating user with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(apiEndpoints.users.delete(id));
    return id;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

export const contactUser = async (id, data) => {
  try {
    const response = await api.post(apiEndpoints.users.contact(id), data);
    return response.data;
  } catch (error) {
    console.error(`Error contacting user with ID ${id}:`, error);
    throw error;
  }
};

export default authorHandlers;
