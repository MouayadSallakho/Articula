// src/components/Header.jsx
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from "react-bootstrap/Dropdown";
import Spinner from "react-bootstrap/Spinner";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { FaQuestion } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";

import { IoHomeOutline } from "react-icons/io5";
import { GrArticle } from "react-icons/gr";
import { MdEventAvailable } from "react-icons/md";
import { IoMdContacts } from "react-icons/io";
import { FaBookReader } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";

import LoginRequiredModal from "./LoginRequiredModal";

import Mylogo from "../assets/images/myLogo.png";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Header.css";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";

const Header = () => {
  const [loginTarget, setLoginTarget] = useState("/");



  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleOpenOffcanvas = () => setShowOffcanvas(true);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);

  const expand = "lg";
  const { currentUser, logout, username } = useContext(AuthContext);
  const userInfo = currentUser; // نفس الاسم اللي الهيدر متعود عليه


    function guardProtectedClick(e, targetPath) {
    if (!userInfo) {
      e.preventDefault();
      setLoginTarget(targetPath);
      setShowLoginToast(true);
      handleCloseOffcanvas(); // ✅ سكّر offcanvas إذا كان موبايل
    }
  }

  const isAdmin =
    String(username || "")
      .trim()
      .toLowerCase() === "tamkeen";

  const navigate = useNavigate();

  const [showLoginToast, setShowLoginToast] = useState(false);

  // Logout modal state
  const [showLogout, setShowLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const displayName = userInfo?.name || userInfo?.username || "User";
  const displayEmail = userInfo?.mail || "";
  const firstLetter = (displayName || "U").trim().charAt(0).toUpperCase();
  const avatarUrl = userInfo?.avatarUrl || null;

  const openLogoutModal = () => {
    handleCloseOffcanvas(); // ✅ يسكر الموبايل منيو قبل المودال
    setShowLogout(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
      setLogoutError("صار خطأ أثناء تسجيل الخروج. رح نسجّلك خروج محليًا.");
    } finally {
      setIsLoggingOut(false);
      setShowLogout(false);
      navigate("/", { replace: true });
    }
  };

  const handleCancelLogout = () => {
    if (isLoggingOut) return;
    setShowLogout(false);
    setLogoutError(null);
  };

  function guardBlogClick(e) {
    if (!userInfo) {
      e.preventDefault();
      setShowLoginToast(true);
    }
  }

  return (
    <>
      <Navbar data-aos="fade-down" expand={expand} className="navbar-hero">
        <Container>
          {/* Logo */}
          <Navbar.Brand className="holderLogo" as={Link} to="/">
            <img src={Mylogo} alt="Logo" />
          </Navbar.Brand>

          {/* Desktop menu */}
          <Nav className="me-auto d-none d-lg-flex align-items-center our_Nav">
            <Nav.Link as={NavLink} to="/" className="link">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/jobs" className="link">
              Our Jobs
            </Nav.Link>
            <Nav.Link
              className="link"
              as={NavLink}
              to="/blog"
              onClick={(e) => guardProtectedClick(e, "/blog")}
            >
              Blog list
            </Nav.Link>
            <Nav.Link
              aria-label="Explore About US"
              as={NavLink}
              to="/about"
              className="link"
            >
              About Us
            </Nav.Link>
            <Nav.Link as={NavLink} to="/faq" className="link">
              FAQ
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact" className="link">
              Contact
            </Nav.Link>
          </Nav>

          {/* Desktop right */}
          {!userInfo ? (
            <ul className="ms-auto d-none d-lg-flex align-items-center sign_Regester">
              <li className="headerToggles">
                <LanguageToggle />
                <ThemeToggle />
              </li>
              <li>
                <Nav.Link as={NavLink} to="/login">
                  Sign In
                </Nav.Link>
              </li>
              <li>
                <Nav.Link as={NavLink} to="/register">
                  Create Account
                </Nav.Link>
              </li>
            </ul>
          ) : (
            <div className="ms-auto d-none d-lg-flex align-items-center gap-1">
              <div className="headerToggles">
                <LanguageToggle />
                <ThemeToggle />
              </div>
              <Dropdown align="end">
                <Dropdown.Toggle
                  id="profile-dropdown"
                  className="profile-toggle d-flex align-items-center"
                >
                  <span className="profile-name text-truncate">
                    {displayName}
                  </span>

                  <div className="header-avatar-wrapper">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="header-avatar-img"
                      />
                    ) : (
                      <span className="header-avatar-letter">
                        {firstLetter}
                      </span>
                    )}
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="ssss">
                  <Dropdown.Item
                    as={NavLink}
                    to="/account"
                    onClick={(e) => guardProtectedClick(e, "/account")}
                  >
                    My Account
                  </Dropdown.Item>

                  <Dropdown.Item
                    as={NavLink}
                    to="/my-articles"
                    onClick={(e) => guardProtectedClick(e, "/my-articles")}
                  >
                    My Articles
                  </Dropdown.Item>

                  {isAdmin && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        as={NavLink}
                        to="/admin/dashboard"
                        onClick={handleCloseOffcanvas}
                      >
                        Admin • Dashboard
                      </Dropdown.Item>
 
                    </>
                  )}

                  <Dropdown.Divider />

                  <Dropdown.Item onClick={openLogoutModal}>
                    <MdOutlineLogout /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="d-lg-none custom-toggler"
            type="button"
            aria-controls={`offcanvasNavbar-${expand}`}
            aria-label="Toggle navigation"
            onClick={handleOpenOffcanvas}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <Navbar.Offcanvas
            id={`offcanvasNavbar-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-${expand}`}
            placement="end"
            className="d-lg-none navbar-offcanvas"
            show={showOffcanvas}
            onHide={handleCloseOffcanvas}
          >
            <Offcanvas.Header
              className="holderColse d-flex align-items-center justify-content-between"
              closeButton={false}
            >
              <Offcanvas.Title
                id={`offcanvasNavbarLabel-${expand}`}
                className="m-0 d-flex align-items-center"
              >
                <img src={Mylogo} alt="Logo" />
              </Offcanvas.Title>

              <button
                type="button"
                className="btn d-flex align-items-center"
                onClick={handleCloseOffcanvas}
                aria-label="Close menu"
              >
                <span>
                  <IoIosArrowForward />
                </span>
              </button>
            </Offcanvas.Header>

            <Offcanvas.Body className="Offcanvas-Body">
              <div className="top">
                <Nav className="flex-grow-1 m-holderlinks">
                  <Nav.Link
                    as={NavLink}
                    to="/"
                    end
                    onClick={handleCloseOffcanvas}
                  >
                    <IoHomeOutline /> Home
                  </Nav.Link>
                  <Nav.Link
                    className="link"
                    as={NavLink}
                    to="/blog"
                    onClick={(e) => guardProtectedClick(e, "/blog")}
                  >
                    <GrArticle /> Blog list
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/about"
                    onClick={handleCloseOffcanvas}
                  >
                    <FaBookReader /> About Us
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/jobs"
                    onClick={handleCloseOffcanvas}
                  >
                    <MdOutlineWorkOutline /> Our Jops
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/faq"
                    onClick={handleCloseOffcanvas}
                  >
                    <FaQuestion /> FAQ
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/contact"
                    onClick={handleCloseOffcanvas}
                  >
                    <IoMdContacts /> Contact
                  </Nav.Link>
                </Nav>

                <div className="mt-4">
                  {!userInfo ? (
                    <div className="d-flex flex-column gap-2 sign-Creat">
                      <NavLink
                        to="/login"
                        className="btn-like-link btn-like-link1 btn"
                        onClick={handleCloseOffcanvas}
                      >
                        Sign In
                      </NavLink>
                      <NavLink
                        to="/register"
                        className="btn-like-link btn-like-link2 btn"
                        onClick={handleCloseOffcanvas}
                      >
                        Create Account
                      </NavLink>
                    </div>
                  ) : (
                    <div className="holder-account-articales">
                      <div className="d-flex align-items-center mb-2 holder-info-mail">
                        <div className="offcanvas-avatar">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={displayName}
                              className="header-avatar-img"
                            />
                          ) : (
                            firstLetter
                          )}
                        </div>
                        <div>
                          <span>{displayName}</span>
                          <span>{displayEmail}</span>
                        </div>
                      </div>

                      <NavLink
                        to="/account"
                        className="btn-like-link Account btn mb-2"
                        onClick={handleCloseOffcanvas}
                      >
                        My Account
                      </NavLink>

                      <NavLink
                        to="/my-articles"
                        className="btn-like-link myarrticales btn mb-2"
                        onClick={handleCloseOffcanvas}
                      >
                        My Articles
                      </NavLink>

                      {isAdmin && (
                        <>
                          <NavLink
                            to="/admin/articles"
                            className="btn-like-link myarrticales btn"
                            onClick={handleCloseOffcanvas}
                          >
                            Admin • Articles
                          </NavLink>
                        </>
                      )}
q
                      {/* <button
                        type="button"
                        className=" dangeres btn "
                        onClick={openLogoutModal}
                      >
                        <MdOutlineLogout /> Logout
                      </button> */}
                    </div>
                  )}
                </div>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* ✅ Login Required Toast لازم يكون دايماً موجود */}
      <LoginRequiredModal
        open={showLoginToast}
        onClose={() => setShowLoginToast(false)}
        onLogin={() => {
          setShowLoginToast(false);
          navigate("/login", { state: { from: loginTarget } });
        }}
        onRegister={() => {
          setShowLoginToast(false);
          navigate("/register", { state: { from: loginTarget } });
        }}
        title="Login required"
        text="Please sign in to continue."
      />

      {/* Logout overlay */}
      {showLogout && (
        <div className="logout-overlay">
          <div className="logout-dialog">
            {!isLoggingOut ? (
              <>
                <div className="logout-icon-circle">!</div>
                <h3 className="logout-title">
                  Are you sure you want to sign out?
                </h3>
                <p className="logout-text">
                  You will need to sign in again to access your account and
                  articles.
                </p>

                {logoutError && <p className="logout-error">{logoutError}</p>}

                <div className="logout-actions">
                  <button
                    type="button"
                    className="btn btn-light logout-btn-cancel"
                    onClick={handleCancelLogout}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary logout-btn-confirm"
                    onClick={handleConfirmLogout}
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="logout-processing">
                <Spinner animation="border" role="status" />
                <h4 className="logout-processing-title mt-3">
                  Logging you out...
                </h4>
                {logoutError && (
                  <p className="logout-error mt-2">{logoutError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
