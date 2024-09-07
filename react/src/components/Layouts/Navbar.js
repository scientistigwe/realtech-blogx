import React, { useState } from "react";
import { Link } from "react-router-dom";
import searchIcon from "../../assets/icons/search.png";
import { useCategoriesList } from "../../hooks/useCategories";
import {
  usePostsByCategory,
  usePostsBySubcategory,
  useSearchPosts,
} from "../../hooks/usePosts";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Modal,
} from "react-bootstrap";
import { Search } from "lucide-react";

const ImprovedNavbar = () => {
  const { categories, error: categoriesError } = useCategoriesList();
  const {
    posts: categoryPosts,
    loading: categoryLoading,
    error: categoryError,
    fetchPostsByCategory,
  } = usePostsByCategory();
  const {
    posts: subcategoryPosts,
    loading: subcategoryLoading,
    error: subcategoryError,
    fetchPostsBySubcategory,
  } = usePostsBySubcategory();
  const {
    posts: searchPosts,
    loading: searchLoading,
    error: searchError,
    searchPosts: searchPostsFn,
  } = useSearchPosts();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  React.useEffect(() => {
    if (selectedCategory) {
      fetchPostsByCategory(selectedCategory).then((data) => {
        setPosts(data);
        setShowModal(true);
      });
    }
  }, [selectedCategory, fetchPostsByCategory]);

  React.useEffect(() => {
    if (selectedSubcategory) {
      fetchPostsBySubcategory(selectedSubcategory).then((data) => {
        setPosts(data);
        setShowModal(true);
      });
    }
  }, [selectedSubcategory, fetchPostsBySubcategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const data = await searchPostsFn(searchTerm);
    setPosts(data);
    setShowModal(true);
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="flex-column">
        <Container fluid className="p-0">
          <Row>
            <Row className="w-100 mb-2 overflow-auto col-md-10 m-auto">
              <Col>
                <Nav className="flex-nowrap">
                  {Object.entries(categories).map(([key, category]) => (
                    <Nav.Link
                      key={key}
                      onClick={() => handleCategorySelect(key)}
                      className={`px-3 ${
                        selectedCategory === key ? "active fw-bold" : ""
                      }`}
                      style={{
                        backgroundColor:
                          selectedCategory === key ? "#e9ecef" : "transparent",
                        borderRadius: "4px",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      {category.label}
                    </Nav.Link>
                  ))}
                </Nav>
              </Col>
            </Row>
            {selectedCategory && (
              <Row
                className="w-100 mb-2 overflow-auto col-md-10 m-auto"
                style={{ backgroundColor: "#e9ecef" }}
              >
                <Col>
                  <Nav className="flex-nowrap">
                    {categories[selectedCategory]?.subcategories.map((sub) => (
                      <Nav.Link
                        key={sub}
                        onClick={() => handleSubcategorySelect(sub)}
                        className={`px-3 ${
                          selectedSubcategory === sub ? "active fw-bold" : ""
                        }`}
                      >
                        {sub
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </Nav.Link>
                    ))}
                  </Nav>
                </Col>
              </Row>
            )}
            <Row className="w-50 col-md-8 d-flex justify-center m-auto">
              <Col>
                <Form onSubmit={handleSearch} className="d-flex">
                  <div className="position-relative w-100">
                    <FormControl
                      type="text"
                      placeholder="Search"
                      className="mr-sm-2 pr-5"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                      variant="link"
                      type="submit"
                      className="position-absolute"
                      style={{
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <Search size={20} />
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Row>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedSubcategory
              ? `Posts in ${selectedSubcategory
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}`
              : selectedCategory
              ? `Posts in ${categories[selectedCategory]?.label}`
              : "Search Results"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categoryLoading || subcategoryLoading || searchLoading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : posts.length > 0 ? (
            <ul className="list-unstyled">
              {posts.map((post) => (
                <li key={post.id} className="mb-3">
                  <h5>{post.title}</h5>
                  <p>{post.content.substring(0, 100)}...</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No posts found.</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ImprovedNavbar;
