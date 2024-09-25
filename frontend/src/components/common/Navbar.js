import React from "react";
import { Navbar, Container } from "react-bootstrap";
import CategoryNavbar from "./CategoryNavbar";
import SearchNavbar from "./SearchNavbar";
import styled from "styled-components";

const NavbarContainer = styled(Navbar)`
  background-color: #f8f9fa;
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
`;

const NavbarContent = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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
  }
`;

const NavbarComponent = () => {
  return (
    <NavbarContainer expand="lg">
      <NavbarContent fluid>
        <SearchAndCategoryWrapper>
          <div style={{ width: "100%", marginBottom: "1rem" }}>
            <CategoryNavbar />
          </div>
          <div style={{ width: "100%" }}>
            <SearchNavbar />
          </div>
        </SearchAndCategoryWrapper>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default NavbarComponent;
