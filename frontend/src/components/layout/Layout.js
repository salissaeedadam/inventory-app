import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import Footer from "../footer/Footer";
import Header from "../header/Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div style={{ minHeight: "80vh" }} className="--pad">
        <Link to="/cart" className="cart-link">View Cart</Link> {/* Add this Link */}
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
