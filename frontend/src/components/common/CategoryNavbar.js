// components/CategoryNavbar.js

import React, { useEffect } from "react";
import { Dropdown, Modal, Button, Nav, Spinner } from "react-bootstrap";
import { useCategories } from "../../hooks/useCategories";
import { usePosts } from "../../hooks/usePosts";

const CategoryNavbar = () => {
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const { fetchPostsByCategory } = usePosts();

  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [categoryPosts, setCategoryPosts] = React.useState([]); // Ensure it's initialized as an array
  const [showModal, setShowModal] = React.useState(false);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      const rootCategory = categories.find((cat) => !cat.parent);
      if (rootCategory) {
        setSelectedCategory(rootCategory);
        fetchPostsByCategory(rootCategory.id)
          .then((posts) => setCategoryPosts(posts || [])) // Ensure posts is an array
          .catch((error) => console.error("Error fetching posts:", error));
      }
    }
  }, [categories, selectedCategory, fetchPostsByCategory]);

  const handleCategoryClick = async (categoryId) => {
    if (categoryId !== selectedCategory?.id) {
      setSelectedCategory(categories.find((cat) => cat.id === categoryId));
      await fetchPostsByCategory(categoryId)
        .then((posts) => setCategoryPosts(posts || []))
        .catch((error) => console.error("Error fetching posts:", error));
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  const renderDropdownItems = (parentId) => {
    return categories
      .filter((cat) => cat.parent === parentId)
      .map((childCategory) => (
        <Dropdown.Item onClick={() => handleCategoryClick(childCategory.id)}>
          {childCategory.name}
        </Dropdown.Item>
      ));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Nav className="mr-auto flex-wrap justify-content-start">
        {categoriesLoading ? (
          <Spinner animation="border" />
        ) : categoriesError ? (
          <p className="error-message">{categoriesError}</p>
        ) : categories.length > 0 ? (
          categories
            .filter((cat) => !cat.parent)
            .map((parentCategory) => (
              <Dropdown
                as={Nav.Item}
                key={parentCategory.id}
                className="me-2 mb-2"
              >
                <Dropdown.Toggle
                  as={Nav.Link}
                  id={`dropdown-${parentCategory.id}`}
                >
                  {parentCategory.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {renderDropdownItems(parentCategory.id)}
                </Dropdown.Menu>
              </Dropdown>
            ))
        ) : (
          <p>No categories found</p>
        )}
      </Nav>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCategory?.name || "Select a category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Posts:</h5>
          {Array.isArray(categoryPosts) ? (
            categoryPosts.map((post) => <div key={post.id}>{post.title}</div>)
          ) : (
            <p>No posts found</p>
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

export default CategoryNavbar;
