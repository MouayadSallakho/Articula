import React, { useMemo, useState, useContext } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";

import hompage from "../assets/images/homepage.png";
import image1 from "../assets/images/Group 1000006184 (1).png";
import apple from "../assets/images/apple 2.png";
import searchgoogle from "../assets/images/search 1.png";
import fac from "../assets/images/facebook 1.png";

import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";

import { AuthContext } from "../context/AuthContext";
import LoginSuccessModal from "../components/LoginSuccessModal";
import "./LogIn.css";

function normalizeError(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err.message) return err.message;
  try {
    return JSON.stringify(err, null, 2);
  } catch {
    return "Unknown error";
  }
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser, login, loading } = useContext(AuthContext);

  const [loginData, setLoginData] = useState({ name: "", pass: "" });
  const [error, setError] = useState("");
  const [showpass, setShowpass] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/");

  const TooShortname = loginData.name.trim().length < 3;
  const TooShortPass = loginData.pass.trim().length < 6;

  const isDisabled = useMemo(
    () => loading || TooShortname || TooShortPass,
    [loading, TooShortname, TooShortPass]
  );

  function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (TooShortname) return setError("Name must be at least 3 characters");
    if (TooShortPass) return setError("Password must be at least 6 characters");

    login(loginData.name, loginData.pass)
      .then(() => {
        const from = location.state?.from; // جاي من protected link؟
        const target = from || "/";        // لو لا، رجعو للهوم
        setRedirectTo(target);
        setShowSuccess(true);
      })
      .catch((e2) => {
        setError(normalizeError(e2));
      });
  }

  return (
    <div className="login">
      <div className="headerLog">
        <Container>
          <img src={image1} alt="" />
          <div>
            <p>No Account Yet ? Sign Up</p>
            <Nav.Link as={Link} to="/register">
              Sign Up
            </Nav.Link>
          </div>
        </Container>
      </div>

      <div className="ourlogin">
        <Container>
          <Row>
            <Col className="left" md={6}>
              <img src={hompage} alt="" />
            </Col>

            <Col lg={{ span: 5, offset: 1 }} md={6} className="right">
              <div className="FirstAmbrithon">
                <p>Sign in to your account</p>
              </div>

              <form onSubmit={onSubmit}>
                <div className="mb-4 name">
                  <label>Email</label>
                  <input
                    onChange={(e) =>
                      setLoginData({ ...loginData, name: e.target.value })
                    }
                    value={loginData.name}
                    placeholder="Please Enter Your Email"
                    className="form-control"
                    type="text"
                    autoComplete="username"
                  />
                  {loginData.name && TooShortname && (
                    <small className="text-danger">
                      Name must be at least 3 characters
                    </small>
                  )}
                </div>

                <div className="mb-5">
                  <div className="label_pass">
                    <label>Password</label>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      Forgot Password
                    </a>
                  </div>

                  <div className="Input_Eye">
                    <input
                      onChange={(e) =>
                        setLoginData({ ...loginData, pass: e.target.value })
                      }
                      value={loginData.pass}
                      placeholder="Please Enter Your pass"
                      className="form-control inputpass"
                      type={showpass ? "text" : "password"}
                      autoComplete="current-password"
                    />

                    <button
                      className="oureye"
                      type="button"
                      onClick={() => setShowpass((v) => !v)}
                      aria-label="Toggle password visibility"
                    >
                      {showpass ? <IoEyeOff /> : <FaEye />}
                    </button>
                  </div>

                  <div className="remember">
                    <input type="checkbox" />
                    <label>Remember me</label>
                  </div>

                  {loginData.pass && TooShortPass && (
                    <small className="text-danger">
                      Password must be at least 6 characters
                    </small>
                  )}
                </div>

                {error && (
                  <div className="mb-3 alert alert-warning">{error}</div>
                )}

                <button
                  disabled={isDisabled}
                  className="submit w-100 btn rounded-pill"
                >
                  {loading ? <i>Logging in .... </i> : "Sign in"}
                </button>

                <div className="login-divider">
                  <span>Or Sign in With</span>
                </div>

                <div className="typeLogin">
                  <Nav.Link href="#" onClick={(e) => e.preventDefault()}>
                    <img src={apple} alt="Apple" />
                    <p>Apple</p>
                  </Nav.Link>

                  <Nav.Link href="#" onClick={(e) => e.preventDefault()}>
                    <img src={searchgoogle} alt="Google" />
                    <p>Google</p>
                  </Nav.Link>

                  <Nav.Link href="#" onClick={(e) => e.preventDefault()}>
                    <img src={fac} alt="Facebook" />
                    <p>Facebook</p>
                  </Nav.Link>
                </div>
              </form>

              <div style={{ marginTop: 14, textAlign: "center" }}>
                <span>Don't have an account? </span>
                <Link to="/register">Create Account</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ✅ Success Modal (center) ثم redirect */}
      <LoginSuccessModal
        open={showSuccess}
        name={currentUser?.name || currentUser?.username || "User"}
        onDone={() => {
          setShowSuccess(false);
          navigate(redirectTo, { replace: true });
        }}
      />

      
    </div>

    
  );
}
