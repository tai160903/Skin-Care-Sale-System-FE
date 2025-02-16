import React from "react";
import { Link } from "react-router-dom";
import { LibraryBooksRounded as BlogIcon } from "@mui/icons-material";

const Blog = () => {
  return (
    <Link to="/blog" className="flex items-center text-gray-700 hover:text-green-700 space-x-2">
      <BlogIcon className="text-[#326f51] text-xl" />
      <span>Blog</span>
    </Link>
  );
};

export default Blog;
