// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import Layout from "./../pages/Layouts";
// import NotificationList from "../components/Notifications/NotificationList";
// import NotificationDetail from "../components/Notifications/NotificationDetail";
// import ProtectedRoute from "../components/common/ProtectedRoute"; // Ensure you have this import

// const NotificationPage = () => {
//   const crumbs = [
//     { label: "Home", path: "/" },
//     { label: "Notifications", path: "/notifications" },
//   ];

//   return (
//     <Layout crumbs={crumbs}>
//       <Routes>
//         {/* Protected Route for NotificationList */}
//         <ProtectedRoute path="/notifications" exact>
//           <NotificationList />
//         </ProtectedRoute>

//         {/* Protected Route for NotificationDetail */}
//         <ProtectedRoute path="/notifications/detail/:id">
//           <NotificationDetail />
//         </ProtectedRoute>
//       </Routes>
//     </Layout>
//   );
// };

// export default NotificationPage;
