import React, { useContext, useEffect, useState } from "react";
import { Row, Container, Col, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const HeroSlideFromHomePage = ({ title, desc, image, ctas = [] }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const [typedTitle, setTypedTitle] = useState("");
  const [isTitleDone, setIsTitleDone] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // ✅ Modal state (for not-logged-in actions)
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 🔹 تحديد إذا الشاشة ديسكتوب أو لا (>= 992px)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px)");

    const handleChange = (e) => setIsDesktop(e.matches);

    setIsDesktop(mq.matches);

    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // 🔹 أنيميشن العنوان (أو عرض مباشر على الموبايل)
  useEffect(() => {
    setTypedTitle("");
    setIsTitleDone(false);
    setShowDesc(false);

    if (!title) return;

    if (!isDesktop) {
      setTypedTitle(title);
      setIsTitleDone(true);
      setShowDesc(true);
      return;
    }

    let i = 0;
    const speed = 60;
    const startDelay = 110;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setTypedTitle((prev) => prev + title[i]);
        i++;

        if (i >= title.length) {
          clearInterval(interval);
          setIsTitleDone(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [title, isDesktop]);

  // 🔹 بعد ما يخلص العنوان + underline (على الديسكتوب فقط)
  useEffect(() => {
    if (!isTitleDone) return;
    if (!isDesktop) return;

    const underlineDuration = 700;
    const t = setTimeout(() => setShowDesc(true), underlineDuration);

    return () => clearTimeout(t);
  }, [isTitleDone, isDesktop]);

  // ✅ CTA behavior (best practice)
  function handleReadClick() {
    if (isLoggedIn) {
      navigate("/blog");
      return;
    }
    // not logged in -> show a nice modal
    setShowAuthModal(true);
  }

  function handleSecondCtaClick() {
    if (isLoggedIn) {
      navigate("/articles/create");
      return;
    }
    navigate("/register");
  }

  // ✅ To avoid relying on labels فقط، رح نحدد CTA حسب ترتيبه:
  // ctas[0] = Start Reading
  // ctas[1] = Create Account / Write an Article
  const firstCtaLabel = ctas?.[0]?.label || "Start Reading";
  const secondCtaLabel = isLoggedIn ? "Write an Article" : (ctas?.[1]?.label || "Create Account");

  return (
    <div>
      <Container>
        <Row className="hero-row">
          <Col lg={6} data-aos="fade-right">
            <h2>
              {typedTitle}
              <span className="typing-cursor">|</span>
            </h2>

            <span className={`hero-underline ${isTitleDone ? "active" : ""}`} />

            <p className={`hero-desc ${showDesc ? "visible" : ""}`}>{desc}</p>

            <ul className={showDesc ? "hero-ctas visible" : "hero-ctas"}>
              {/* CTA 1: Start Reading */}
              <li>
                <Button
                  variant="primary"
                  onClick={handleReadClick}
                >
                  {firstCtaLabel}
                </Button>
              </li>

              {/* CTA 2: Create Account OR Write an Article */}
              <li>
                <Button
                className="ccc"
                  variant={isLoggedIn ? "dark" : "outline-light"}
                  onClick={handleSecondCtaClick}
                >
                  {secondCtaLabel}
                </Button>
              </li>
            </ul>
          </Col>

          <Col lg={6}>
            <div className={`hero-image ${showDesc ? "visible" : ""}`}>
              <img src={image} alt="Hero visual" />
            </div>
          </Col>
        </Row>
      </Container>

      {/* ✅ Bootstrap Modal (Beautiful login required) */}
      <Modal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        centered
        backdrop="static"
        keyboard
      >
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p style={{ marginBottom: 8, fontWeight: 600 }}>
            To start reading articles, you need to be logged in.
          </p>

          <p style={{ marginBottom: 0, opacity: 0.85 }}>
            Create an account to access premium content, save favorites, and write your own articles.
          </p>

          <div
            className="mt-3 p-3"
            style={{
         borderRadius: 12,
    background: "var(--hero-modal-box-bg)",
    border: `1px solid var(--hero-modal-box-border)`,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Why login?</div>
            <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.9 }}>
              <li>Access the full blog content</li>
              <li>Save favorites & manage your account</li>
              <li>Create and manage your articles</li>
            </ul>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={() => setShowAuthModal(false)}>
            Not now
          </Button>

          <Button
            variant="outline-primary"
            onClick={() => {
              setShowAuthModal(false);
              navigate("/register");
            }}
          >
            Create Account
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              setShowAuthModal(false);
              navigate("/login");
            }}
          >
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HeroSlideFromHomePage;
