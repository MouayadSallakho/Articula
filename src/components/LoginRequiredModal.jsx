import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import "./LoginRequiredModal.css";

export default function LoginRequiredModal({
  open,
  onClose,
  onLogin,
  onRegister,
  title = "Login required",
  text = "You must sign in to access this page.",
}) {
  // ✅ ESC يغلق المودال
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="lrmOverlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // ✅ 클릭 خارج الكارد يغلق
        if (e.target.classList.contains("lrmOverlay")) onClose?.();
      }}
    >
      <div className="lrmCard">
        <div className="lrmHead">
          <div className="lrmIcon">!</div>
          <div className="lrmTitles">
            <div className="lrmTitle">{title}</div>
            <div className="lrmText">{text}</div>
          </div>
        </div>

        <div className="lrmActions">
          <Button className="lrmBtnPrimary" onClick={onLogin}>
            Sign In
          </Button>

          <Button className="lrmBtnOutline" variant="outline-light" onClick={onRegister}>
            Create Account
          </Button>

          <button className="lrmClose" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
