import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div
        style={{
          width: "100%",
          minHeight: "20vh",
          maxHeight: "30vh",
          marginTop: 60,
        }}
      >
        <p style={{ fontSize: "30px", textAlign: "center", padding: "20px" }}>
          Chào mừng đến với người trợ lý phát luật thông minh 
          <span>
            <Link
              style={{ color: "white" }}
              className="nav-link"
              to={""}
            >
              LawAI
            </Link>
          </span>
          
        </p>
      </div>
    </footer>
  );
};

export default Footer;
