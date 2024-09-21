import React from "react";
import PropTypes from "prop-types";
import "../../styles/Layout.css";
import "../../styles/Pages.css";
import "../../styles/Global.css";
import "../../styles/Components.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section about">
          <h5>About RealTech BlogX</h5>
          <p>
            RealTech BlogX is your gateway to Data, Development, and DevOps
            mastery. Our blog features insights, tutorials, and tips to help you
            excel in these fields.
          </p>
        </div>

        {/* Useful Links Section */}
        <div className="footer-section links">
          <h5>Useful Links</h5>
          <ul className="footer-links">
            <li>
              <a href="/" aria-label="Home">
                Home
              </a>
            </li>
            <li>
              <a href="/posts" aria-label="Posts">
                Posts
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p className="text-center">
          &copy; {new Date().getFullYear()} RealTech BlogX. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
