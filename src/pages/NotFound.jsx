// src/pages/NotFound.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./NotFound.css";

// حط صورة 404 داخل: src/assets/images/404.png
import NotFoundImg from "../assets/images/NotFoundImg.png";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="nf-wrap">
      <div className="nf-card">
        <img className="nf-img" src={NotFoundImg} alt="404 Not Found" />


        <div className="nf-actions">
          <button className="nf-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>

          <Link className="nf-link" to="/">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
