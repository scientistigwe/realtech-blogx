document.addEventListener("DOMContentLoaded", () => {
  const authorId = window.location.pathname.split("/").pop();
  let currentPage = 1;
  const postsPerPage = 10;

  async function fetchAuthorDetails() {
    try {
      const author = await readUser(authorId);
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
  }

  async function fetchAuthorPosts() {
    try {
      const response = await api.get(
        `${BASE_URL}posts/?author=${authorId}&page=${currentPage}&page_size=${postsPerPage}`
      );
      const posts = response.data.results;
      const postsContainer = document.getElementById("author-posts");
      posts.forEach((post) => {
        postsContainer.innerHTML += `
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-bold mb-2">${post.title}</h3>
              <p class="text-gray-600 mb-4">${post.excerpt}</p>
              <a href="/post/${post.id}" class="text-blue-500 hover:underline">Read more</a>
            </div>
          `;
      });
      currentPage++;
      if (!response.data.next) {
        document.getElementById("load-more-posts").style.display = "none";
      }
    } catch (error) {
      console.error("Error fetching author posts:", error);
    }
  }

  async function updateAuthorProfile(bio, website, location) {
    try {
      await partialUpdateUser(authorId, { bio, website, location });
      fetchAuthorDetails();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  document
    .getElementById("load-more-posts")
    .addEventListener("click", fetchAuthorPosts);

  const editForm = document.getElementById("edit-profile-form");
  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const bio = document.getElementById("bio").value;
      const website = document.getElementById("website").value;
      const location = document.getElementById("location").value;
      updateAuthorProfile(bio, website, location);
    });
  }

  fetchAuthorDetails();
  fetchAuthorPosts();

  document
    .getElementById("contact-user-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const userId = document.getElementById("user-id").value;
      const message = document.getElementById("message").value;

      try {
        await contactUser(userId, { message });
        alert("Message sent successfully!");
      } catch (error) {
        console.error("Error contacting user:", error);
      }
    });
  document.getElementById("load-users").addEventListener("click", async () => {
    try {
      const response = await fetch(apiEndpoints.users.list);
      const users = await response.json();
      const userList = document.getElementById("user-list");
      userList.innerHTML = "";
      users.forEach((user) => {
        const li = document.createElement("li");
        li.textContent = `${user.username} (${user.email})`;
        userList.appendChild(li);
      });
    } catch (error) {
      console.error("Error loading users:", error);
    }
  });
  document
    .getElementById("update-user-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const userId = document.getElementById("user-id").value;
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;

      try {
        await api.updateUser(userId, { username, email });
        alert("User updated successfully!");
      } catch (error) {
        console.error("Error updating user:", error);
      }
    });
});
