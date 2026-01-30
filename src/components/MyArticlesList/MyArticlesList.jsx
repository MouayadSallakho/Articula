// src/components/MyArticlesList/MyArticlesList.jsx
import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiTrash2, FiEdit2, FiEye, FiSearch } from "react-icons/fi";

import { AuthContext } from "../../context/AuthContext";
import { toAbsUrl, deleteArticle, getCsrfToken } from "../../api/articleServices";
import { useMyArticles } from "../../hooks/useMyArticles";

import "../../pages/MyArticles.css"; // ✅ نفس الستايل بالضبط

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

/**
 * showTop:
 * - true  => يظهر العنوان + زر Create (مثل صفحة MyArticles)
 * - false => يخفي العنوان + زر Create (مفيد داخل Account tab)
 */
export default function MyArticlesList({ showTop = true }) {
  const navigate = useNavigate();
  const { isLoggedIn, username, password, csrfToken } = useContext(AuthContext);

  const {
    rows,
    pager,
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

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [deleting, setDeleting] = useState(false);

  // local filter (title only)
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
    setDeleteTarget({ id, title: title || "this article" });
    setShowDeleteModal(true);
  }
function confirmDelete() {
  if (!deleteTarget?.id) return;

  setDeleting(true);
  setError("");

  const tokenPromise = csrfToken ? Promise.resolve(csrfToken) : getCsrfToken();

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
      setRows((prev) =>
        prev.filter((x) => String(x?.id) !== String(deleteTarget.id))
      );
      setShowDeleteModal(false);
      setDeleteTarget(null);
    })
    .catch((e) => {
      setError(normalizeError(e));
    })
    .finally(() => {
      setDeleting(false);
    });
}

  return (
    <div className="myArticlesPage">
      {/* Top bar */}
      {showTop && (
        <div className="myArticlesTop">
          <div>
            <div className="myArticlesTitle">My Articles</div>
            <div className="myArticlesSub">
              This page shows only the articles you created. You can view, edit,
              or delete them.
            </div>
          </div>

          <button className="myPrimaryBtn" onClick={onCreate}>
            <FiPlus />
            <span>Create New Article</span>
          </button>
        </div>
      )}

      {/* Search + info */}
      <div className="myArticlesBar">
        <div className="myArticlesSearch">
          <FiSearch />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title..."
          />
        </div>

        <div className="myArticlesMeta">
          Page: <b>{page + 1}</b> / <b>{totalPages}</b>
          <span className="dot">•</span>
          Showing: <b>{filtered.length}</b>
        </div>

        <div className="myArticlesPerPage">
          <span>Per page</span>
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
      </div>

      {/* States */}
      {loading ? (
        <div className="myStateCard">Loading...</div>
      ) : error ? (
        <div className="myStateCard error">{error}</div>
      ) : filtered.length === 0 ? (
        rows.length === 0 ? (
          <div className="myEmpty">
            <div className="myEmptyTitle">No articles yet</div>
            <div className="myEmptySub">Create your first article now.</div>

            <button className="myPrimaryBtn" onClick={onCreate}>
              <FiPlus />
              <span>Create Article</span>
            </button>
          </div>
        ) : (
          <div className="myEmpty">
            <div className="myEmptyTitle">No results found</div>
            <div className="myEmptySub">
              We couldn’t find any article matching "<b>{q}</b>". Try another
              keyword.
            </div>

            <button className="myPagerBtn" onClick={() => setQ("")}>
              Clear search
            </button>
          </div>
        )
      ) : (
        <div className="container">
          <div className="row g-3">
            {filtered.map((a) => {
              const id = a?.id;
              const title = a?.title || "—";
              const created = String(a?.created || "").trim();
              const img = a?.field_image ? toAbsUrl(a.field_image) : "";
              const tags = Array.isArray(a?.field_tags) ? a.field_tags : [];
              const gallery = splitGallery(a?.field_gallery);

              return (
                <div className="col-12 col-md-6 col-lg-6" key={id}>
                  <div className="myArticleCard">
                    <div className="myArticleThumb">
                      {img ? (
                        <img
                          src={img}
                          alt={title}
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
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
                        <span>📅 {created || "—"}</span>
                        {gallery.length > 0 && (
                          <span>• 🖼️ {gallery.length}</span>
                        )}
                      </div>

                      <div className="myArticleExcerpt">{excerpt(a?.body)}</div>

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
                        <button className="myBtn" onClick={() => onRead(id)}>
                          <FiEye /> <span>Read</span>
                        </button>

                        <button className="myBtn" onClick={() => onEdit(id)}>
                          <FiEdit2 /> <span>Edit</span>
                        </button>

                        <button
                          className="myBtn danger"
                          onClick={() => onDelete(id, title)}
                        >
                          <FiTrash2 /> <span>Delete</span>
                        </button>

                        {/* <Link to={`/articles/${id}`} className="myLink">
                          View →
                        </Link> */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="myArticlesPagination">
          <button
            className="myPagerBtn"
            disabled={!canPrev}
            onClick={() => setPage((p) => p - 1)}
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
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content rounded-4 shadow">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm deletion</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      if (deleting) return;
                      setShowDeleteModal(false);
                      setDeleteTarget(null);
                    }}
                  />
                </div>

                <div className="modal-body">
                  <p className="mb-1">Are you sure you want to delete:</p>

                  <div className="alert alert-warning mb-0">
                    <b>{deleteTarget?.title}</b>
                  </div>

                  <small className="text-muted d-block mt-2">
                    This action cannot be undone.
                  </small>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    disabled={deleting}
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteTarget(null);
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    disabled={deleting}
                    onClick={confirmDelete}
                  >
                    {deleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
