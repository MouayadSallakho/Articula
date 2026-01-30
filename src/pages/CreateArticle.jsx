// src/pages/CreateArticle.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { ApiConfig } from "../api/ApiConfig";
import {
  getCsrfToken,
  uploadBanner,
  uploadGallery,
  createArticle,
} from "../api/articleServices";

import Header from "../components/Header";
import "./CreateArticle.css";

function normalizeError(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  return err.message || "Request failed";
}

/** ============ Image Validation (Best Practice) ============ */
const MAX_IMAGE_MB = 5;
const MAX_GALLERY_FILES = 12;

function validateImageFile(file) {
  if (!file) return "Missing file";
  if (!file.type || !file.type.startsWith("image/"))
    return "File must be an image";
  const maxBytes = MAX_IMAGE_MB * 1024 * 1024;
  if (file.size > maxBytes) return `Max image size is ${MAX_IMAGE_MB}MB`;
  return "";
}

export default function CreateArticle() {
  const navigate = useNavigate();
  const { isLoggedIn, username, password } = useContext(AuthContext);

  // Copy state
  const [copied, setCopied] = useState(false);

  // ✅ file input reset keys (Best practice for <input type="file">)
  const [bannerInputKey, setBannerInputKey] = useState(1);
  const [galleryInputKey, setGalleryInputKey] = useState(1);

  // Form fields
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState([]);

  // Terms
  const [cats, setCats] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadingTerms, setLoadingTerms] = useState(true);

  // Images (files + previews)
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // UI
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [createdId, setCreatedId] = useState(null);

  /** ✅ Load categories + tags (public endpoints) */
  useEffect(() => {
    let cancelled = false;
    setLoadingTerms(true);

    const catUrl =
      ApiConfig.BASE_URL_TAMKEEN + ApiConfig.ENDPOINTS.TERMS_CATEGORY;
    const tagUrl = ApiConfig.BASE_URL_TAMKEEN + ApiConfig.ENDPOINTS.TERMS_TAGS;

    Promise.all([
      fetch(catUrl, { method: "GET", headers: { Accept: "application/json" } })
        .then((r) => r.json().then((d) => (r.ok ? d : [])))
        .catch(() => []),

      fetch(tagUrl, { method: "GET", headers: { Accept: "application/json" } })
        .then((r) => r.json().then((d) => (r.ok ? d : [])))
        .catch(() => []),
    ])
      .then(([c, t]) => {
        if (cancelled) return;
        setCats(Array.isArray(c) ? c : []);
        setTags(Array.isArray(t) ? t : []);

        if (!categoryId && Array.isArray(c) && c.length > 0) {
          setCategoryId(String(c[0].id));
        }
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingTerms(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ✅ Lock scroll when success overlay open (best UX) */
  useEffect(() => {
    if (!successMsg) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [successMsg]);

  /** ✅ cleanup banner preview on unmount */
  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [bannerPreview]);

  /** ✅ cleanup gallery previews on unmount */
  useEffect(() => {
    return () => {
      galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [galleryPreviews]);

  /** ✅ Banner choose */
  function onChooseBanner(e) {
    setErrMsg("");
    const file = e.target.files?.[0];
    if (!file) return;

    const v = validateImageFile(file);
    if (v) {
      setErrMsg(v);
      return;
    }

    // revoke previous preview
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);

    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  }

  /** ✅ Remove banner (Best practice) */
  function removeBanner() {
    setErrMsg("");
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);

    setBannerFile(null);
    setBannerPreview("");

    // reset input
    setBannerInputKey((k) => k + 1);
  }

  /** ✅ Gallery choose (replace selection) */
  function onChooseGallery(e) {
    setErrMsg("");
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length > MAX_GALLERY_FILES) {
      setErrMsg(`You can upload up to ${MAX_GALLERY_FILES} gallery images.`);
      return;
    }

    for (const f of files) {
      const v = validateImageFile(f);
      if (v) {
        setErrMsg(v);
        return;
      }
    }

    // revoke previous previews
    galleryPreviews.forEach((u) => URL.revokeObjectURL(u));

    setGalleryFiles(files);
    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  /** ✅ Remove one gallery image (Best practice) */
  function removeGalleryAt(index) {
    setErrMsg("");

    setGalleryPreviews((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });

    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));

    // إذا شال كل الصور، رجّع input يتصفّر
    if (galleryFiles.length === 1) {
      setGalleryInputKey((k) => k + 1);
    }
  }

  /** ✅ Clear all gallery */
  function clearGallery() {
    setErrMsg("");
    galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setGalleryInputKey((k) => k + 1);
  }

  function toggleTag(id, checked) {
    const sid = String(id);
    if (checked) {
      setTagIds((prev) => (prev.includes(sid) ? prev : [...prev, sid]));
    } else {
      setTagIds((prev) => prev.filter((x) => x !== sid));
    }
  }

  /** ✅ Submit enabled? */
  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (successMsg) return false;
    if (!title.trim()) return false;
    if (!body.trim()) return false;
    if (!categoryId) return false;
    if (!bannerFile) return false; // required
    return true;
  }, [submitting, successMsg, title, body, categoryId, bannerFile]);

  /** ✅ Submit: CSRF → banner → gallery → create */
  function onSubmit(e) {
    e.preventDefault();
    if (submitting || successMsg) return;

    setErrMsg("");
    setSuccessMsg("");
    setCreatedId(null);
    setCopied(false);

    if (!isLoggedIn) {
      setErrMsg("You must login to create an article.");
      return;
    }

    if (!bannerFile) {
      setErrMsg("Banner image is required.");
      return;
    }

    setSubmitting(true);

    let csrfToken = "";
    let bannerFid = null;
    let galleryFids = [];

    getCsrfToken()
      .then((csrf) => {
        csrfToken = csrf;

        return uploadBanner({
          file: bannerFile,
          csrfToken,
          username,
          password,
        });
      })
      .then((bannerRes) => {
        bannerFid = bannerRes?.fid?.[0]?.value;
        if (!bannerFid) throw new Error("Banner uploaded but fid not found.");

        if (!galleryFiles.length) return [];
        return uploadGallery({
          files: galleryFiles,
          csrfToken,
          username,
          password,
        });
      })
      .then((galleryResArr) => {
        galleryFids = (galleryResArr || [])
          .map((x) => x?.fid?.[0]?.value)
          .filter(Boolean);

        return createArticle({
          title: title.trim(),
          body: body.trim(),
          categoryId,
          tagIds,
          bannerFid,
          galleryFids,
          csrfToken,
          username,
          password,
        });
      })
      .then((created) => {
        const nid = created?.nid?.[0]?.value;
        if (!nid) throw new Error("Article created but nid not found.");

        setCreatedId(nid);
        setSuccessMsg("✅ Article created successfully!");
      })
      .catch((err) => {
        setErrMsg(normalizeError(err));
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  /** ✅ Reset all form (used by "Create Another Article") */
  function resetAll() {
    // revoke previews
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    galleryPreviews.forEach((u) => URL.revokeObjectURL(u));

    setTitle("");
    setBody("");
    setTagIds([]);
    setBannerFile(null);
    setBannerPreview("");
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setSuccessMsg("");
    setCreatedId(null);
    setErrMsg("");
    setCopied(false);

    // reset file inputs
    setBannerInputKey((k) => k + 1);
    setGalleryInputKey((k) => k + 1);
  }

  /** UI when not logged in */
  if (!isLoggedIn) {
    return (
      <Container className="py-4 create-article-page">
        <Alert variant="warning">
          You must login first. <Link to="/login">Go to Login</Link>
        </Alert>
      </Container>
    );
  }

  return (
    <div>
      <Header />

      <Container className="py-4 create-article-page">
        <div className="caTopBar">
          <h2 className="m-0 caTitle">Create Article</h2>

          <Button
            variant="outline-secondary"
            className="caBackBtn"
            onClick={() => navigate("/blog")}
          >
            Back to Blog
          </Button>
        </div>

        {errMsg && <Alert variant="danger">{errMsg}</Alert>}

        {/* ✅ Success Overlay */}
        {successMsg && (
          <div className="successOverlay" role="dialog" aria-modal="true">
            <div className="successCard">
              <div className="successIcon">✓</div>

              <h3 className="successTitle">Article created successfully!</h3>
              <p className="successText">
                Your article has been published and is now available.
              </p>

              <div className="successBtns">
                <Button
                  className="w-100 caPrimaryBtn"
                  onClick={() => navigate(`/articles/${createdId}`)}
                  disabled={!createdId}
                >
                  View Article
                </Button>

                <Button
                  variant="outline-primary"
                  className="w-100 caOutlineBtn"
                  onClick={resetAll}
                >
                  Create Another Article
                </Button>

                <Button
                  variant="outline-secondary"
                  className="w-100 caOutlineSecondaryBtn"
                  onClick={() => navigate("/blog")}
                >
                  Back to Blog List
                </Button>

                <button
                  type="button"
                  className={`copyLinkBtn ${copied ? "copied" : ""}`}
                  disabled={!createdId || copied}
                  onClick={() => {
                    if (!createdId) return;

                    navigator.clipboard
                      .writeText(
                        window.location.origin + `/articles/${createdId}`
                      )
                      .then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1400);
                      })
                      .catch(() => {
                        setErrMsg(
                          "Copy failed. Please copy the link manually."
                        );
                      });
                  }}
                >
                  {copied ? "Copied ✓" : "Copy Article Link"}
                </button>
              </div>
            </div>
          </div>
        )}

        <Form onSubmit={onSubmit}>
          <Row className="g-4">
            <Col lg={8}>
              <div className="caCard">
                <Form.Group className="mb-3">
                  <Form.Label className="caLabel">Title</Form.Label>
                  <Form.Control
                    className="caControl"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="caLabel">
                    Body (HTML allowed)
                  </Form.Label>
                  <Form.Control
                    className="caControl"
                    as="textarea"
                    rows={10}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your article..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="caLabel">Category</Form.Label>
                  <Form.Select
                    className="caControl"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    disabled={loadingTerms}
                  >
                    {cats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.term_name || c.name}
                      </option>
                    ))}
                  </Form.Select>

                  {loadingTerms && (
                    <div className="caHint">Loading categories/tags...</div>
                  )}
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label className="caLabel">Tags</Form.Label>
                  <div className="ca-tagsBox">
                    {tags.map((t) => {
                      const tid = String(t.id);
                      const checked = tagIds.includes(tid);
                      return (
                        <Form.Check
                          key={t.id}
                          type="checkbox"
                          id={`tag-${t.id}`}
                          label={t.name || `Tag ${t.id}`}
                          checked={checked}
                          onChange={(e) => toggleTag(tid, e.target.checked)}
                        />
                      );
                    })}
                  </div>
                </Form.Group>
              </div>
            </Col>

            <Col lg={4}>
              {/* Banner */}
              <div className="caCard caSideCard">
                <Form.Group className="mb-2">
                  <Form.Label className="caLabel">
                    Banner Image (Required)
                  </Form.Label>
                  <Form.Control
                    className="caControl ssssaa"
                    key={bannerInputKey}
                    type="file"
                    accept="image/*"
                    onChange={onChooseBanner}
                  />
                  <div className="caHint">Max {MAX_IMAGE_MB}MB</div>
                </Form.Group>

                {bannerPreview ? (
                  <div className="mt-3">
                    <div className="mb-2 caSectionTitle">Preview</div>

                    <div className="caPreviewWrap">
                      <img
                        src={bannerPreview}
                        alt="banner-preview"
                        className="caPreviewImg"
                      />

                      <button
                        type="button"
                        onClick={removeBanner}
                        aria-label="Remove banner"
                        title="Remove"
                        className="caRemoveBtn"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="caEmptyHint">
                    Choose an image to display here.
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div className="caCard caSideCard">
                <Form.Group className="mb-2">
                  <Form.Label className="caLabel">
                    Gallery Images (Optional)
                  </Form.Label>
                  <Form.Control
                    className="caControl ssssaa"
                    key={galleryInputKey}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onChooseGallery}
                  />
                  <div className="caHint">
                    Max {MAX_GALLERY_FILES} images • {MAX_IMAGE_MB}MB each
                  </div>
                </Form.Group>

                {galleryPreviews.length > 0 ? (
                  <div className="mt-3">
                    <div className="caGalleryTop">
                      <div className="mb-2 caSectionTitle">Preview</div>

                      <button
                        type="button"
                        onClick={clearGallery}
                        className="caClearBtn"
                        title="Remove all"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="caGalleryGrid">
                      {galleryPreviews.map((src, i) => (
                        <div key={i} className="caGalleryItem">
                          <img
                            src={src}
                            alt={`gallery-${i}`}
                            className="caGalleryImg"
                          />

                          <button
                            type="button"
                            onClick={() => removeGalleryAt(i)}
                            aria-label="Remove image"
                            title="Remove"
                            className="caGalleryRemove"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="caEmptyHint">
                    Select images for the gallery.
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-100 caSubmitBtn"
                disabled={!canSubmit}
              >
                {submitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Creating...
                  </>
                ) : (
                  "Create Article"
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
}
