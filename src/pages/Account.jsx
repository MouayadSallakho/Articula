// src/pages/Account.jsx
import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import { getCsrfToken } from "../api/articleServices";
import Header from "../components/Header";

import {
  FiUser,
  FiFileText,
  FiHeart,
  FiLogOut,
  FiCamera,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";

import { AuthContext } from "../context/AuthContext";
import { apiRequest, uploadOctetStream } from "../api/request";
import { ApiConfig } from "../api/ApiConfig";

import MyArticlesList from "../components/MyArticlesList/MyArticlesList";

import "./Account.css";

function normalizeError(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err.message) return err.message;
  try {
    return JSON.stringify(err, null, 2);
  } catch {
    return "Something went wrong";
  }
}

function pickUid(currentUser) {
  const uid =
    currentUser?.uid ??
    currentUser?.id ??
    currentUser?.user_id ??
    currentUser?.uuid ??
    null;

  const n = Number(uid);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export default function Account() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { currentUser, username, password, csrfToken, logout } =
    useContext(AuthContext);

  const uid = useMemo(() => pickUid(currentUser), [currentUser]);

  const [active, setActive] = useState("profile"); // profile | articles | favorites

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  // form state
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [mobile, setMobile] = useState("");

  const email = profile?.mail?.[0]?.value || "";
  const usernameDisplay =
    profile?.name?.[0]?.value || currentUser?.name || "User";

  const avatarUrl = profile?.user_picture?.[0]?.url || null;

  function getInitial() {
    const first = (firstName || "").trim();
    const name = (usernameDisplay || "").trim();
    const letter = (first[0] || name[0] || "U").toUpperCase();
    return letter;
  }

  function safeLogoutAndGoLogin() {
    return logout()
      .catch(() => {})
      .finally(() => {
        navigate("/login", { replace: true });
      });
  }

  function loadProfile() {
    setProfileError("");
    setLoadingProfile(true);

    if (!uid) {
      safeLogoutAndGoLogin();
      return;
    }

    const endpoint = `${ApiConfig.ENDPOINTS.USER}/${uid}?_format=json`;

    apiRequest({
      endpoint,
      method: "GET",
      username,
      password,
      extraHeaders: { Accept: "application/json" },
    })
      .then((data) => {
        setProfile(data);

        setFirstName(data?.field_name?.[0]?.value ?? "");
        setSurname(data?.field_surname?.[0]?.value ?? "");
        setMobile(data?.field_mobile?.[0]?.value ?? "");

        setIsEditing(false);
      })
      .catch((e) => {
        const msg = normalizeError(e);
        setProfileError(msg);

        if (/401|403/i.test(msg)) safeLogoutAndGoLogin();
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  }

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  function onStartEdit() {
    setSaveMsg("");
    setUploadMsg("");
    setIsEditing(true);
  }

  function onCancelEdit() {
    setFirstName(profile?.field_name?.[0]?.value ?? "");
    setSurname(profile?.field_surname?.[0]?.value ?? "");
    setMobile(profile?.field_mobile?.[0]?.value ?? "");
    setSaveMsg("");
    setUploadMsg("");
    setIsEditing(false);
  }

  function onSaveProfile() {
    setSaveMsg("");
    setProfileError("");

    const cleanFirst = firstName.trim();
    const cleanSur = surname.trim();
    const cleanMobile = (mobile || "").replace(/[^\d]/g, "");

    if (!cleanFirst) return setSaveMsg("First name is required.");
    if (!cleanSur) return setSaveMsg("Last name is required.");
    if (!cleanMobile || cleanMobile.length < 7)
      return setSaveMsg("Mobile number looks invalid.");

    setSaving(true);

    const endpoint = `${ApiConfig.ENDPOINTS.USER}/${uid}?_format=json`;

    const body = {
      field_name: [{ value: cleanFirst }],
      field_surname: [{ value: cleanSur }],
      field_mobile: [{ value: cleanMobile }],
    };

    const tokenPromise = csrfToken
      ? Promise.resolve(csrfToken)
      : getCsrfToken();

    tokenPromise
      .then((token) => {
        return apiRequest({
          endpoint,
          method: "PATCH",
          body,
          username,
          password,
          extraHeaders: {
            Accept: "application/json",
            "X-CSRF-Token": token,
          },
        });
      })
      .then(() => {
        setSaveMsg("Profile updated successfully ✅");
        loadProfile();
        setIsEditing(false);
      })
      .catch((e) => {
        setSaveMsg(`Update failed: ${normalizeError(e)}`);
      })
      .finally(() => {
        setSaving(false);
        setTimeout(() => setSaveMsg(""), 3500);
      });
  }

  function onChooseAvatar(file) {
    setUploadMsg("");
    if (!file) return;

    const isImage = file.type?.startsWith("image/");
    if (!isImage) {
      setUploadMsg("Please select an image file (png/jpg/webp).");
      return;
    }

    setUploading(true);

    const tokenPromise = csrfToken
      ? Promise.resolve(csrfToken)
      : getCsrfToken();

    tokenPromise
      .then((token) => {
        return uploadOctetStream({
          endpoint: ApiConfig.ENDPOINTS.UPLOAD_USER_PICTURE,
          file,
          filename: file.name,
          username,
          password,
          csrfToken: token,
        }).then((uploadRes) => ({ uploadRes, token }));
      })
      .then(({ uploadRes, token }) => {
        const fid = uploadRes?.fid?.[0]?.value;
        if (!fid) throw new Error("Upload succeeded but fid not found.");

        const endpoint = `${ApiConfig.ENDPOINTS.USER}/${uid}?_format=json`;

        return apiRequest({
          endpoint,
          method: "PATCH",
          body: { user_picture: [{ target_id: fid }] },
          username,
          password,
          extraHeaders: {
            Accept: "application/json",
            "X-CSRF-Token": token,
          },
        });
      })
      .then(() => {
        setUploadMsg("Picture updated ✅");
        loadProfile();
      })
      .catch((e) => {
        setUploadMsg(`Upload failed: ${normalizeError(e)}`);
      })
      .finally(() => {
        setUploading(false);
        setTimeout(() => setUploadMsg(""), 3500);
      });
  }

  return (
    <div className="ssdsd">
      <Header />

      <div className="acc-shell">
        <Container>
          {/* ✅ Responsive spacing + clean stacking */}
          <Row className="g-4">
            {/* ✅ Sidebar first on mobile, normal on desktop */}
            <Col lg={4} className="order-1 order-lg-1">
              <aside className="acc-sidebar">
                <div className="acc-brand">
                  <div className="acc-brandLogo">T</div>
                  <div className="acc-brandText">
                    <div className="acc-brandTitle">My Account</div>
                    <div className="acc-brandSub">
                      {usernameDisplay || "User"}
                    </div>
                  </div>
                </div>

                <nav className="acc-nav">
                  <button
                    className={`acc-navItem ${
                      active === "profile" ? "isActive" : ""
                    }`}
                    onClick={() => setActive("profile")}
                    type="button"
                  >
                    <FiUser />
                    <span>Account Info</span>
                  </button>

                  <button
                    className={`acc-navItem ${
                      active === "articles" ? "isActive" : ""
                    }`}
                    onClick={() => setActive("articles")}
                    type="button"
                  >
                    <FiFileText />
                    <span>My Articles</span>
                  </button>

                  <button
                    className={`acc-navItem ${
                      active === "favorites" ? "isActive" : ""
                    }`}
                    onClick={() => setActive("favorites")}
                    type="button"
                  >
                    <FiHeart />
                    <span>Favorites</span>
                  </button>
                </nav>

                <div className="acc-sideFooter">
                  <button
                    className="acc-logout"
                    onClick={safeLogoutAndGoLogin}
                    type="button"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </aside>
            </Col>

            <Col lg={8} className="order-2 order-lg-2">
              <main className="acc-main">
                <header className="acc-topbar">
                  <div className="acc-topTitle">
                    {active === "profile"
                      ? "Account Information"
                      : active === "articles"
                      ? "My Articles"
                      : "My Favorites"}
                  </div>

                  <div className="acc-topActions">
                    <button
                      className="acc-pill"
                      onClick={() => navigate("/", { replace: false })}
                      type="button"
                    >
                      Back Home
                    </button>
                  </div>
                </header>

                <section className="acc-content">
                  {loadingProfile ? (
                    <div className="acc-card acc-skeleton">
                      <div className="sk-line w60" />
                      <div className="sk-line w85" />
                      <div className="sk-line w75" />
                      <div className="sk-line w90" />
                    </div>
                  ) : profileError ? (
                    <div className="acc-card acc-error">
                      <div className="acc-msg">
                        <FiAlertTriangle />
                        <div>
                          <div className="acc-msgTitle">
                            Could not load profile
                          </div>
                          <div className="acc-msgText">{profileError}</div>
                        </div>
                      </div>
                      <button
                        className="acc-btn"
                        onClick={loadProfile}
                        type="button"
                      >
                        Retry
                      </button>
                    </div>
                  ) : active === "profile" ? (
                    <div className="acc-grid">
                      <div className="acc-card acc-profileCard">
                        <div className="acc-profileHead">
                          <div className="acc-avatarWrap">
                            {avatarUrl ? (
                              <img
                                className="acc-avatar"
                                src={avatarUrl}
                                alt="avatar"
                              />
                            ) : (
                              <div
                                className="acc-avatar acc-avatarInitial"
                                aria-label="avatar-initial"
                              >
                                {getInitial()}
                              </div>
                            )}

                            <button
                              className={`acc-avatarBtn ${
                                isEditing ? "" : "isDisabled"
                              }`}
                              type="button"
                              onClick={() =>
                                isEditing && fileInputRef.current?.click()
                              }
                              disabled={!isEditing || uploading}
                              title={
                                isEditing
                                  ? "Change picture"
                                  : "Click Edit to change picture"
                              }
                            >
                              <FiCamera />
                            </button>

                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="acc-file"
                              onChange={(e) =>
                                onChooseAvatar(e.target.files?.[0])
                              }
                            />
                          </div>

                          <div className="acc-profileMeta">
                            <div className="acc-name">{usernameDisplay}</div>
                            <div className="acc-sub">{email || "No email"}</div>

                            {uploadMsg && (
                              <div className="acc-toast">
                                <FiCheckCircle />
                                <span>{uploadMsg}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="acc-form">
                          <div className="acc-row">
                            <div className="acc-field">
                              <label>First Name</label>
                              <input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First name"
                                disabled={!isEditing}
                              />
                            </div>

                            <div className="acc-field">
                              <label>Last Name</label>
                              <input
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                placeholder="Last name"
                                disabled={!isEditing}
                              />
                            </div>
                          </div>

                          <div className="acc-row">
                            <div className="acc-field">
                              <label>Mobile</label>
                              <input
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="ex: 0501234567"
                                disabled={!isEditing}
                              />
                            </div>

                            <div className="acc-field">
                              <label>Email (read only)</label>
                              <input value={email} readOnly disabled />
                            </div>
                          </div>

                          {saveMsg && (
                            <div className="acc-inlineMsg">
                              <FiCheckCircle />
                              <span>{saveMsg}</span>
                            </div>
                          )}

                          <div className="acc-actions">
                            {!isEditing ? (
                              <button
                                className="acc-btn acc-primary"
                                onClick={onStartEdit}
                                type="button"
                              >
                                Edit Profile
                              </button>
                            ) : (
                              <>
                                <button
                                  className="acc-btn acc-primary"
                                  onClick={onSaveProfile}
                                  disabled={saving}
                                  type="button"
                                >
                                  {saving ? "Saving..." : "Save Changes"}
                                </button>

                                <button
                                  className="acc-btn"
                                  onClick={onCancelEdit}
                                  disabled={saving}
                                  type="button"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : active === "articles" ? (
                    <MyArticlesList showTop={false} />
                  ) : (
                    <div className="acc-card">
                      <div className="acc-sectionTitle">Favorites</div>
                      <div className="acc-sectionText">
                       .........................................
                      </div>
   
                    </div>
                  )}
                </section>
              </main>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
