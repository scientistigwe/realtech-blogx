import React from "react";
import ModerationDashboard from "./../components/moderation/ModerationDashboard";
import ModeratorSidebar from "./../components/moderation/ModeratorSidebar";
import PendingContentPage from "../components/moderation/PendingContent";

const ModerationPage = () => {
  return (
    <div>
      <ModerationDashboard />
      <ModeratorSidebar />
      <PendingContentPage />
    </div>
  );
};

export default ModerationPage;
