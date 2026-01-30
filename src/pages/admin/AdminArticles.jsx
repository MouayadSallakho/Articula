// src/pages/admin/AdminArticles.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Modal,
  Button,
  Alert,
  Form,
} from "react-bootstrap";
import { FiTrash2, FiEdit2, FiEye, FiSearch, FiPlus } from "react-icons/fi";

import { AuthContext } from "../../context/AuthContext";

import { getBlogList } from "../../api/blogApi";
import { ApiConfig } from "../../api/ApiConfig";
import {
  getMyArticlesCurrentUser,
  toAbsUrl,
  deleteArticle,
  getCsrfToken,
} from "../../api/articleServices";

import "./AdminArticles.css";

/* =========================
  Helpers
========================= */
function normalizeError(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  return err.message || "Request failed";
}

function formatDate(value) {
  const s = String(value || "").trim();
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString();
}

export default function AdminArticles() {
  const navigate = useNavigate();
  const { isLoggedIn, username, password, csrfToken } = useContext(AuthContext);

  // ✅ mode: default all
  const [mode, setMode] = useState("all"); // "all" | "mine"

  // ✅ Server-side filters (only for "all")
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [sortBy] = useState("created_date");
  const [sortOrder, setSortOrder] = useState("DESC");

  // ✅ Local search (only for "mine")
  const [qLocal, setQLocal] = useState("");

  // pagination
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // data
  const [rows, setRows] = useState([]);
  const [pager, setPager] = useState(null);

  // ui state
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // filters data (cats/tags)
  const [cats, setCats] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [filtersErr, setFiltersErr] = useState("");

  // delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [deleting, setDeleting] = useState(false);

  const totalPages = Number(pager?.total_pages || 1);
  const totalItems = Number(
    pager?.total_items || (Array.isArray(rows) ? rows.length : 0) || 0
  );

  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  const isMine = mode === "mine";

  const viewRows = useMemo(() => {
    if (!isMine) return rows;

    const qq = qLocal.trim().toLowerCase();
    if (!qq) return rows;

    return (rows || []).filter((a) =>
      String(a?.title || "").toLowerCase().includes(qq)
    );
  }, [rows, isMine, qLocal]);

  const activeChips = useMemo(() => {
    const chips = [];

    if (!isMine) {
      if (search) chips.push({ key: "search", label: `Search: ${search}` });

      if (category) {
        const c = cats.find((x) => String(x.id) === String(category));
        chips.push({
          key: "category",
          label: `Category: ${c?.term_name || c?.name || category}`,
        });
      }

      if (tag) {
        const t = tags.find((x) => String(x.id) === String(tag));
        chips.push({ key: "tag", label: `Tag: ${t?.name || tag}` });
      }

      if (sortOrder !== "DESC")
        chips.push({ key: "order", label: "Order: Oldest" });

      if (itemsPerPage !== 10)
        chips.push({ key: "pp", label: `Per page: ${itemsPerPage}` });
    } else {
      if (qLocal) chips.push({ key: "local", label: `Search: ${qLocal}` });
      if (itemsPerPage !== 10)
        chips.push({ key: "pp", label: `Per page: ${itemsPerPage}` });
    }

    return chips;
  }, [isMine, search, category, tag, sortOrder, itemsPerPage, cats, tags, qLocal]);

  useEffect(() => {
    let cancelled = false;
    setLoadingFilters(true);
    setFiltersErr("");

    const catUrl = `${ApiConfig.BASE_URL_TAMKEEN}/terms/category`;
    const tagUrl = `${ApiConfig.BASE_URL_TAMKEEN}/terms/tags`;

    const fetchJson = (url, label) =>
      fetch(url, { method: "GET", headers: { Accept: "application/json" } }).then(
        (res) =>
          res.json().then((data) => {
            if (!res.ok) {
              throw new Error(`${label} failed: ${res.status} ${res.statusText}`);
            }
            return data;
          })
      );

    Promise.all([
      fetchJson(catUrl, "Categories").catch((e) => {
        if (!cancelled) setFiltersErr((prev) => prev || normalizeError(e));
        return [];
      }),
      fetchJson(tagUrl, "Tags").catch((e) => {
        if (!cancelled) setFiltersErr((prev) => prev || normalizeError(e));
        return [];
      }),
    ])
      .then(([c, t]) => {
        if (cancelled) return;
        setCats(Array.isArray(c) ? c : []);
        setTags(Array.isArray(t) ? t : []);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingFilters(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, search, category, tag, sortOrder, itemsPerPage]);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setErrMsg("");

    if (!isLoggedIn) {
      setLoading(false);
      setErrMsg("You need to log in to access admin.");
      setRows([]);
      setPager(null);
      return;
    }

    const req =
      mode === "all"
        ? getBlogList({
            page,
            itemsPerPage,
            search,
            category,
            tag,
            sortBy,
            sortOrder,
            username,
            password,
          })
        : getMyArticlesCurrentUser({
            page,
            itemsPerPage,
            username,
            password,
          });

    req
      .then((data) => {
        if (cancelled) return;
        setRows(Array.isArray(data?.rows) ? data.rows : []);
        setPager(data?.pager || null);
      })
      .catch((e) => {
        if (cancelled) return;
        setErrMsg(normalizeError(e));
        setRows([]);
        setPager(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    isLoggedIn,
    username,
    password,
    mode,
    page,
    itemsPerPage,
    search,
    category,
    tag,
    sortBy,
    sortOrder,
  ]);

  function onRead(id) {
    navigate(`/articles/${id}`);
  }

  function onEdit(id) {
    navigate(`/articles/edit/${id}`);
  }

  function onDelete(id, title) {
    setErrMsg("");
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
    setErrMsg("");

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
          (prev || []).filter((x) => String(x?.id) !== String(deleteTarget.id))
        );
        closeDeleteModal();
      })
      .catch((e) => {
        setErrMsg(normalizeError(e));
      })
      .finally(() => {
        setDeleting(false);
      });
  }

  function onReset() {
    setSearch("");
    setCategory("");
    setTag("");
    setSortOrder("DESC");
    setItemsPerPage(10);
    setPage(0);
    setQLocal("");
  }

  if (!isLoggedIn) {
    return (
      <Container className="py-4">
        <Alert variant="warning">You must login to access admin.</Alert>
      </Container>
    );
  }

  return (
    <div className="adminArticlesPage">
      <Container className="py-4">
        <Row className="mb-3">
          <Col>
            <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
              <div>
                <h2 className="m-0">Admin • Articles</h2>
                <div className="text-muted">
                  Default shows <b>All Articles</b>. Switch to <b>My Articles</b>{" "}
                  to see only current user (tamkeen). Backend enforces
                  permissions on delete/edit.
                </div>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <Form.Select
                  className="adminArticles-modeSelect"
                  value={mode}
                  onChange={(e) => {
                    setPage(0);
                    setMode(e.target.value);
                  }}
                >
                  <option value="all">All Articles</option>
                  <option value="mine">My Articles</option>
                </Form.Select>

                <Button
                  variant="primary"
                  onClick={() => navigate("/articles/create")}
                >
                  <FiPlus /> Create
                </Button>

                <Button variant="outline-secondary" onClick={onReset}>
                  Reset
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="g-2 align-items-end mb-3">
          <Col lg={4}>
            <Form.Label className="mb-1">
              {isMine ? "Search (local)" : "Search"}
            </Form.Label>

            <div className="d-flex align-items-center gap-2 border rounded px-3 py-2 bg-white adminArticles-searchBox">
              <FiSearch />
              <input
                className="adminArticles-searchInput"
                value={isMine ? qLocal : search}
                onChange={(e) =>
                  isMine ? setQLocal(e.target.value) : setSearch(e.target.value)
                }
                placeholder={
                  isMine
                    ? "Search by title (local)..."
                    : "Search by title..."
                }
              />
            </div>

            {isMine ? (
              <small className="text-muted d-block mt-1">
                In “My Articles” mode, API filters (category/tag/order) may not
                be supported, so this search is local.
              </small>
            ) : null}
          </Col>

          <Col lg={3}>
            <Form.Label className="mb-1">Category</Form.Label>
            <Form.Select
              value={category}
              disabled={loadingFilters || isMine}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.term_name || c.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col lg={3}>
            <Form.Label className="mb-1">Tag</Form.Label>
            <Form.Select
              value={tag}
              disabled={loadingFilters || isMine}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="">All Tags</option>
              {tags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col lg={2}>
            <Form.Label className="mb-1">Order</Form.Label>
            <Form.Select
              value={sortOrder}
              disabled={isMine}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="DESC">Newest</option>
              <option value="ASC">Oldest</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="g-2 align-items-center mb-3">
          <Col lg={6}>
            {activeChips.length > 0 ? (
              <div className="text-muted">
                Active: <b>{activeChips.map((x) => x.label).join(" • ")}</b>
              </div>
            ) : (
              <div className="text-muted"></div>
            )}

            {filtersErr ? (
              <div className="text-danger mt-1">{filtersErr}</div>
            ) : null}
          </Col>

          <Col lg={6} className="d-flex justify-content-lg-end gap-2 flex-wrap">
            <Form.Select
              className="adminArticles-perPageSelect"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={15}>15 / page</option>
            </Form.Select>

            <div className="d-flex align-items-center text-muted">
              Page <b className="mx-1">{page + 1}</b> /{" "}
              <b className="mx-1">{totalPages}</b> • Total{" "}
              <b className="mx-1">{totalItems}</b>
            </div>
          </Col>
        </Row>

        {errMsg ? <Alert variant="danger">{errMsg}</Alert> : null}

        {loading ? (
          <div className="p-3 bg-white rounded border">Loading...</div>
        ) : viewRows.length === 0 ? (
          <div className="p-3 bg-white rounded border">No articles.</div>
        ) : (
          <div className="table-responsive bg-white rounded border">
            <table className="table mb-0 align-middle adminArticles-table">
              <thead>
                <tr>
                  <th className="adminArticles-colId">ID</th>
                  <th className="adminArticles-colImg">Img</th>
                  <th>Title</th>
                  <th className="adminArticles-colAuthor">Author</th>
                  <th className="adminArticles-colCreated">Created</th>
                  <th className="adminArticles-colActions">Actions</th>
                </tr>
              </thead>

              <tbody>
                {viewRows.map((a) => {
                  const id = a?.id;
                  const title = a?.title || "—";
                  const author = a?.author || "Unknown";
                  const created = formatDate(a?.created);
                  const img = a?.field_image ? toAbsUrl(a.field_image) : "";

                  return (
                    <tr key={id}>
                      <td>{id}</td>

                      <td>
                        {img ? (
                          <img
                            src={img}
                            alt={title}
                            className="adminArticles-thumb"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "";
                            }}
                          />
                        ) : (
                          <div className="adminArticles-thumbPh">
                            {String(title).trim().charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>

                      <td className="text-truncate adminArticles-titleCell">
                        {title}
                      </td>

                      <td>{author}</td>
                      <td>{created}</td>

                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => onRead(id)}
                          >
                            <FiEye /> View
                          </Button>

                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => onEdit(id)}
                          >
                            <FiEdit2 /> Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => onDelete(id, title)}
                          >
                            <FiTrash2 /> Delete
                          </Button>

                          {/* <Link
                            to={`/articles/${id}`}
                            className="btn btn-sm btn-light"
                          >
                            Open
                          </Link> */}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !errMsg && totalPages > 1 ? (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button
              variant="outline-secondary"
              disabled={!canPrev}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>

            <div className="text-muted">
              Page <b>{page + 1}</b> of <b>{totalPages}</b> • Total{" "}
              <b>{totalItems}</b>
            </div>

            <Button
              variant="outline-secondary"
              disabled={!canNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        ) : null}

        <Modal
          show={showDeleteModal}
          onHide={closeDeleteModal}
          centered
          backdrop="static"
          keyboard={!deleting}
        >
          <Modal.Header closeButton={!deleting}>
            <Modal.Title>Confirm deletion</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p className="mb-1">Are you sure you want to delete:</p>
            <div className="alert alert-warning mb-0">
              <b>{deleteTarget?.title}</b>
            </div>

            <small className="text-muted d-block mt-2">
              If the article belongs to another user, backend may deny the
              action and return a permission error.
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
      </Container>
    </div>
  );
}
