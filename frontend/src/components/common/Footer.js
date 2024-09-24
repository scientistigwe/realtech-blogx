import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container width-wrap-content text-white">
        <div className="footer-section row">
          <h5>Follow us</h5>
          <div className="social-networks">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
        <div className="row">
          <div className="footer-section col-md-3">
            <h5>Company</h5>
            <ul>
              <li>
                <Link to="/about-us">About Us</Link>
              </li>
              <li>
                <Link to="/careers">Careers</Link>
              </li>
              <li>
                <Link to="/partners">Partners</Link>
              </li>
              <li>
                <Link to="/contact-us">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section col-md-3">
            <h5>Work with us</h5>
            <ul>
              <li>
                <Link to="/become-an-instructor">Become an Instructor</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/affiliate-program">Affiliate Program</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section col-md-3">
            <h5>Discover</h5>
            <ul>
              <li>
                <Link to="/free-courses">Free Courses</Link>
              </li>
              <li>
                <Link to="/download-app">Download App</Link>
              </li>
              <li>
                <Link to="/site-map">Site Map</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section col-md-3">
            <h5>For Businesses</h5>
            <ul>
              <li>
                <Link to="/corporate-training">Corporate Training</Link>
              </li>
              <li>
                <Link to="/partnerships">Partnerships</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-section row">
          <h5>Learn On the Go</h5>
          <div className="app-buttons">
            <a href="#" className="app-button">
              Google Play
            </a>
            <a href="#" className="app-button">
              App Store
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-content width-wrap-content">
          <div className="trending-sections">
            <div className="trending-section">
              <h6>Trending Certification Programs</h6>
              <p>
                Data Science, Machine Learning, Python for Data Science, Full
                Stack Development
              </p>
            </div>
            <div className="trending-section">
              <h6>Trending Master Programs</h6>
              <p>
                Data Science Master Program, AI and Machine Learning Master
                Program, Full Stack Web Development Master Program
              </p>
            </div>
            <div className="trending-section">
              <h6>Trending Courses</h6>
              <p>
                Python Certification Course, Data Science Certification Course,
                AWS Certification Course, DevOps Certification Course
              </p>
            </div>
            <div className="trending-section">
              <h6>Trending Categories</h6>
              <p>
                Cloud Computing, Cyber Security, Data Science, Software
                Development, Business and Leadership
              </p>
            </div>
            <div className="trending-section">
              <h6>Trending Resources</h6>
              <p>
                Python Tutorial, Java Tutorial, SQL Tutorial, Data Science
                Tutorial, AWS Tutorial
              </p>
            </div>
          </div>

          <div className="footer-links">
            <a href="/terms">Terms and Conditions</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/refund">Refund Policy</a>
            <a href="/security">Security</a>
            <a href="/sitemap">Sitemap</a>
          </div>

          <p className="copyright">
            © 2007-2024 RealTech BlogX, Inc. All rights reserved.
          </p>

          <div className="disclaimer">
            <p>
              Disclaimer: The content on this site is for informational purposes
              only. Always refer to official documentation for production use.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
