// src/pages/ArticleDetails.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { FaLink } from "react-icons/fa";
import Header from "../components/Header";

import { AuthContext } from "../context/AuthContext";
import { ApiConfig } from "../api/ApiConfig";
import {
  getArticleDetails,
  getUserProfileById,
  toAbsUrl,
} from "../api/blogApi";

import rel1 from "../assets/images/download (1).jpg";
import rel2 from "../assets/images/download (2).jpg";
import rel3 from "../assets/images/download (3).jpg";

import TestimonialsSection from "../components/TestimonialsSection";

import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import "./ArticleDetails.css";

/* ---------------- Helpers ---------------- */
function normalizeError(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  return err.message || "Request failed";
}

function safeVal(field, fallback = "") {
  return (field?.[0]?.value ?? fallback) + "";
}

function safeDate(field) {
  const iso = field?.[0]?.value;
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function pickImageUrl(fieldArr) {
  const u = fieldArr?.[0]?.url || fieldArr?.[0]?.value || "";
  return u ? toAbsUrl(u) : "";
}

function mapGallery(field_gallery) {
  const arr = Array.isArray(field_gallery) ? field_gallery : [];
  return arr
    .map((g) => ({
      url: g?.url ? toAbsUrl(g.url) : "",
      alt: g?.alt || "Gallery",
    }))
    .filter((x) => x.url);
}

function getInitials(name) {
  const s = String(name || "").trim();
  if (!s) return "?";
  return s.charAt(0).toUpperCase();
}

/* Skeleton */
function SkeletonLine({ w = "100%", h = 14, className = "" }) {
  return (
    <div className={`skel ${className}`} style={{ width: w, height: h }} />
  );
}

function ArticleSkeleton() {
  return (
    <div className="articleSkelWrap">
      <div className="skel skelHero" />
      <div className="articleSkelRow">
        <SkeletonLine w="60%" h={26} className="skelTitle" />
        <SkeletonLine w="35%" h={14} />
        <SkeletonLine w="30%" h={14} />
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <div className="articleCard">
            <SkeletonLine w="20%" h={16} />
            <SkeletonLine w="100%" h={14} />
            <SkeletonLine w="100%" h={14} />
            <SkeletonLine w="90%" h={14} />
            <SkeletonLine w="70%" h={14} />
          </div>
        </Col>
        <Col lg={4}>
          <div className="articleCard">
            <SkeletonLine w="45%" h={16} />
            <SkeletonLine w="100%" h={14} />
            <SkeletonLine w="80%" h={14} />
            <SkeletonLine w="90%" h={14} />
          </div>

          <div className="articleCard mt-3">
            <SkeletonLine w="55%" h={16} />
            <SkeletonLine w="100%" h={60} className="skelBlock" />
          </div>
        </Col>
      </Row>
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function ArticleDetails() {
  const [galleryRoot, setGalleryRoot] = useState(null);
  const { id } = useParams();
  const { isLoggedIn, username, password } = useContext(AuthContext);

  // ✅ Static Related Articles (Edit these)
  const STATIC_RELATED = useMemo(
    () => [
      {
        id: "101",
        title: "Related Article Title 1",
        // ضع الصورة اللي بدك ياها (رابط مباشر أو من public مثل /images/rel1.jpg)
        image: rel1,
      },
      {
        id: "102",
        title: "Related Article Title 2",
        image: rel2,
      },
      {
        id: "103",
        title: "Related Article Title 3",
        image: rel3,
      },
    ],
    []
  );

  // main
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [article, setArticle] = useState(null);

  // author
  const [author, setAuthor] = useState(null);

  // terms for label mapping
  const [cats, setCats] = useState([]);
  const [tags, setTags] = useState([]);

  // gallery modal

  // toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  /* -------- Load Terms (names) -------- */
  useEffect(() => {
    let cancelled = false;

    const catUrl = `${ApiConfig.BASE_URL_TAMKEEN}/terms/category`;
    const tagUrl = `${ApiConfig.BASE_URL_TAMKEEN}/terms/tags`;

    Promise.all([
      fetch(catUrl, { headers: { Accept: "application/json" } })
        .then((r) => r.json().then((d) => (r.ok ? d : [])))
        .catch(() => []),
      fetch(tagUrl, { headers: { Accept: "application/json" } })
        .then((r) => r.json().then((d) => (r.ok ? d : [])))
        .catch(() => []),
    ]).then(([c, t]) => {
      if (cancelled) return;
      setCats(Array.isArray(c) ? c : []);
      setTags(Array.isArray(t) ? t : []);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (galleryRoot) {
      Fancybox.bind(galleryRoot, "[data-fancybox]", {});
      return () => Fancybox.unbind(galleryRoot, "[data-fancybox]");
    }
  }, [galleryRoot]);

  /* -------- Load Article + Author -------- */
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setErrMsg("");
    setArticle(null);
    setAuthor(null);

    if (!isLoggedIn) {
      setLoading(false);
      setErrMsg("لازم تسجّل دخول حتى تشوف تفاصيل المقال.");
      return;
    }

    getArticleDetails({ id, username, password })
      .then((data) => {
        if (cancelled) return;
        setArticle(data || null);

        // fetch author if uid exists
        const uid = data?.uid?.[0]?.target_id;
        if (!uid) return null;

        return getUserProfileById({ uid, username, password })
          .then((u) => {
            if (cancelled) return;
            setAuthor(u || null);
          })
          .catch(() => {
            if (cancelled) return;
            setAuthor(null);
          });
      })
      .catch((e) => {
        if (cancelled) return;
        setErrMsg(normalizeError(e));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isLoggedIn, username, password]);

  /* -------- Derived fields -------- */
  const title = useMemo(() => safeVal(article?.title, "—"), [article]);
  const created = useMemo(() => safeDate(article?.created), [article]);
  const changed = useMemo(() => safeDate(article?.changed), [article]);

  const banner = useMemo(() => pickImageUrl(article?.field_image), [article]);
  const gallery = useMemo(() => mapGallery(article?.field_gallery), [article]);

  const bodyHtml = useMemo(() => {
    const processed = article?.body?.[0]?.processed;
    const raw = article?.body?.[0]?.value;
    return processed || raw || "";
  }, [article]);

  const categoryId = useMemo(
    () => article?.field_category?.[0]?.target_id || "",
    [article]
  );
  const tagIds = useMemo(() => {
    const arr = Array.isArray(article?.field_tags) ? article.field_tags : [];
    return arr.map((x) => x?.target_id).filter(Boolean);
  }, [article]);

  const categoryName = useMemo(() => {
    if (!categoryId) return "";
    const c = cats.find((x) => String(x.id) === String(categoryId));
    return c?.term_name || c?.name || `Category ${categoryId}`;
  }, [categoryId, cats]);

  const tagNames = useMemo(() => {
    if (!tagIds.length) return [];
    return tagIds.map((tid) => {
      const t = tags.find((x) => String(x.id) === String(tid));
      return t?.name || `Tag ${tid}`;
    });
  }, [tagIds, tags]);

  const authorName = useMemo(() => {
    if (!author) return "Unknown";
    const fn = safeVal(author?.field_name, "");
    const ln = safeVal(author?.field_surname, "");
    const n = safeVal(author?.name, "");
    const full = `${fn} ${ln}`.trim();
    return full || n || "Unknown";
  }, [author]);

  const authorPic = useMemo(() => {
    const u = author?.user_picture?.[0]?.url || "";
    return u ? toAbsUrl(u) : "";
  }, [author]);

  /* -------- Actions -------- */
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast({
        show: true,
        message: " The article link has been copied ✅",
        variant: "success",
      });
    } catch {
      setToast({
        show: true,
        message: "ما قدرت انسخ الرابط تلقائيًا. انسخه يدويًا من شريط العنوان.",
        variant: "danger",
      });
    }
  }

  return (
    <div className="articleDetailsPage">
      <Header />
      <Container>
        {/* Toast */}
        <ToastContainer position="bottom-end" className="p-3">
          <Toast
            bg={toast.variant}
            show={toast.show}
            onClose={() => setToast((t) => ({ ...t, show: false }))}
            delay={2500}
            autohide
          >
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        </ToastContainer>

        {/* Breadcrumb */}
        <div className="articleBread">
          <Link to="/" className="breadLink">
            Home
          </Link>
          <span className="breadSep">›</span>
          <Link to="/articles" className="breadLink">
            Blog List
          </Link>
          <span className="breadSep">›</span>
          <span className="breadCurrent">Article Details</span>
        </div>

        {/* Loading */}
        {loading ? (
          <ArticleSkeleton />
        ) : errMsg ? (
          <div className="articleErrorBox">{errMsg}</div>
        ) : !article ? (
          <div className="articleErrorBox">لا يوجد بيانات للمقال.</div>
        ) : (
          <>
            {/* Banner */}
            <div className="articleBanner">
              {banner ? (
                <img className="articleBannerImg" src={banner} alt={title} />
              ) : (
                <div className="articleBannerFallback">
                  {getInitials(title)}
                </div>
              )}
            </div>

            <Row className="g-4">
              {/* Left */}
              <Col lg={8}>
                <div className="articleMainCard">
                  <h1 className="articleMainTitle">{title}</h1>

                  {/* Meta row */}
                  <div className="articleMetaRow">
                    <div className="articleAuthor">
                      {authorPic ? (
                        <img
                          className="articleAvatar"
                          src={authorPic}
                          alt={authorName}
                        />
                      ) : (
                        <div className="articleAvatarFallback">
                          {getInitials(authorName)}
                        </div>
                      )}

                      <div className="articleAuthorInfo">
                        <div className="articleAuthorName">{authorName}</div>
                      </div>
                    </div>

                    <div className="articleDates">
                      <div className="articleDateItem">
                        <b>Added:</b> {created || "—"}
                      </div>
                      <div className="articleDateItem">
                        <b>Last updated:</b> {changed || "—"}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {tagNames.length > 0 && (
                    <div className="articleTagRow">
                      {tagNames.slice(0, 6).map((t, i) => (
                        <span key={i} className="tagPill">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Body */}
                  <div
                    className="articleBody"
                    dangerouslySetInnerHTML={{ __html: bodyHtml }}
                  />
                  <div className="adTestimonials">
  <TestimonialsSection limit={2} />
</div>
                  {/* Photo Gallery */}
                  {/* Photo Gallery */}
                  {gallery.length > 0 && (
                    <div className="articleGallerySection" ref={setGalleryRoot}>
                      <div className="articleGalleryHead">
                        <h3 className="articleGalleryTitle">Photo Gallery</h3>

                        {/* View All trigger */}
                        {/* <button
  type="button"
  className="articleViewAll"
  data-fancybox-trigger="article-gallery"
  data-fancybox-index="0"
>
  View All →
</button> */}
                      </div>

                      <div className="articleGalleryGrid">
                        {gallery.slice(0, 6).map((img, i) => (
                          <a
                            key={i}
                            href={img.url}
                            data-fancybox="article-gallery"
                            data-caption={img.alt}
                            className="articleGalleryItem"
                          >
                            <img src={img.url} alt={img.alt} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Col>

              {/* Right sidebar */}
              <Col lg={4}>
                {/* Info Card */}
                <div className="sideCard">
                  <div className="sideTitle">Categories</div>

                  <div className="sideRow">
                    <div className="sideDot" />
                    <div className="sideStrong">{categoryName || "—"}</div>
                  </div>

                  <div className="sideMeta">
                    <div>📅 {created || "—"}</div>
                    <div className="sideMut">
                      Last updated: {changed || "—"}
                    </div>
                  </div>

                  {tagNames.length > 0 && (
                    <div className="sidePills">
                      {tagNames.slice(0, 6).map((t, i) => (
                        <span key={i} className="sidePill">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="sideActions">
                    <Button
                      variant="outline-secondary"
                      className="w-100"
                      onClick={copyLink}
                    >
                    <FaLink /> Copy Article Link
                    </Button>
                  </div>
                </div>

                {/* ✅ Static Related Articles (Sidebar) */}
                <div className="sideCard mt-3">
                  <div className="sideTitle">Related Articles</div>

                  {STATIC_RELATED.length === 0 ? (
                    <div className="sideMut">No related articles.</div>
                  ) : (
                    <div className="relatedList">
                      {STATIC_RELATED.map((r) => {
                        const img = r?.image || "";
                        return (
                          <Link
                            to={`/articles/${r.id}`}
                            className="relatedItem"
                            key={r.id}
                          >
                            <div className="relatedThumb">
                              {img ? (
                                <img src={img} alt={r.title} />
                              ) : (
                                <div className="relatedThumbPh">
                                  {(r.title || "A")[0]}
                                </div>
                              )}
                            </div>

                            <div className="relatedBody">
                              <div className="relatedTitle">{r.title}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            {/* Gallery Modal */}
          </>
        )}
      </Container>
    </div>
  );
}
