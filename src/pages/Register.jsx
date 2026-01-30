import React, { useEffect, useMemo, useState, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

import { apiRequest } from "../api/request";
import { ApiConfig } from "../api/ApiConfig";
import { AuthContext } from "../context/AuthContext";

function normalizeError(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err.message) return err.message;
  try {
    return JSON.stringify(err, null, 2);
  } catch {
    return "Registration failed";
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function normalizeMobile(m) {
  return (m || "").replace(/[^\d]/g, "");
}

export default function Register() {
  const navigate = useNavigate();

  // ✅ إذا المستخدم مسجل دخول، لا داعي للتسجيل
  const { currentUser } = useContext(AuthContext);
  const isLoggedIn = !!currentUser;

  // --- Form fields
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showHide, setShowHide] = useState({
    pass: "password",
    confirm: "password",
  });

  // --- UI states
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [registerSuccessName, setRegisterSuccessName] = useState("");

  // --- Terms (How did you find us?)
  const [terms, setTerms] = useState([]);
  const [termsError, setTermsError] = useState("");
  const [selectedHear, setSelectedHear] = useState([]);

  // ✅ Redirect لو already logged in
  useEffect(() => {
    if (isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  // ✅ تحميل terms من API مباشر
  useEffect(() => {
    setTermsError("");

    apiRequest({
      endpoint: ApiConfig.ENDPOINTS.TERMS_HEAR,
      method: "GET",
      parseAs: "json",
      extraHeaders: {
        Accept: "application/json",
      },
    })
      .then((data) => {
        // data مثال: [{id:"15", name:"Internet"}, ...]
        setTerms(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setTerms([]);
        setTermsError("Could not load “How did you find us” options. You can still register.");
      });
  }, []);

  // --- Clean values
  const cleanUsername = username.trim();
  const cleanFirst = firstName.trim();
  const cleanSurname = surname.trim();
  const cleanEmail = email.trim();
  const cleanMobile = normalizeMobile(mobile);

  // --- Validations
  const usernameTooShort = cleanUsername.length < 4;
  const passTooShort = pass.trim().length < 6;
  const passMismatch = confirm.length > 0 && pass !== confirm;
  const emailInvalid = cleanEmail.length > 0 && !isValidEmail(cleanEmail);

  const mobileTooShort = cleanMobile.length > 0 && cleanMobile.length < 7;
  const mobileMissing = cleanMobile.length === 0;

  const isDisabled = useMemo(() => {
    if (isLoading) return true;

    if (!cleanUsername || !cleanFirst || !cleanSurname) return true;
    if (!cleanEmail || emailInvalid) return true;

    if (!pass || !confirm) return true;
    if (usernameTooShort || passTooShort || passMismatch) return true;

    if (mobileMissing || mobileTooShort) return true;

    return false;
  }, [
    isLoading,
    cleanUsername,
    cleanFirst,
    cleanSurname,
    cleanEmail,
    emailInvalid,
    pass,
    confirm,
    usernameTooShort,
    passTooShort,
    passMismatch,
    mobileMissing,
    mobileTooShort,
  ]);

  function buildRegisterBody() {
    return {
      name: { value: cleanUsername },
      field_name: { value: cleanFirst },
      field_surname: { value: cleanSurname },
      mail: { value: cleanEmail },
      field_mobile: { value: cleanMobile },

      // ✅ مثل Postman example (ثابت مؤقتًا)
      field_gender: { target_id: 9 },

      // ✅ terms selection (IDs)
      field_how_did_you_find_us: selectedHear.map((id) => ({
        target_id: Number(id),
      })),

      pass: { value: pass },
    };
  }

  function onSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (usernameTooShort) return setFormError("Username must be at least 4 characters");
    if (!cleanFirst) return setFormError("First name is required");
    if (!cleanSurname) return setFormError("Last name is required");
    if (!cleanEmail) return setFormError("Email is required");
    if (!isValidEmail(cleanEmail)) return setFormError("Please enter a valid email");
    if (mobileMissing) return setFormError("Mobile is required");
    if (mobileTooShort) return setFormError("Mobile looks too short");
    if (passTooShort) return setFormError("Password must be at least 6 characters");
    if (pass !== confirm) return setFormError("Passwords do not match");

    setIsLoading(true);

    apiRequest({
      endpoint: ApiConfig.ENDPOINTS.REGISTER,
      method: "POST",
      body: buildRegisterBody(),
      extraHeaders: {
        Accept: "application/json",
      },
    })
      .then(() => {
        setRegisterSuccessName(cleanUsername);
      })
      .catch((err) => {
        setFormError(normalizeError(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // ✅ Success screen
  if (registerSuccessName) {
    return (
      <div className="py-5">
        <Container>
          <Row>
            <Col lg={{ span: 6, offset: 3 }}>
              <div className="text-center border rounded-4 p-5 shadow-sm">
                <h2 className="mb-3">Account created 🎉</h2>
                <p className="mb-1">Hello {registerSuccessName},</p>
                <p className="mb-4">We’ve sent an activation link to your email. Please check your inbox and click the link to activate your account.</p>

                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={() => navigate("/login", { replace: true })}
                >
                  Go to Login
                </button>

                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => navigate("/", { replace: true })}
                >
                  Back to Home
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Container>
        <Row>
          <Col lg={{ span: 6, offset: 3 }}>
            <div className="d-flex align-items-center justify-content-between mt-3">
              <h1 className="m-0">Create new user</h1>
              <div>
                <span className="me-2">Have an account?</span>
                <Link to="/login">Login</Link>
              </div>
            </div>

            <br />

            {formError && <div className="alert alert-warning">{formError}</div>}

            {/* {termsError && <div className="alert alert-info">{termsError}</div>} */}

            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
                {cleanUsername && usernameTooShort && (
                  <small className="text-danger">Username must be at least 4 characters</small>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="First Name"
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="form-control"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {cleanEmail && emailInvalid && (
                  <small className="text-danger">Please enter a valid email</small>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="ex: 0501234567"
                  className="form-control"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
                {mobileMissing ? (
                  <small className="text-danger">Mobile is required</small>
                ) : mobileTooShort ? (
                  <small className="text-danger">Mobile looks too short</small>
                ) : null}
              </div>

              {/* ✅ Terms checkbox */}
              {terms.length > 0 && (
                <div className="mb-3">
                  <label className="form-label">How did you find us?</label>

                  {terms.map((term) => {
                    const idNum = Number(term.id);
                    const checked = selectedHear.includes(idNum);

                    return (
                      <div key={term.id}>
                        <input
                          type="checkbox"
                          id={`hear-${term.id}`}
                          checked={checked}
                          onChange={(e) => {
                            setSelectedHear((prev) =>
                              e.target.checked ? [...prev, idNum] : prev.filter((x) => x !== idNum)
                            );
                          }}
                        />
                        <label htmlFor={`hear-${term.id}`} className="ms-2">
                          {term.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mb-3 position-relative">
                <input
                  type={showHide.pass}
                  placeholder="Password"
                  className="form-control"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  className="position-absolute top-0 end-0 border-0 bg-transparent p-2"
                  type="button"
                  onClick={() =>
                    setShowHide((prev) => ({
                      ...prev,
                      pass: prev.pass === "password" ? "text" : "password",
                    }))
                  }
                  aria-label="Toggle password visibility"
                >
                  {showHide.pass === "password" ? <BsEyeFill /> : <BsEyeSlashFill />}
                </button>

                {pass && passTooShort && (
                  <small className="text-danger">Password must be at least 6 characters</small>
                )}
              </div>

              <div className="mb-3 position-relative">
                <input
                  type={showHide.confirm}
                  placeholder="Confirm Password"
                  className="form-control"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  className="position-absolute top-0 end-0 border-0 bg-transparent p-2"
                  type="button"
                  onClick={() =>
                    setShowHide((prev) => ({
                      ...prev,
                      confirm: prev.confirm === "password" ? "text" : "password",
                    }))
                  }
                  aria-label="Toggle confirm password visibility"
                >
                  {showHide.confirm === "password" ? <BsEyeFill /> : <BsEyeSlashFill />}
                </button>

                {confirm ? (
                  passMismatch ? (
                    <small className="text-danger">Passwords do not match</small>
                  ) : (
                    <small className="text-success">Passwords match</small>
                  )
                ) : null}
              </div>

              <div className="mb-3">
                <button className="w-100 btn btn-secondary" disabled={isDisabled}>
                  {isLoading ? <i>Creating in progress...</i> : "Create new user"}
                </button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
