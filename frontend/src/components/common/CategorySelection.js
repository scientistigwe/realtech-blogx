import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-bootstrap";
import { fetchCategories } from "../../redux/category/categoryThunks";
import { selectCategories } from "../../redux/category/categorySelectors";

const CategorySelection = ({ onCategoryChange }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);

  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState({});
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedParentName, setSelectedParentName] = useState("");
  const [selectedChildName, setSelectedChildName] = useState("");

  useEffect(() => {
    dispatch(fetchCategories()).then((response) => {});
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;

    dispatch(fetchCategories())
      .then((response) => {
        if (isMounted) {
          if (response.payload.length > 0) {
            const parents = response.payload.filter(
              (category) => category.parent === null
            );
            setParentCategories(parents);

            const children = {};
            response.payload.forEach((category) => {
              if (category.parent !== null) {
                if (!children[category.parent]) {
                  children[category.parent] = [];
                }
                children[category.parent].push(category);
              }
            });

            setChildCategories(children);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (categories?.payload?.length > 0) {
      const parents = categories.payload.filter(
        (category) => category.parent === null
      );
      setParentCategories(parents);

      const children = categories.payload.reduce((acc, category) => {
        if (category.parent !== null) {
          if (!acc[category.parent]) {
            acc[category.parent] = [];
          }
          acc[category.parent].push(category);
        }
        return acc;
      }, {});

      setChildCategories(children);
    }
  }, [categories]);

  const handleParentChange = useCallback(
    (e) => {
      const parentId = parseInt(e.target.value, 10);
      const parentCategory = parentCategories.find(
        (cat) => cat.id === parentId
      );

      setSelectedParent(parentId);
      setSelectedParentName(parentCategory.name);
      setSelectedChild("");
      setSelectedChildName("");
      onCategoryChange(parentId);
    },
    [onCategoryChange, parentCategories]
  );

  const handleChildChange = useCallback(
    (e) => {
      const childId = parseInt(e.target.value, 10);
      const childCategory = childCategories[selectedParent].find(
        (cat) => cat.id === childId
      );

      setSelectedChild(childId);
      setSelectedChildName(childCategory.name);
      onCategoryChange(childId);
    },
    [selectedParent, childCategories, onCategoryChange]
  );

  return (
    <>
      <Form.Group controlId="formParentCategory" className="form-group">
        <Form.Label className="form-label">Parent Category</Form.Label>
        <Form.Control
          as="select"
          value={selectedParent}
          onChange={handleParentChange}
          required
        >
          <option value="">Select a parent category</option>
          {parentCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {selectedParent && childCategories[selectedParent] && (
        <Form.Group controlId="formChildCategory" className="form-group">
          <Form.Label className="form-label">Child Category</Form.Label>
          <Form.Control
            as="select"
            value={selectedChild}
            onChange={handleChildChange}
          >
            <option value="">Select a child category</option>
            {childCategories[selectedParent].map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      )}
    </>
  );
};

export default CategorySelection;
