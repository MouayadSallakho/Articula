// src/pages/BlogList.jsx
import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ApiConfig } from "../api/ApiConfig";
import { getBlogList, toAbsUrl } from "../api/blogApi";
import { FaArrowRightLong } from "react-icons/fa6";
import { RiFilter3Fill } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import Header from "../components/Header";
import "./BlogList.css";

/* ---------------- Helpers ---------------- */
function excerpt(text, max = 160) {
  if (!text) return "";
  const noTags = String(text).replace(/<[^>]*>/g, "");
  const clean = noTags.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max) + "..." : clean;
}

function normalizeError(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  return err.message || "Request failed";
}

function safeInt(v, fallback) {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function fmtDate(value) {
  const s = String(value || "").trim();
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString();
}

/* ---------------- Persist + URL Sync ---------------- */
const STORAGE_KEY = "blogListFilters:v1";

const DEFAULTS = {
  search: "",
  category: "",
  tag: "",
  sortBy: "created_date",
  sortOrder: "DESC",
  itemsPerPage: 5,
  page: 0,
};

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    return { ...DEFAULTS, ...obj };
  } catch {
    return null;
  }
}

function writeToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function hasUrlFilters(sp) {
  return [
    "search",
    "category",
    "tag",
    "sort_by",
    "sort_order",
    "items_per_page",
    "page",
  ].some((k) => sp.has(k));
}

function readFromUrl(sp) {
  return {
    search: sp.get("search") || DEFAULTS.search,
    category: sp.get("category") || DEFAULTS.category,
    tag: sp.get("tag") || DEFAULTS.tag,
    sortBy: sp.get("sort_by") || DEFAULTS.sortBy,
    sortOrder: sp.get("sort_order") || DEFAULTS.sortOrder,
    itemsPerPage: safeInt(sp.get("items_per_page"), DEFAULTS.itemsPerPage),
    page: safeInt(sp.get("page"), DEFAULTS.page),
  };
}

/* ---------------- Page ---------------- */
export default function BlogList() {
  const navigate = useNavigate();

  const [filtersOpen, setFiltersOpen] = useState(false);
  function closeFilters() {
    setFiltersOpen(false);
  }

  const { isLoggedIn, username, password } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // Blog filters
  const [search, setSearch] = useState(DEFAULTS.search);
  const [category, setCategory] = useState(DEFAULTS.category);
  const [tag, setTag] = useState(DEFAULTS.tag);
  const [sortBy, setSortBy] = useState(DEFAULTS.sortBy);
  const [sortOrder, setSortOrder] = useState(DEFAULTS.sortOrder);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULTS.itemsPerPage);

  // Pagination
  const [page, setPage] = useState(DEFAULTS.page);

  // Blog Data
  const [rows, setRows] = useState([]);
  const [pager, setPager] = useState(null);

  // UI Blog state
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // Categories / Tags
  const [cats, setCats] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [filtersErr, setFiltersErr] = useState("");

  const totalPages = Number(pager?.total_pages || 1);
  const totalItems = Number(pager?.total_items || 0);

  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  // refs لمنع تأثيرات أول تحميل
  const initDoneRef = useRef(false);
  const skipResetPageOnInitRef = useRef(true);

  // lock scroll عند فتح filters sheet بالموبايل
  useEffect(() => {
    if (!filtersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [filtersOpen]);

  /* ---------------- Init from URL or LocalStorage ---------------- */
  useEffect(() => {
    const initial = hasUrlFilters(searchParams)
      ? readFromUrl(searchParams)
      : readFromStorage();

    if (initial) {
      setSearch(initial.search);
      setCategory(initial.category);
      setTag(initial.tag);
      setSortBy(initial.sortBy);
      setSortOrder(initial.sortOrder);
      setItemsPerPage(initial.itemsPerPage);
      setPage(initial.page);
    }

    initDoneRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- لما يتغير أي فلتر → رجع للصفحة الأولى (لكن ليس في أول تحميل) ---------------- */
  useEffect(() => {
    if (skipResetPageOnInitRef.current) {
      skipResetPageOnInitRef.current = false;
      return;
    }
    setPage(0);
  }, [search, category, tag, sortBy, sortOrder, itemsPerPage]);

  /* ---------------- Sync: LocalStorage + URL ---------------- */
  useEffect(() => {
    if (!initDoneRef.current) return;

    const stateToSave = {
      search,
      category,
      tag,
      sortBy,
      sortOrder,
      itemsPerPage,
      page,
    };
    writeToStorage(stateToSave);

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);

    if (sortBy && sortBy !== DEFAULTS.sortBy) params.set("sort_by", sortBy);
    if (sortOrder && sortOrder !== DEFAULTS.sortOrder)
      params.set("sort_order", sortOrder);

    if (itemsPerPage !== DEFAULTS.itemsPerPage)
      params.set("items_per_page", String(itemsPerPage));
    if (page !== DEFAULTS.page) params.set("page", String(page));

    const newQs = params.toString();
    const currentQs = searchParams.toString();
    if (newQs !== currentQs) setSearchParams(params, { replace: true });
  }, [
    search,
    category,
    tag,
    sortBy,
    sortOrder,
    itemsPerPage,
    page,
    setSearchParams,
    searchParams,
  ]);

  /* ---------------- Load Categories + Tags (No Auth) ✅ FIXED ---------------- */
  useEffect(() => {
    let cancelled = false;
    setLoadingFilters(true);
    setFiltersErr("");

    const catUrl = `${ApiConfig.BASE_URL_TAMKEEN}/terms/category`;
    const tagUrl = `${ApiConfig.BASE_URL_TAMKEEN}/terms/tags`;

    const fetchJson = (url, label) =>
      fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      }).then((res) =>
        res.json().then((data) => {
          if (!res.ok)
            throw new Error(`${label} failed: ${res.status} ${res.statusText}`);
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

  /* ---------------- Load Blog List (needs Basic Auth) ---------------- */
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setErrMsg("");

    if (!isLoggedIn) {
      setLoading(false);
      setErrMsg("You need to log in to view the articles.");
      setRows([]);
      setPager(null);
      return;
    }

    getBlogList({
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
    page,
    itemsPerPage,
    search,
    category,
    tag,
    sortBy,
    sortOrder,
  ]);

  function onReset() {
    setSearch(DEFAULTS.search);
    setCategory(DEFAULTS.category);
    setTag(DEFAULTS.tag);
    setSortBy(DEFAULTS.sortBy);
    setSortOrder(DEFAULTS.sortOrder);
    setItemsPerPage(DEFAULTS.itemsPerPage);
    setPage(DEFAULTS.page);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    setSearchParams({}, { replace: true });
  }

  const categoryLabel = useMemo(() => {
    if (!category) return "";
    const c = cats.find((x) => String(x.id) === String(category));
    return c?.term_name || c?.name || `Category ${category}`;
  }, [category, cats]);

  const tagLabel = useMemo(() => {
    if (!tag) return "";
    const t = tags.find((x) => String(x.id) === String(tag));
    return t?.name || `Tag ${tag}`;
  }, [tag, tags]);

  const activeChips = useMemo(() => {
    const chips = [];

    if (search)
      chips.push({
        key: "search",
        label: `Search : ${search}`,
        onRemove: () => setSearch(""),
      });
    if (category)
      chips.push({
        key: "category",
        label: `category : ${categoryLabel}`,
        onRemove: () => setCategory(""),
      });
    if (tag)
      chips.push({
        key: "tag",
        label: `Tag : ${tagLabel}`,
        onRemove: () => setTag(""),
      });

    if (itemsPerPage !== DEFAULTS.itemsPerPage) {
      chips.push({
        key: "itemsPerPage",
        label: `Per Page : ${itemsPerPage}`,
        onRemove: () => setItemsPerPage(DEFAULTS.itemsPerPage),
      });
    }

    if (sortOrder !== DEFAULTS.sortOrder) {
      chips.push({
        key: "sortOrder",
        label: `Order : Oldest`,
        onRemove: () => setSortOrder(DEFAULTS.sortOrder),
      });
    }

    return chips;
  }, [search, category, tag, itemsPerPage, sortOrder, categoryLabel, tagLabel]);

  const FiltersContent = (
    <div className="blogSidebar">
      <h5 className="sidebarTitle">Filters</h5>

      <div className="sidebarGroup">
        <Form.Label className="blogLabel">Search</Form.Label>
        <Form.Control
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
      </div>

      <div className="sidebarGroup">
        <Form.Label className="blogLabel">Category</Form.Label>
        <Form.Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loadingFilters}
        >
          <option value="">All Categories</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.term_name || `${c.name}`}
            </option>
          ))}
        </Form.Select>
      </div>

      <div className="sidebarGroup">
        <Form.Label className="blogLabel">Tag</Form.Label>
        <Form.Select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          disabled={loadingFilters}
        >
          <option value="">All Tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name || `Tag ${t.id}`}
            </option>
          ))}
        </Form.Select>
      </div>

      <div className="sidebarGroup">
        <Form.Label className="blogLabel">Order</Form.Label>
        <Form.Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="DESC">Newest</option>
          <option value="ASC">Oldest</option>
        </Form.Select>
      </div>

      <div className="sidebarGroup">
        <Form.Label className="blogLabel">Per Page</Form.Label>
        <Form.Select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </Form.Select>
      </div>

      <div className="sidebarInfo">
        <div>
          Page: <b>{page + 1}</b> / <b>{Number(pager?.total_pages || 1)}</b>
        </div>
        <div>
          Total: <b>{totalItems}</b>
        </div>
      </div>

      <Button variant="outline-secondary" className="w-100" onClick={onReset}>
        Reset Filters
      </Button>

      {filtersErr && <div className="sidebarErr">{filtersErr}</div>}
    </div>
  );

  return (
    <div className="blogPage">
      <Header />

      <Container>
        {/* ✅ Top bar with Create button */}
        <div className="blogTop">
          <div>
            <h2 className="blogHeading">Blog List</h2>
            <p className="blogSub">
              Browse articles with filters and pagination.
            </p>
          </div>

          <button
            type="button"
            className="myPrimaryBtn"
            onClick={() => navigate("/articles/create")}
          >
            <FiPlus />
            <span>Create New Article</span>
          </button>
        </div>

        <Row className="g-4">
          {/* Sidebar Filters */}
          <Col lg={4}>
            <div className="blogSidebarDesktop">{FiltersContent}</div>
          </Col>

          {/* Blog List */}
          <Col lg={8} className="col-lg-8">
            <div className="blogMobileFiltersBar">
              <button
                type="button"
                className="blogMobileFiltersBtn"
                onClick={() => setFiltersOpen(true)}
              >
                <span>
                  <RiFilter3Fill /> Filters
                </span>

                {activeChips.length > 0 && (
                  <span className="blogMobileFiltersBadge">
                    {activeChips.length}
                  </span>
                )}
              </button>
            </div>

            {activeChips.length > 0 && (
              <div className="blogActiveFilters">
                <div className="blogActiveFiltersLeft">
                  <span className="blogActiveLabel">Activated filters :</span>

                  <div className="blogChips">
                    {activeChips.map((chip) => (
                      <button
                        key={chip.key}
                        type="button"
                        className="blogChip"
                        onClick={chip.onRemove}
                        title="Remove the filter"
                      >
                        <span className="blogChipText">{chip.label}</span>
                        <span className="blogChipX">×</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button variant="outline-danger" size="sm" onClick={onReset}>
                  Clear all
                </Button>
              </div>
            )}

            <div className="blogHeaderLine">
              <span>
                Showing <b>{rows.length}</b> of <b>{totalItems}</b> articles
              </span>
            </div>

            {loading ? (
  <div className="blogSkeleton">
    {[...Array(itemsPerPage)].map((_, i) => (
      <div className="blogSkCard" key={i}>
        <div className="blogSkThumb">
          <div className="blogSkShimmer" />
        </div>

        <div className="blogSkBody">
          <div className="blogSkLine w40"><div className="blogSkShimmer" /></div>
          <div className="blogSkLine w25"><div className="blogSkShimmer" /></div>

          <div className="blogSkLine w80"><div className="blogSkShimmer" /></div>
          <div className="blogSkLine w90"><div className="blogSkShimmer" /></div>
          <div className="blogSkLine w70"><div className="blogSkShimmer" /></div>

          <div className="blogSkTags">
            <span className="blogSkPill"><div className="blogSkShimmer" /></span>
            <span className="blogSkPill"><div className="blogSkShimmer" /></span>
            <span className="blogSkPill"><div className="blogSkShimmer" /></span>
          </div>

          <div className="blogSkBtn"><div className="blogSkShimmer" /></div>
        </div>
      </div>
    ))}
  </div>
)  : errMsg ? (
              <div className="blogState blogError">{errMsg}</div>
            ) : rows.length === 0 ? (
              <div className="blogState">No articles</div>
            ) : (
              <div className="blogList">
                {rows.map((a) => {
                  const imgPath = String(a.field_image || "").trim();
                  const img = imgPath ? toAbsUrl(imgPath) : "";
                  const created = fmtDate(a.created);

                  return (
                    <article className="blogCard" key={a.id}>
                      <div className="blogThumb">
                        {img ? (
                          <img
                            src={img}
                            alt={a.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "";
                            }}
                          />
                        ) : (
                          <div className="blogThumbPlaceholder">
                            {(a.title || "A").trim().charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="blogBody">
                        <div className="blogMeta">
                          <span className="blogAuthor">
                            {a.author || "Unknown"}
                          </span>
                          <span className="blogDot">•</span>
                          <span className="blogDate">{created}</span>
                        </div>

                        <h4 className="blogTitle">{a.title}</h4>

                        <p className="blogExcerpt">{excerpt(a.body)}</p>

                        {Array.isArray(a.field_tags) &&
                          a.field_tags.length > 0 && (
                            <div className="blogTags">
                              {a.field_tags.slice(0, 4).map((t, i) => (
                                <span className="blogTag" key={i}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                        <div className="blogActions">
                          <Link
                            className="blogReadMore"
                            to={`/articles/${a.id}`}
                          >
                            View <FaArrowRightLong />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {!loading && !errMsg && totalPages > 1 && (
              <div className="blogPagination">
                <Button
                  variant="outline-secondary"
                  disabled={!canPrev}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </Button>

                <div className="blogPageInfo">
                  Page <b>{page + 1}</b> of <b>{totalPages}</b>
                </div>

                <Button
                  variant="outline-secondary"
                  disabled={!canNext}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {filtersOpen && (
        <div className="blogFiltersOverlay" onClick={closeFilters}>
          <div
            className="blogFiltersSheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="blogFiltersSheetHead">
              <h5>Filters</h5>
              <button
                type="button"
                className="blogFiltersClose"
                onClick={closeFilters}
              >
                ×
              </button>
            </div>

            <div className="blogFiltersSheetBody">{FiltersContent}</div>

            <div className="blogFiltersSheetFoot">
              <button
                type="button"
                className="blogFiltersDone"
                onClick={closeFilters}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      <Link to="/articles/create" className="blogFab d-lg-none">
        + Create
      </Link>
    </div>
  );
}
