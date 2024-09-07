import React, { useEffect, useState } from "react";
import { Spinner, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useReadNotification } from "./../../hooks/useNotification"; // Correct the import path if necessary

const NotificationDetail = () => {
  const { id } = useParams();
  const { data: notification, error, loading } = useReadNotification(id);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-4">
        <Alert variant="danger">
          {error.message || "Failed to fetch notification."}
        </Alert>
      </div>
    );
  }

  return (
    <div className="notification-detail">
      {notification ? (
        <>
          <h3>{notification.message}</h3>
          <p>{notification.details}</p>
        </>
      ) : (
        <p>No notification found.</p>
      )}
    </div>
  );
};

export default NotificationDetail;
