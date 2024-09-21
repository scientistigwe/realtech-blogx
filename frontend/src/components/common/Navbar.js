import React from "react";
import { Navbar, Container, Row, Col } from "react-bootstrap";
import CategoryNavbar from "./CategoryNavbar";
import SearchNavbar from "./SearchNavbar";
import "./../../styles/Navbar.css";

const NavbarComponent = () => {
  return (
    <Navbar bg="light" expand="lg" className="flex-column">
      <Container fluid className="px-0">
        <Navbar.Collapse id="basic-navbar-nav">
          <Row className=" row w-100">
            <Col className="col-md-12 d-flex justify-content-center">
              <div style={{ width: "80%" }}>
                <CategoryNavbar />
              </div>
            </Col>
            <Col className="col-md-12 w-100 mt-3 d-flex justify-content-center">
              <div style={{ width: "50%" }}>
                <SearchNavbar />
              </div>
            </Col>
          </Row>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
