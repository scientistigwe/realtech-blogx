import { apiEndpoints } from "./apiEndpoints.js";
import { api } from "./apiUtils.js";
// Import any other necessary modules

document.addEventListener("DOMContentLoaded", () => {
  initializeSwiper();

  fetchMostViewedPosts();
  fetchLatestPosts();
  fetchFeaturedPosts();
  fetchCategories();
  fetchTags();

  const loadMoreButton = document.getElementById("load-more");
  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", async () => {
      currentPage++;
      await fetchLatestPosts();
    });
  }
});

let currentPage = 1;
const postsPerPage = 10;

async function fetchMostViewedPosts() {
  try {
    const response = await api.get(apiEndpoints.posts.mostViewed);
    const posts = Array.isArray(response.results)
      ? response.results
      : response.posts;
    const postsContainer = document.getElementById("most-viewed-posts");
    if (!postsContainer)
      throw new Error("Element with ID 'most-viewed-posts' not found.");

    if (Array.isArray(posts)) {
      postsContainer.innerHTML = ""; // Clear existing content
      posts.forEach((post) => {
        postsContainer.innerHTML += `
          <div class="swiper-slide bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-2">${post.title}</h3>
            <p class="text-gray-600 mb-4">${post.excerpt}</p>
            <a href="${apiEndpoints.posts.read(
              post.id
            )}" class="text-blue-500 hover:underline">Read more</a>
          </div>
        `;
      });
      // Update Swiper after adding new slides
      if (window.swiperInstance) {
        window.swiperInstance.update();
      }
    } else {
      console.error("Fetched data is not an array:", posts);
    }
  } catch (error) {
    console.error("Error fetching most viewed posts:", error);
  }
}

async function fetchLatestPosts() {
  try {
    const response = await api.get(
      apiEndpoints.posts.list + `?page=${currentPage}&page_size=${postsPerPage}`
    );
    const posts = Array.isArray(response.results)
      ? response.results
      : response.posts;
    const postsContainer = document.getElementById("latest-posts");
    if (!postsContainer)
      throw new Error("Element with ID 'latest-posts' not found.");

    if (Array.isArray(posts)) {
      posts.forEach((post) => {
        postsContainer.innerHTML += `
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-2">${post.title}</h3>
            <p class="text-gray-600 mb-4">${post.excerpt}</p>
            <a href="${apiEndpoints.posts.read(
              post.id
            )}" class="text-blue-500 hover:underline">Read more</a>
          </div>
        `;
      });
    } else {
      console.error("Fetched data is not an array:", posts);
    }
  } catch (error) {
    console.error("Error fetching latest posts:", error);
  }
}

async function fetchFeaturedPosts() {
  try {
    const response = await api.get(apiEndpoints.posts.featured);
    const posts = Array.isArray(response.results)
      ? response.results
      : response.posts;
    const postsContainer = document.getElementById("featured-posts");
    if (!postsContainer)
      throw new Error("Element with ID 'featured-posts' not found.");

    if (Array.isArray(posts)) {
      posts.forEach((post) => {
        postsContainer.innerHTML += `
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-2">${post.title}</h3>
            <p class="text-gray-600 mb-4">${post.excerpt}</p>
            <a href="${apiEndpoints.posts.read(
              post.id
            )}" class="text-blue-500 hover:underline">Read more</a>
          </div>
        `;
      });
    } else {
      console.error("Fetched data is not an array:", posts);
    }
  } catch (error) {
    console.error("Error fetching featured posts:", error);
  }
}

async function fetchCategories() {
  try {
    const response = await api.get(apiEndpoints.categories.list);
    const categories = Array.isArray(response.results)
      ? response.results
      : response.categories;
    const categoriesContainer = document.getElementById("categories-list");
    if (!categoriesContainer)
      throw new Error("Element with ID 'categories-list' not found.");

    if (Array.isArray(categories)) {
      categories.forEach((category) => {
        categoriesContainer.innerHTML += `
          <a href="${apiEndpoints.posts.byCategory}?category=${category.id}" class="block text-blue-500 hover:underline">${category.name}</a>
        `;
      });
    } else {
      console.error("Fetched data is not an array:", categories);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

async function fetchTags() {
  try {
    const response = await api.get(apiEndpoints.tags.list);
    const tags = Array.isArray(response.results)
      ? response.results
      : response.tags;
    const tagsContainer = document.getElementById("tags-list");
    if (!tagsContainer)
      throw new Error("Element with ID 'tags-list' not found.");

    if (Array.isArray(tags)) {
      tags.forEach((tag) => {
        tagsContainer.innerHTML += `
          <a href="${apiEndpoints.posts.byTag}?tag=${tag.id}" class="bg-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-300">${tag.name}</a>
        `;
      });
    } else {
      console.error("Fetched data is not an array:", tags);
    }
  } catch (error) {
    console.error("Error fetching tags:", error);
  }
}

function initializeSwiper() {
  if (!window.swiperInstance) {
    window.swiperInstance = new Swiper(".swiper-container", {
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      autoplay: {
        delay: 5000,
      },
      loop: true,
    });
  }
}
