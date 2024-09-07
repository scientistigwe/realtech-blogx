import React, { useMemo } from "react";
import PropTypes from "prop-types";
import "./../../styles/Layout.css";
import "./../../styles/Pages.css";
import "./../../styles/Global.css";
import "./../../styles/Components.css";

// Utility function to get unique archive dates in YYYY-MM format
const getUniqueArchives = (posts) => {
  if (!Array.isArray(posts)) return [];
  const archives = posts.map((post) => {
    const date = new Date(post.date);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  return [...new Set(archives)].sort((a, b) => b.localeCompare(a));
};

// Footer Component
const Footer = ({ posts = [] }) => {
  // Memoize archives to prevent recalculating unless posts change
  const archives = useMemo(() => getUniqueArchives(posts), [posts]);

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
            <li>
              <a href="/about" aria-label="About Us">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" aria-label="Contact">
                Contact
              </a>
            </li>
            <li>
              <a href="/privacy-policy" aria-label="Privacy Policy">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Archives Section */}
        <div className="footer-section archives">
          <h5>Archives</h5>
          <ul className="footer-links">
            {archives.length > 0 ? (
              archives.map((archive) => (
                <li key={archive}>
                  <a
                    href={`/archives/${archive}`}
                    aria-label={`Archive ${archive}`}
                  >
                    {archive.replace("-", " ")}
                  </a>
                </li>
              ))
            ) : (
              <li>No archives available</li>
            )}
          </ul>
        </div>

        {/* Social Media Links Section */}
        <div className="footer-section social">
          <h5>Follow Us</h5>
          <ul className="footer-links d-flex">
            <li>
              <a
                href="https://twitter.com/YourTwitterHandle"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter profile"
              >
                <i className="fab fa-twitter"></i> Twitter
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com/YourFacebookPage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook profile"
              >
                <i className="fab fa-facebook-f"></i> Facebook
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/company/YourLinkedInProfile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
              >
                <i className="fab fa-linkedin-in"></i> LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/YourInstagramHandle"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram profile"
              >
                <i className="fab fa-instagram"></i> Instagram
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
        <a href="#top" className="back-to-top" aria-label="Back to top">
          Back to top
        </a>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
    })
  ),
};

export default Footer;
