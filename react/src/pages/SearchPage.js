import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./../pages/Layouts";
import SearchBar from "../components/Search/searchBar";
import SearchPosts from "../components/Search/SearchPosts";

const SearchPage = () => {
  const crumbs = [
    { label: "Home", path: "/" },
    { label: "Search", path: "/search" },
  ];

  return (
    <Layout crumbs={crumbs}>
      <Routes>
        <Route path="/" element={<SearchBar />} />
        <Route path="/results" element={<SearchPosts />} />
      </Routes>
    </Layout>
  );
};

export default SearchPage;
