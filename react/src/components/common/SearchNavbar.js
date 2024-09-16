import React from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { Search } from "lucide-react";

const SearchNavbar = () => {
  const handleSearch = (e) => {
    e.preventDefault();
    // Logic for handling search functionality goes here
  };

  return (
    <Form className="ml-auto d-flex w-100" onSubmit={handleSearch}>
      <FormControl type="text" placeholder="Search" className="mr-sm-2 w-100" />
      <Button variant="outline-success" type="submit">
        <Search />
      </Button>
    </Form>
  );
};

export default SearchNavbar;
