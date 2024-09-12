// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import queryString from "query-string";
// import { useSearchPosts } from "../../hooks/usePosts";
// import PostCard from "../Posts/PostCard";
// import Pagination from "../common/Pagination";

// const SearchPosts = () => {
//   const location = useLocation();
//   const { q: searchQuery } = queryString.parse(location.search);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const {
//     posts,
//     error: fetchError,
//     loading: fetchLoading,
//   } = useSearchPosts(searchQuery, currentPage);

//   useEffect(() => {
//     if (fetchError) {
//       setError(fetchError.message || "Failed to fetch posts.");
//     } else {
//       setError("");
//       setTotalPages(posts.totalPages || 1);
//     }
//     setLoading(fetchLoading);
//   }, [fetchError, fetchLoading, posts]);

//   if (loading) {
//     return <div>Loading search results...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       {posts.length > 0 ? (
//         posts.map((post) => <PostCard key={post.id} post={post} />)
//       ) : (
//         <p>No results found.</p>
//       )}
//       {totalPages > 1 && (
//         <Pagination
//           totalPages={totalPages}
//           currentPage={currentPage}
//           onPageChange={(page) => setCurrentPage(page)}
//         />
//       )}
//     </div>
//   );
// };

// export default SearchPosts;
