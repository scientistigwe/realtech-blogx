import React from "react";
import { Navbar, Container } from "react-bootstrap";
import CategoryNavbar from "./CategoryNavbar"; // Ensure this component is correctly implemented
import SearchNavbar from "./SearchNavbar";
import styled from "styled-components";

// Dark background for the Navbar with white text
const NavbarContainer = styled(Navbar)`
  background-color: #808080;
  padding: 1rem 0;
  border-bottom: 1px solid #333;
  color: #fff;
`;

const NavbarContent = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Flexbox for better UX: spacing, padding, and alignment
const SearchAndCategoryWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const SearchWrapper = styled.div`
  width: 100%;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    width: 48%;
  }
`;

const CategoryWrapper = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 48%;
  }
`;

// Enhanced button/link hover styling for better UX
const StyledLink = styled.div`
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #ff8c00; // Orange on hover to match project colors
  }
`;

// Adjusted CategoryNavbar and SearchNavbar with padding and border-radius
const StyledCategoryNavbar = styled(CategoryNavbar)`
  background-color: #333;
  padding: 0.8rem;
  border-radius: 8px;
  color: #fff;
  text-align: center;
`;

const StyledSearchNavbar = styled(SearchNavbar)`
  background-color: #333;
  padding: 0.8rem;
  border-radius: 8px;
  color: #fff;
`;

const NavbarComponent = () => {
  return (
    <NavbarContainer expand="lg">
      <NavbarContent fluid>
        <SearchAndCategoryWrapper>
          <CategoryWrapper>
            <StyledCategoryNavbar />
          </CategoryWrapper>
          <SearchWrapper>
            <StyledSearchNavbar />
          </SearchWrapper>
        </SearchAndCategoryWrapper>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default NavbarComponent;
