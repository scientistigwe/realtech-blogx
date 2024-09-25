import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #333;
  color: #fff;
  padding: 3rem 0;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const FooterSection = styled.div`
  flex: 1 1 25%;
  margin-bottom: 2rem;

  h5 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 0.5rem;
    }

    a {
      color: #fff;
      text-decoration: none;

      &:hover {
        color: #ccc;
      }
    }
  }
`;

const SocialNetworks = styled.div`
  display: flex;
  align-items: center;

  a {
    color: #fff;
    font-size: 1.5rem;
    margin-right: 1rem;
    text-decoration: none;

    &:hover {
      color: #ccc;
    }
  }
`;

const AppButtons = styled.div`
  display: flex;

  .app-button {
    background-color: #fff;
    color: #333;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    text-decoration: none;
    margin-right: 1rem;

    &:hover {
      background-color: #ccc;
    }
  }
`;

const FooterBottom = styled.div`
  background-color: #222;
  padding: 1rem 0;

  .footer-bottom-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  .trending-sections {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1rem;

    .trending-section {
      flex: 1 1 20%;
      margin-right: 2rem;

      h6 {
        font-size: 1rem;
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 0.875rem;
        color: #ccc;
      }
    }
  }

  .footer-links {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1rem;

    a {
      color: #ccc;
      text-decoration: none;
      margin-right: 1.5rem;

      &:hover {
        color: #fff;
      }
    }
  }

  .copyright {
    font-size: 0.875rem;
    color: #aaa;
    margin-bottom: 0.5rem;
  }

  .disclaimer {
    font-size: 0.875rem;
    color: #aaa;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h5>Follow us</h5>
          <SocialNetworks>
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
          </SocialNetworks>
        </FooterSection>

        <FooterSection>
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
        </FooterSection>

        <FooterSection>
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
        </FooterSection>

        <FooterSection>
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
        </FooterSection>

        <FooterSection>
          <h5>For Businesses</h5>
          <ul>
            <li>
              <Link to="/corporate-training">Corporate Training</Link>
            </li>
            <li>
              <Link to="/partnerships">Partnerships</Link>
            </li>
          </ul>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <div className="footer-bottom-content">
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
            © 2024 InsiTech International, Inc. All rights reserved.
          </p>

          <div className="disclaimer">
            <p>
              Disclaimer: The content on this site is for informational purposes
              only. Always refer to official documentation for production use.
            </p>
          </div>
        </div>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
