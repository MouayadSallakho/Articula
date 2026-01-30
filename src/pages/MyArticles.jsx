// src/pages/MyArticles.jsx
import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiTrash2, FiEdit2, FiEye, FiSearch } from "react-icons/fi";

import { AuthContext } from "../context/AuthContext";
import { toAbsUrl, deleteArticle, getCsrfToken } from "../api/articleServices";
import { useMyArticles } from "../hooks/useMyArticles";
import Header from "../components/Header";

import { Row, Container, Col, Modal, Button, Alert } from "react-bootstrap";
import "./MyArticles.css";

function normalizeError(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  return err.message || "Request failed";
}

function excerpt(html, max = 120) {
  if (!html) return "";
  const noTags = String(html).replace(/<[^>]*>/g, "");
  const clean = noTags.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max) + "..." : clean;
}

function splitGallery(g) {
  if (!g) return [];
  return String(g)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function formatDate(value) {
  const s = String(value || "").trim();
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString();
}

export default function MyArticles() {
  const navigate = useNavigate();
  const { isLoggedIn, username, password, csrfToken } = useContext(AuthContext);

  const {
    rows,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    canPrev,
    canNext,
    loading,
    error,
    setRows,
    setError,
  } = useMyArticles({ isLoggedIn, username, password });

  const [q, setQ] = useState("");

  // delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [deleting, setDeleting] = useState(false);

  // small UX message
  const [infoMsg, setInfoMsg] = useState("");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return rows;
    return rows.filter((a) =>
      String(a?.title || "")
        .toLowerCase()
        .includes(qq)
    );
  }, [rows, q]);

  function onCreate() {
    navigate("/articles/create");
  }

  function onRead(id) {
    navigate(`/articles/${id}`);
  }

  function onEdit(id) {
    navigate(`/articles/edit/${id}`);
  }

  function onDelete(id, title) {
    setInfoMsg("");
    setDeleteTarget({ id, title: title || "this article" });
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    if (deleting) return;
    setShowDeleteModal(false);
    setDeleteTarget(null);
  }

  function confirmDelete() {
    if (!deleteTarget?.id) return;

    setDeleting(true);
    setError("");
    setInfoMsg("");

    const tokenPromise = csrfToken
      ? Promise.resolve(csrfToken)
      : getCsrfToken();

    tokenPromise
      .then((token) => {
        return deleteArticle({
          nodeId: deleteTarget.id,
          csrfToken: token,
          username,
          password,
        });
      })
      .then(() => {
        // حذف محلي سريع
        setRows((prev) =>
          prev.filter((x) => String(x?.id) !== String(deleteTarget.id))
        );

        setInfoMsg("✅ Article deleted successfully.");
        closeDeleteModal();
      })
      .catch((e) => {
        setError(normalizeError(e));
      })
      .finally(() => {
        setDeleting(false);
      });
  }

  // لو مو مسجل دخول (مع أنه ProtectedRoute غالبًا يحميها)
  if (!isLoggedIn) {
    return (
      <div>
        <Header />
        <Container className="py-4">
          <Alert variant="warning">You must login to view your articles.</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <Container>
        <Row>
          <div className="myArticlesPage">
            <div className="myArticlesTop">
              <div>
                <div className="myArticlesTitle">My Articles</div>
                <div className="myArticlesSub">
                  This page shows only the articles you created. You can view,
                  edit, or delete them.
                </div>
              </div>

              <button className="myPrimaryBtn" onClick={onCreate} type="button">
                <FiPlus />
                <span>Create New Article</span>
              </button>
            </div>

            {infoMsg && <div className="myStateCard">{infoMsg}</div>}

            <div className="myArticlesBar">
              <Row className="w-100">
                <Col lg={6} className="col-lg-6 col-md-6">
                  <div className="myArticlesSearch">
                    <FiSearch />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search by title..."
                    />
                  </div>
                </Col>

                <Col lg={6} className="d-flex right col-md-6">
                  <div className="myArticlesMeta">
                    Page: <b>{page + 1}</b> / <b>{totalPages}</b>
                    <span className="dot">•</span>
                    Showing: <b>{filtered.length}</b>
                  </div>

                  <div className="myArticlesPerPage">
                    <span>-Per page</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setPage(0);
                        setItemsPerPage(Number(e.target.value));
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                    </select>
                  </div>
                </Col>
              </Row>
            </div>

            {loading ? (
              <div className="myStateCard">Loading...</div>
            ) : error ? (
              <div className="myStateCard error">{error}</div>
            ) : filtered.length === 0 ? (
              rows.length === 0 ? (
                <div className="myEmpty">
                  <div className="myEmptyTitle">No articles yet</div>
                  <div className="myEmptySub">
                    Create your first article now.
                  </div>

                  <button
                    className="myPrimaryBtn"
                    onClick={onCreate}
                    type="button"
                  >
                    <FiPlus />
                    <span>Create Article</span>
                  </button>
                </div>
              ) : (
                <div className="myEmpty">
                  <div className="myEmptyTitle">No results found</div>
                  <div className="myEmptySub">
                    We couldn’t find any article matching "<b>{q}</b>". Try
                    another keyword.
                  </div>

                  <button
                    className="myPagerBtn"
                    onClick={() => setQ("")}
                    type="button"
                  >
                    Clear search
                  </button>
                </div>
              )
            ) : (
              <div className="row g-4">
                {filtered.map((a) => {
                  const id = a?.id;
                  const title = a?.title || "—";
                  const created = formatDate(a?.created);
                  const img = a?.field_image ? toAbsUrl(a.field_image) : "";
                  const tags = Array.isArray(a?.field_tags) ? a.field_tags : [];
                  const gallery = splitGallery(a?.field_gallery);

                  return (
                    <div className="col-12 col-md-6 col-lg-4" key={id}>
                      <div className="myArticleCard">
                        <div className="myArticleThumb">
                          {img ? (
                            <img
                              src={img}
                              alt={title}
                              onError={(e) => {
                                // يمنع loop
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "";
                              }}
                            />
                          ) : (
                            <div className="myArticleThumbPh">
                              {String(title).trim().charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="myArticleBody">
                          <div className="myArticleTitle">{title}</div>

                          <div className="myArticleMetaLine">
                            <span>📅 {created}</span>
                            {gallery.length > 0 && (
                              <span>• 🖼️ {gallery.length}</span>
                            )}
                          </div>

                          <div className="myArticleExcerpt">
                            {excerpt(a?.body)}
                          </div>

                          {tags.length > 0 && (
                            <div className="myArticleTags">
                              {tags.slice(0, 4).map((t, i) => (
                                <span className="myTag" key={i}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="myArticleActions">
                            <button
                              className="myBtn"
                              onClick={() => onRead(id)}
                              type="button"
                            >
                              <FiEye /> <span>Read</span>
                            </button>

                            <button
                              className="myBtn"
                              onClick={() => onEdit(id)}
                              type="button"
                            >
                              <FiEdit2 /> <span>Edit</span>
                            </button>

                            <button
                              className="myBtn danger"
                              onClick={() => onDelete(id, title)}
                              type="button"
                            >
                              <FiTrash2 /> <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && !error && totalPages > 1 && (
              <div className="myArticlesPagination">
                <button
                  className="myPagerBtn"
                  disabled={!canPrev}
                  onClick={() => setPage((p) => p - 1)}
                  type="button"
                >
                  Prev
                </button>

                <div className="myPagerInfo">
                  Page <b>{page + 1}</b> of <b>{totalPages}</b>
                </div>

                <button
                  className="myPagerBtn"
                  disabled={!canNext}
                  onClick={() => setPage((p) => p + 1)}
                  type="button"
                >
                  Next
                </button>
              </div>
            )}

            {/* ✅ Modal (Styled) */}
            <Modal
              show={showDeleteModal}
              onHide={closeDeleteModal}
              centered
              backdrop="static"
              keyboard={!deleting}
              dialogClassName="myDeleteModal"
              contentClassName="myDeleteModalContent"
              backdropClassName="myDeleteBackdrop"
            >
              <Modal.Header closeButton={!deleting}>
                <Modal.Title>Confirm deletion</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p className="mb-1">Are you sure you want to delete:</p>

                <div className="alert alert-warning mb-0 myDeleteWarning">
                  <b>{deleteTarget?.title}</b>
                </div>

                <small className="text-muted d-block mt-2">
                  This action cannot be undone.
                </small>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="light"
                  disabled={deleting}
                  onClick={closeDeleteModal}
                >
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  disabled={deleting}
                  onClick={confirmDelete}
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Row>
      </Container>
    </div>
  );
}
