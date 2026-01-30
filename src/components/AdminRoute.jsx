// src/components/AdminRoute.jsx
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoginRequiredModal from "./LoginRequiredModal";

export default function AdminRoute({ children }) {
  const { currentUser, isLoggedIn, username } = useContext(AuthContext);

  const logged =
    typeof isLoggedIn === "boolean" ? isLoggedIn : Boolean(currentUser);

  const isAdmin = String(username || "").trim().toLowerCase() === "tamkeen";

  const [openLogin, setOpenLogin] = useState(!logged);
  const [openNoAccess, setOpenNoAccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setOpenLogin(!logged);
    if (logged && !isAdmin) setOpenNoAccess(true);
    else setOpenNoAccess(false);
  }, [logged, isAdmin]);

  // ✅ إذا أدمن
  if (logged && isAdmin) return children;

  // ✅ إذا مش مسجّل
  if (!logged) {
    return (
      <LoginRequiredModal
        open={openLogin}
        onClose={() => {
          setOpenLogin(false);
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

  // ✅ إذا مسجّل بس مو أدمن
  return (
    <LoginRequiredModal
      open={openNoAccess}
      onClose={() => {
        setOpenNoAccess(false);
        navigate("/", { replace: true });
      }}
      onLogin={() => navigate("/", { replace: true })}
      onRegister={() => navigate("/", { replace: true })}
      title="No access"
      text='This area is for admin only.'
    />
  );
}
