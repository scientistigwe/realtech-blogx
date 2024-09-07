import React from "react";
import { Route } from "react-router-dom";
import Layout from "./../pages/Layouts";
import UserProfile from "../components/Profile/UserProfile";
import ProtectedRoute from "../components/common/ProtectedRoute"; // Ensure you have this import

const ProfilePage = () => {
  const crumbs = [
    { label: "Home", path: "/" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <Layout crumbs={crumbs}>
      <ProtectedRoute path="/profile">
        <UserProfile />
      </ProtectedRoute>
    </Layout>
  );
};

export default ProfilePage;
