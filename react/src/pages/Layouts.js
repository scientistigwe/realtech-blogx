import React from "react";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";
import Navbar from "../components/Layouts/Navbar";
import Breadcrumbs from "../components/common/Breadcrumbs"; // Adjust the path as necessary

const Layout = ({ children, crumbs }) => {
  return (
    <div>
      <Header />
      <Navbar />
      {crumbs && <Breadcrumbs crumbs={crumbs} />}
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
