// src/pages/admin/AdminDashboard.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Button, Alert, Badge, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiFileText, FiPlus, FiRefreshCw, FiEye, FiShield, FiClock } from "react-icons/fi";

import { AuthContext } from "../../context/AuthContext";

import { getBlogList } from "../../api/blogApi";
import { getMyArticlesCurrentUser, toAbsUrl } from "../../api/articleServices";
import { getUsersList } from "../../api/userServices";


import Header from "../../components/Header";
import "./AdminDashboard.css";

/* =========================
   Helpers
========================= */
function normalizeError(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  return err.message || "Request failed";
}

function stripTags(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, "").trim();
}

function extractImgSrc(html) {
  if (!html) return "";
  const s = String(html);
  const m = s.match(/src="([^"]+)"/i);
  return m ? m[1] : "";
}

function extractDatetime(html) {
  if (!html) return "";
  const s = String(html);
  const m = s.match(/datetime="([^"]+)"/i);
  return m ? m[1] : "";
}

function fmtDate(value) {
  const s = String(value || "").trim();
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString();
}

function safeNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * ✅ يوحّد أي Response لشكل:
 * { rows: [], pager: {}, raw: ... }
 */
function normalizeApiShape(raw) {
  if (!raw) return { rows: [], pager: null, raw: raw };

  // لو رجع string
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return normalizeApiShape(parsed);
    } catch {
      return { rows: [], pager: null, raw: raw };
    }
  }

  // unwrap common wrappers: data / result
  const unwrapped = raw?.data ? raw.data : raw?.result ? raw.result : raw;

  const rows =
    Array.isArray(unwrapped?.rows) ? unwrapped.rows :
    Array.isArray(unwrapped?.items) ? unwrapped.items :
    Array.isArray(unwrapped) ? unwrapped :
    [];

  const pager = unwrapped?.pager || unwrapped?.meta || unwrapped?.pagination || null;

  return { rows, pager, raw: unwrapped };
}

/**
 * ✅ يجيب total من عدة أماكن محتملة
 */
function getTotalItems(rawObj, pagerObj, rowsArr) {
  // 1) داخل pager
  const fromPager =
    pagerObj?.total_items ??
    pagerObj?.totalItems ??
    pagerObj?.total ??
    pagerObj?.total_count ??
    pagerObj?.totalCount ??
    pagerObj?.count ??
    pagerObj?.items_count;

  if (fromPager !== undefined && fromPager !== null && String(fromPager) !== "") {
    return safeNumber(fromPager, rowsArr?.length || 0);
  }

  // 2) على مستوى أعلى
  const fromRoot =
    rawObj?.total_items ??
    rawObj?.total ??
    rawObj?.total_count ??
    rawObj?.count;

  if (fromRoot !== undefined && fromRoot !== null && String(fromRoot) !== "") {
    return safeNumber(fromRoot, rowsArr?.length || 0);
  }

  // 3) fallback
  return rowsArr?.length || 0;
}

/**
 * ✅ ترتيب عام حسب created (سواء datetime أو نص داخل time tag)
 */
function sortByCreatedDesc(list) {
  const arr = Array.isArray(list) ? [...list] : [];
  arr.sort((a, b) => {
    const da = new Date(extractDatetime(a?.created) || stripTags(a?.created) || 0).getTime();
    const db = new Date(extractDatetime(b?.created) || stripTags(b?.created) || 0).getTime();
    return db - da;
  });
  return arr;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, username, password } = useContext(AuthContext);

  const isAdmin = useMemo(() => {
    return String(username || "").trim().toLowerCase() === "tamkeen";
  }, [username]);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // KPIs
  const [totalArticles, setTotalArticles] = useState(0);
  const [myArticles, setMyArticles] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  // Lists
  const [recentArticles, setRecentArticles] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  const [lastUpdated, setLastUpdated] = useState("");

  function fetchDashboard() {
    setLoading(true);
    setErrMsg("");

    const allArticlesReq = getBlogList({
      page: 0,
      itemsPerPage: 6,
      search: "",
      category: "",
      tag: "",
      sortBy: "created_date",
      sortOrder: "DESC",
      username,
      password,
    });

    const myArticlesReq = getMyArticlesCurrentUser({
      page: 0,
      itemsPerPage: 1,
      username,
      password,
    });

    const allUsersReq = getUsersList({
      page: 0,
      itemsPerPage: 1,
      name: "",
      field_name: "",
      field_surname: "",
      mail: "",
      field_gender: "",
      status: "",
      username,
      password,
    });

    const activeUsersReq = getUsersList({
      page: 0,
      itemsPerPage: 6,
      name: "",
      field_name: "",
      field_surname: "",
      mail: "",
      field_gender: "",
      status: "1",
      username,
      password,
    });

    return Promise.allSettled([allArticlesReq, myArticlesReq, allUsersReq, activeUsersReq])
      .then((results) => {
        const [rArticles, rMine, rUsersAll, rUsersActive] = results;

        let anyFail = false;
        let failMsg = "";

        // ✅ Articles
        if (rArticles.status === "fulfilled") {
          const { rows, pager, raw } = normalizeApiShape(rArticles.value);
          const total = getTotalItems(raw, pager, rows);
          setTotalArticles(total);

          const sorted = sortByCreatedDesc(rows);
          setRecentArticles(sorted.slice(0, 6));
        } else {
          anyFail = true;
          failMsg = normalizeError(rArticles.reason);
          setTotalArticles(0);
          setRecentArticles([]);
        }

        // ✅ My Articles
        if (rMine.status === "fulfilled") {
          const { rows, pager, raw } = normalizeApiShape(rMine.value);
          const total = getTotalItems(raw, pager, rows);
          setMyArticles(total);
        } else {
          anyFail = true;
          if (!failMsg) failMsg = normalizeError(rMine.reason);
          setMyArticles(0);
        }

        // ✅ Total Users
        if (rUsersAll.status === "fulfilled") {
          const { rows, pager, raw } = normalizeApiShape(rUsersAll.value);
          const total = getTotalItems(raw, pager, rows);
          setTotalUsers(total);
        } else {
          anyFail = true;
          if (!failMsg) failMsg = normalizeError(rUsersAll.reason);
          setTotalUsers(0);
        }

        // ✅ Active Users
        if (rUsersActive.status === "fulfilled") {
          const { rows, pager, raw } = normalizeApiShape(rUsersActive.value);
          const total = getTotalItems(raw, pager, rows);
          setActiveUsers(total);

          const sorted = sortByCreatedDesc(rows);
          setRecentUsers(sorted.slice(0, 6));
        } else {
          anyFail = true;
          if (!failMsg) failMsg = normalizeError(rUsersActive.reason);
          setActiveUsers(0);
          setRecentUsers([]);
        }

        if (anyFail) setErrMsg(failMsg || "Some data failed to load.");
        else setErrMsg("");

        setLastUpdated(new Date().toLocaleString());
      })
      .catch((e) => {
        setErrMsg(normalizeError(e));
        setTotalArticles(0);
        setMyArticles(0);
        setTotalUsers(0);
        setActiveUsers(0);
        setRecentArticles([]);
        setRecentUsers([]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!isLoggedIn) return;
    if (!isAdmin) return;
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isAdmin, username, password]);

  if (!isLoggedIn) {
    return (
      <div>
        <Header />
        <Container className="py-4">
          <Alert variant="warning">You must login to access admin.</Alert>
        </Container>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div>
        <Header />
        <Container className="py-4">
          <Alert variant="danger">
            Access denied. Admin dashboard is only for <b>tamkeen</b>.
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="adminDashPage">
      {/* <Header /> */}

      <Container className="py-4">
        {/* Top Bar */}
        <div className="adminDashTop">
          <div>
            <div className="adminDashTitle">
              Admin Dashboard{" "}
              <Badge bg="success" className="ms-2 adminBadge">
                <FiShield /> Admin
              </Badge>
            </div>

            <div className="adminDashSub">
              Overview of articles and users — quick actions and recent activity.
            </div>

            <div className="adminDashMeta">
              <FiClock />
              <span>{lastUpdated ? `Last updated: ${lastUpdated}` : "—"}</span>
            </div>
          </div>

          <div className="adminDashActions">
            <Button className="btnSoftPrimary" onClick={() => navigate("/articles/create")}>
              <FiPlus /> Create Article
            </Button>

            <Button
              variant="outline-secondary"
              onClick={fetchDashboard}
              disabled={loading}
              className="btnSoft"
            >
              {loading ? <Spinner size="sm" /> : <FiRefreshCw />} Refresh
            </Button>
          </div>
        </div>

        {errMsg ? <Alert variant="danger">{errMsg}</Alert> : null}

        {/* KPI Cards */}
        <Row className="g-3">
          <Col md={6} lg={3}>
            <div className="kpiCard">
              <div className="kpiIcon"><FiFileText /></div>
              <div className="kpiBody">
                <div className="kpiLabel">Total Articles</div>
                <div className="kpiValue">{loading ? <span className="kpiDots">…</span> : totalArticles}</div>
              </div>
              <button className="kpiLink" type="button" onClick={() => navigate("/admin/articles")}>Manage</button>
            </div>
          </Col>

          <Col md={6} lg={3}>
            <div className="kpiCard">
              <div className="kpiIcon"><FiEye /></div>
              <div className="kpiBody">
                <div className="kpiLabel">My Articles</div>
                <div className="kpiValue">{loading ? <span className="kpiDots">…</span> : myArticles}</div>
              </div>
              <button className="kpiLink" type="button" onClick={() => navigate("/my-articles")}>Open</button>
            </div>
          </Col>

          <Col md={6} lg={3}>
            <div className="kpiCard">
              <div className="kpiIcon"><FiUsers /></div>
              <div className="kpiBody">
                <div className="kpiLabel">Total Users</div>
                <div className="kpiValue">{loading ? <span className="kpiDots">…</span> : totalUsers}</div>
              </div>
              <button className="kpiLink" type="button" onClick={() => navigate("/admin/users")}>View</button>
            </div>
          </Col>

          <Col md={6} lg={3}>
            <div className="kpiCard">
              <div className="kpiIcon"><FiUsers /></div>
              <div className="kpiBody">
                <div className="kpiLabel">Active Users</div>
                <div className="kpiValue">{loading ? <span className="kpiDots">…</span> : activeUsers}</div>
              </div>
              <button className="kpiLink" type="button" onClick={() => navigate("/admin/users")}>Filter</button>
            </div>
          </Col>
        </Row>


                {/* Quick Links */}
        <Row className="g-3 mt-1">
          <Col lg={12}>
            <div className="dashPanel">
              <div className="dashPanelHead">
                <div>
                  <div className="dashPanelTitle">Quick Actions</div>
                  <div className="dashPanelSub">Common admin shortcuts</div>
                </div>
              </div>

              <div className="dashQuickGrid">
                <button className="dashQuickBtn" onClick={() => navigate("/articles/create")} type="button">
                  <FiPlus /> Create new article
                </button>

                <button className="dashQuickBtn" onClick={() => navigate("/admin/articles")} type="button">
                  <FiFileText /> Manage articles
                </button>

                <button className="dashQuickBtn" onClick={() => navigate("/admin/users")} type="button">
                  <FiUsers /> Manage users
                </button>

                <button className="dashQuickBtn" onClick={() => navigate("/my-articles")} type="button">
                  <FiEye /> My articles
                </button>
              </div>
            </div>
          </Col>
        </Row>

        

        {/* Content */}
        <Row className="g-3 mt-1">
          {/* Recent Articles */}
          <Col lg={7}>
            <div className="dashPanel">
              <div className="dashPanelHead">
                <div>
                  <div className="dashPanelTitle">Recent Articles</div>
                  <div className="dashPanelSub">Latest published articles</div>
                </div>

                <Button
                  size="sm"
                  variant="outline-primary"
                  className="btnSoft"
                  onClick={() => navigate("/admin/articles")}
                >
                  View all
                </Button>
              </div>

              {loading ? (
                <div className="dashState">Loading…</div>
              ) : recentArticles.length === 0 ? (
                <div className="dashState">No articles yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0 dashTable">
                    <thead>
                      <tr>
                        <th className="dashColImg">Img</th>
                        <th>Title</th>
                        <th className="dashColAuthor">Author</th>
                        <th className="dashColDate">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentArticles.map((a) => {
                        const img = a?.field_image ? toAbsUrl(a.field_image) : "";
                        const title = a?.title || "—";
                        return (
                          <tr
                            key={String(a?.id)}
                            className="dashRowClickable"
                            onClick={() => navigate(`/articles/${a?.id}`)}
                          >
                            <td>
                              {img ? (
                                <img
                                  src={img}
                                  alt={title}
                                  className="dashThumb"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "";
                                  }}
                                />
                              ) : (
                                <div className="dashThumbPh">
                                  {(String(title).trim()[0] || "A").toUpperCase()}
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="dashTitleText">{title}</div>
                              <div className="dashSmall">ID: <b>{a?.id}</b></div>
                            </td>
                            <td>{a?.author || "Unknown"}</td>
                            <td>{fmtDate(a?.created)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Col>

          {/* Recent Users */}
          <Col lg={5}>
            <div className="dashPanel">
              <div className="dashPanelHead">
                <div>
                  <div className="dashPanelTitle">Recent Active Users</div>
                  <div className="dashPanelSub">Latest active accounts</div>
                </div>

                <Button
                  size="sm"
                  variant="outline-primary"
                  className="btnSoft"
                  onClick={() => navigate("/admin/users")}
                >
                  View all
                </Button>
              </div>

              {loading ? (
                <div className="dashState">Loading…</div>
              ) : recentUsers.length === 0 ? (
                <div className="dashState">No users found.</div>
              ) : (
                <div className="dashUserList">
                  {recentUsers.map((u) => {
                    const src = extractImgSrc(u?.user_picture);
                    const img = src ? toAbsUrl(src) : "";
                    const display = u?.name || "User";
                    const email = u?.mail || "—";

                    const createdISO = extractDatetime(u?.created);
                    const createdText = createdISO ? fmtDate(createdISO) : stripTags(u?.created) || "—";

                    return (
                      <div className="dashUserRow" key={String(u?.uid)}>
                        <div className="dashUserAvatar">
                          {img ? (
                            <img
                              src={img}
                              alt={display}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "";
                              }}
                            />
                          ) : (
                            <span>{(String(display).trim()[0] || "U").toUpperCase()}</span>
                          )}
                        </div>

                        <div className="dashUserInfo">
                          <div className="dashUserName">{display}</div>
                          <div className="dashSmall">{email}</div>
                          <div className="dashSmall">Created: <b>{createdText}</b></div>
                        </div>

                        <div className="dashUserMeta">
                          <Badge bg="success">Active</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Col>
        </Row>


      </Container>
    </div>
  );
}
