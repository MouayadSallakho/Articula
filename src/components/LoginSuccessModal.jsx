import React, { useEffect } from "react";
import "./LoginSuccessModal.css";

export default function LoginSuccessModal({
  open,
  name = "User",
  onDone,
  durationMs = 2000,
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onDone?.(), durationMs);
    return () => clearTimeout(t);
  }, [open, onDone, durationMs]);

  if (!open) return null;

  return (
    <div className="lsmOverlay" role="dialog" aria-modal="true">
      <div className="lsmCard">
        <div className="lsmIcon">✓</div>
        <h3 className="lsmTitle">Welcome back, {name}!</h3>
        <p className="lsmText">Login successful. Redirecting…</p>
      </div>
    </div>
  );
}
