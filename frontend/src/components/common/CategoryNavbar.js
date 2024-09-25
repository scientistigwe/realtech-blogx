import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchCategories } from "../../redux/category/categoryThunks";
import { fetchPostsByCategory } from "../../redux/post/postThunks";
import { selectCategories } from "../../redux/category/categorySelectors";
import { selectPostsByCategory } from "../../redux/post/postSelectors";

const NavbarContainer = styled.nav`
  background-color: #f8f9fa;
  padding: 1rem;
`;

const CategoryList = styled.ul`
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const CategoryItem = styled.li`
  margin-right: 1rem;
  position: relative;
`;

const CategoryButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;

  &:hover {
    background-color: #e9ecef;
  }
`;

const SubcategoryList = styled.ul`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  padding: 0.5rem 0;
  z-index: 1000;
`;

const SubcategoryItem = styled.li`
  padding: 0.25rem 1rem;

  &:hover {
    background-color: #f1f3f5;
  }
`;

const Modal = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
`;

const ModalContent = styled.div`
  background-color: white;
  margin: 10% auto;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  float: right;
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const PostList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PostItem = styled.li`
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
`;

const CategoryNavbar = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const postsByCategory = useSelector(selectPostsByCategory);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [openSubcategories, setOpenSubcategories] = useState({});

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = async (categoryId) => {
    if (categoryId !== selectedCategory?.id) {
      setSelectedCategory(categories.find((cat) => cat.id === categoryId));
      dispatch(fetchPostsByCategory(categoryId));
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  const toggleSubcategories = (categoryId) => {
    setOpenSubcategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const renderSubcategories = (parentId) => {
    return categories
      .filter((cat) => cat.parent === parentId)
      .map((childCategory) => (
        <SubcategoryItem
          key={childCategory.id}
          onClick={() => handleCategoryClick(childCategory.id)}
        >
          {childCategory.name}
        </SubcategoryItem>
      ));
  };

  const renderCategories = () => {
    return categories
      .filter((cat) => !cat.parent)
      .map((parentCategory) => (
        <CategoryItem key={parentCategory.id}>
          <CategoryButton
            onClick={() => toggleSubcategories(parentCategory.id)}
          >
            {parentCategory.name}
          </CategoryButton>
          <SubcategoryList isOpen={openSubcategories[parentCategory.id]}>
            {renderSubcategories(parentCategory.id)}
          </SubcategoryList>
        </CategoryItem>
      ));
  };

  return (
    <>
      <NavbarContainer>
        <CategoryList>{renderCategories()}</CategoryList>
      </NavbarContainer>

      <Modal isOpen={showModal}>
        <ModalContent>
          <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
          <h2>{selectedCategory?.name || "Select a category"}</h2>
          <h3>Posts:</h3>
          {postsByCategory.length > 0 ? (
            <PostList>
              {postsByCategory.map((post) => (
                <PostItem key={post.id}>
                  <h4>{post.title}</h4>
                  <p>{post.excerpt}</p>
                </PostItem>
              ))}
            </PostList>
          ) : (
            <p>No posts found in this category</p>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CategoryNavbar;
