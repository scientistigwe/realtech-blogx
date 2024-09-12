import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Dropdown,
  Spinner,
  Container,
  Modal,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Search } from "lucide-react";
import { categoryService } from "../../services/categoryService";
import { postService } from "../../services/postsService";
import "./../../styles/Navbar.css"; // Custom CSS

const NavbarComponent = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const fetchedCategories = await categoryService.listCategories();
        setCategories(fetchedCategories || []); // Ensure we always set an array
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
        setCategories([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null); // Toggle off if already selected
      return;
    }

    setSelectedCategory(categoryId);
    try {
      const posts = await postService.fetchPostsByCategory(categoryId);
      setCategoryPosts(posts || []); // Ensure we always set an array
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
      setCategoryPosts([]);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  if (loading) return <Spinner animation="border" />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Brand</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {categories
                .filter((cat) => !cat.parent)
                .map((parentCategory) => (
                  <Nav.Item key={parentCategory.id}>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="link"
                        id={`dropdown-basic-${parentCategory.id}`}
                      >
                        {parentCategory.name}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {categories
                          .filter((cat) => cat.parent === parentCategory.id)
                          .map((subCategory) => (
                            <Dropdown.Item
                              key={subCategory.id}
                              href={`/posts?category=${subCategory.id}`}
                              onClick={() =>
                                handleCategoryClick(subCategory.id)
                              }
                            >
                              {subCategory.name}
                            </Dropdown.Item>
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Nav.Item>
                ))}
            </Nav>
            <Form className="ml-auto d-flex">
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
              />
              <Button variant="outline-success">
                <Search />
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Posts in{" "}
            {categories.find((cat) => cat.id === selectedCategory)?.name ||
              "Selected Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <ul className="list-unstyled">
              {categoryPosts.length > 0 ? (
                categoryPosts.map((post) => (
                  <li key={post.id}>
                    <a href={`/post/${post.id}`}>{post.title}</a>
                  </li>
                ))
              ) : (
                <p>No posts found for this category.</p>
              )}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavbarComponent;
