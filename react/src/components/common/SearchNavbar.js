import React from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { Search } from "lucide-react";

const SearchNavbar = ({ onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const searchTerm = e.target.searchTerm.value.trim();
    if (searchTerm) {
      onSearch(searchTerm);
    }
  };

  return (
    <Form className="d-flex ml-auto" onSubmit={handleSubmit}>
      <FormControl
        type="text"
        name="searchTerm"
        placeholder="Search"
        className="mr-sm-2"
      />
      <Button variant="outline-success" type="submit">
        <Search />
      </Button>
    </Form>
  );
};

export default SearchNavbar;
