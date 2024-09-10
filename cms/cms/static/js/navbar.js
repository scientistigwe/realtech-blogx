import { apiEndpoints } from "./apiEndpoints.js"; // Adjust the path as needed

document.addEventListener("DOMContentLoaded", async () => {
  // Dropdown Menu Toggle
  document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const menu = toggle.nextElementSibling;
      menu.classList.toggle("show");
    });
  });

  // Hide dropdown when clicking outside
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown-toggle")) {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.classList.remove("show");
      });
    }
  });

  // Real-time Search Suggestions
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  if (searchInput) {
    searchInput.addEventListener("input", async () => {
      const query = searchInput.value;

      if (query.length > 2) {
        try {
          const response = await fetch(
            `${apiEndpoints.posts.search}?q=${query}`
          );
          const results = await response.json();

          searchResults.innerHTML = results
            .map(
              (post) => `<li><a href="/post/${post.id}">${post.title}</a></li>`
            )
            .join("");
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        searchResults.innerHTML = "";
      }
    });
  }

  // Fetch Navbar Data (Categories and Tags)
  try {
    const [categoriesResponse, tagsResponse] = await Promise.all([
      fetch(apiEndpoints.categories.list),
      fetch(apiEndpoints.tags.list),
    ]);

    const categoriesData = await categoriesResponse.json();
    const tagsData = await tagsResponse.json();

    // Populate navbar with fetched categories and tags
    populateCategories(categoriesData);
    populateTags(tagsData);
  } catch (error) {
    console.error("Error fetching navbar data:", error);
  }
});

// Function to populate categories in the navbar
function populateCategories(categoriesData) {
  const categoryMenu = document.getElementById("category-menu");

  if (Array.isArray(categoriesData.results)) {
    categoryMenu.innerHTML = categoriesData.results
      .map(
        (category) => `
          <div class="relative group">
            <button class="hover:text-blue-300 transition duration-300">
              ${category.name}
            </button>
            <div class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
              <div class="py-1">
                ${
                  category.subcategories
                    ? category.subcategories
                        .map(
                          (sub) => `
                        <a href="/categories/${sub.id}/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          ${sub.name}
                        </a>`
                        )
                        .join("")
                    : ""
                }
                ${
                  category.subcategories && category.subcategories.length > 10
                    ? `<a href="/categories/${category.id}/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        More...
                      </a>`
                    : ""
                }
              </div>
            </div>
          </div>`
      )
      .join("");
  } else {
    console.error("Categories data is not an array:", categoriesData);
  }
}

// Function to populate tags in the navbar
function populateTags(tagsData) {
  const tagMenu = document.querySelector("#tag-menu .group-hover\\:block");

  if (Array.isArray(tagsData.results)) {
    tagMenu.innerHTML =
      tagsData.results
        .map(
          (tag) => `
          <a href="/tags/${tag.id}/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            ${tag.name}
          </a>`
        )
        .join("") +
      `
        <a href="/tags/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          More...
        </a>`;
  } else {
    console.error("Tags data is not an array:", tagsData);
  }
}
