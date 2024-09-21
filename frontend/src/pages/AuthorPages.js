// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import Layout from "./../pages/Layouts";
// import AuthorList from "../components/Authors/AuthorList";
// import AuthorDetail from "../components/Authors/AuthorDetail";
// import ContactAuthor from "../components/Authors/ContactAuthor";

// const AuthorPages = () => {
//   const crumbs = [
//     { label: "Home", path: "/" },
//     { label: "Authors", path: "/authors" },
//   ];

//   return (
//     <Layout crumbs={crumbs}>
//       <Routes>
//         {/* Route for AuthorList */}
//         <Route path="/authors" exact>
//           <AuthorList />
//         </Route>

//         {/* Routes for AuthorDetail and ContactAuthor */}
//         <Route path="/authors/detail/:id">
//           <AuthorDetail />
//         </Route>
//         <Route path="/authors/contact/:id">
//           <ContactAuthor />
//         </Route>
//       </Routes>
//     </Layout>
//   );
// };

// export default AuthorPages;
