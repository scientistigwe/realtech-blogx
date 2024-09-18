// UserProfileCard.js
import React from "react";
import { Card, Image } from "react-bootstrap";

const defaultAvatar = "path/to/default-avatar.png";

const UserProfileCard = ({ user }) => {
  return (
    <Card className="profile-card">
      <div className="profile-header">
        <Image
          src={user.profile_picture || defaultAvatar}
          className="profile-picture"
          alt="Profile"
        />
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>
            {user.first_name} {user.last_name}
          </p>
          <p>{user.email}</p>
        </div>
      </div>
      <div className="profile-details">
        <p>
          <strong>Bio:</strong> {user.bio || "No bio available"}
        </p>
        <p>
          <strong>Website:</strong> {user.website || "Not provided"}
        </p>
        <p>
          <strong>Location:</strong> {user.location || "Not provided"}
        </p>
      </div>
    </Card>
  );
};

export default UserProfileCard;
