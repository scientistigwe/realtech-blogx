import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";

// Styled Components
const HeroSection = styled.div`
  background-color: #dcdcdc; /* Dull white background */
  padding: 4rem 0;
  height: 500px;
  display: flex;
  align-items: center;
`;

const HeroContent = styled.div`
  max-width: 700px;
  margin: 0 auto; /* Center the content horizontally */
  padding: 0 1rem; /* Add padding for responsiveness */
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 4rem; /* Increased font size */
  font-weight: 500;
  margin-bottom: 1rem;
  line-height: 1.2;
  color: #000000; /* Black text */
`;

const BrandTitle = styled.span`
  color: #ff7f00; /* Orange color for "RealTech BlogX" */
  display: block;
  font-size: 1.2em; /* Slightly larger than the title */
  text-align: center;
`;

const HeroSubtitle = styled.h2`
  font-size: 1.5rem; /* Slightly larger subtitle */
  font-weight: 300;
  margin-bottom: 2.5rem;
  text-align: center;
  color: #000000; /* Black subtitle */
`;

const HeroButton = styled(Button)`
  font-size: 1.2rem;
  padding: 0.75rem 2rem;
  background-color: #dcdcdc;
  color: #000; /* White text */
  border-color: black;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e66b00; /* Darker orange on hover */
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const SlideImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
`;

const Hero = () => {
  return (
    <HeroSection>
      <Container>
        <Row>
          <Col md={6}>
            <SlideImage
              src="/api/placeholder/hero-image"
              alt="Hero section image"
            />
          </Col>
          <Col md={6}>
            <HeroContent>
              <HeroTitle>
                Welcome to <BrandTitle>RealTech BlogX</BrandTitle>
              </HeroTitle>
              <HeroSubtitle>
                Your Gateway to Data, Backend Dev, Python and DevOps Mastery.
              </HeroSubtitle>
              <HeroButton className="btn btn-outline-primary">
                Explore Now
              </HeroButton>
            </HeroContent>
          </Col>
        </Row>
      </Container>
    </HeroSection>
  );
};

export default Hero;
