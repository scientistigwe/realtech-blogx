// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import Layout from "./../pages/Layouts";
// import AnalyticsDashboard from "../components/analytics/AnalyticsDashboard";
// import UserActivity from "../components/analytics/UserActivity";
// import ProtectedRoute from "../components/common/ProtectedRoute"; // Import ProtectedRoute

// const AnalyticsDashboardPage = () => {
//   const crumbs = [
//     { label: "Home", path: "/" },
//     { label: "Analytics", path: "/analytics" },
//   ];

//   return (
//     <Layout crumbs={crumbs}>
//       <Routes>
//         {/* Protected Route for Analytics Dashboard */}
//         <ProtectedRoute
//           path="/analytics/dashboard"
//           component={AnalyticsDashboard}
//         />
//         <ProtectedRoute
//           path="/analytics/user-activity"
//           component={UserActivity}
//         />

//         {/* Catch-All Route for Analytics */}
//         <Route
//           path="/analytics"
//           render={() => <div>Please select a valid analytics route</div>}
//         />
//       </Routes>
//     </Layout>
//   );
// };

// export default AnalyticsDashboardPage;
