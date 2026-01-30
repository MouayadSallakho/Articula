// src/components/ProtectedRoute.jsx
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoginRequiredModal from "./LoginRequiredModal";

export default function ProtectedRoute({ children }) {
  const { currentUser, isLoggedIn } = useContext(AuthContext);

  const logged =
    typeof isLoggedIn === "boolean" ? isLoggedIn : Boolean(currentUser);

  const [open, setOpen] = useState(!logged);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setOpen(!logged);
  }, [logged]);

  if (logged) return children;

  return (
    <LoginRequiredModal
      open={open}
      onClose={() => {
        setOpen(false);
        if (location.key !== "default") navigate(-1);
        else navigate("/", { replace: true });
      }}
      onLogin={() =>
        navigate("/login", {
          state: { from: location.pathname + location.search },
        })
      }
      onRegister={() =>
        navigate("/register", {
          state: { from: location.pathname + location.search },
        })
      }
      title="Login required"
      text="Please sign in to access this page."
    />
  );
}
