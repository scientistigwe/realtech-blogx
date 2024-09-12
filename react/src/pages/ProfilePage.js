// src/pages/UserProfilePage.js
import React, { useEffect, useState } from "react";
import { usersService } from "../services/usersService";
import { postService } from "../services/postsService"; // Import the post service
import UserProfile from "../components/profile/UserProfile";
import UserPosts from "../components/posts/UserPosts";
import PostAnalytics from "../components/analytics/PostAnalytics";
import "../styles/ProfilePage.css";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsError, setAnalyticsError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfile = await usersService.getCurrentUserProfile();
        setUser(userProfile);

        // Fetch post analytics for this user
        const analytics = await postService.fetchPostAnalytics(userProfile.id);
        setAnalyticsData(analytics);
      } catch (err) {
        console.error("Error fetching data:", err);
        setAnalyticsError("Failed to load analytics.");
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="user-profile-page">
      <div className="upper-section">
        <div className="profile-side">
          {user && <UserProfile user={user} />}
        </div>
        <div className="posts-side">
          <h2>User Posts</h2>
          {user && <UserPosts userId={user.id} />}
        </div>
      </div>
      <div className="lower-section">
        <h2>Post Analytics</h2>
        {analyticsError ? (
          <p>{analyticsError}</p>
        ) : (
          <PostAnalytics analyticsData={analyticsData} />
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
