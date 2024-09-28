import React from "react";
import { Card, Image } from "react-bootstrap";

const defaultAvatar = "/api/placeholder/150/150"; // Using a placeholder image

const UserProfileCard = ({ user }) => {
  if (!user) {
    return (
      <Card className="profile-card">
        <Card.Body>Loading user profile...</Card.Body>
      </Card>
    );
  }

  console.log(`User: ${JSON.stringify(user)}`);

  return (
    <Card className="profile-card">
      <Card.Body>
        <div className="profile-header">
          <Image
            src={user.profile_picture || defaultAvatar}
            className="profile-picture"
            alt="Profile"
            width={150}
            height={150}
          />
          <div className="profile-info">
            <h2>{user.username || "Unknown User"}</h2>
            <p>
              {user.first_name || ""} {user.last_name || ""}
            </p>
            <p>{user.email || "No email provided"}</p>
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
      </Card.Body>
    </Card>
  );
};

export default UserProfileCard;
