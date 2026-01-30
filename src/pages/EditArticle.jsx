// src/pages/EditArticle.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";

import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import { ApiConfig } from "../api/ApiConfig";
import { getArticleDetails } from "../api/blogApi";
import {
  getCsrfToken,
  uploadBanner,
  uploadGallery,
  updateArticle,
} from "../api/articleServices";

import "./EditArticle.css";

function normalizeError(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  return err.message || "Request failed";
}

function safeFirstValue(arr, fallback = "") {
  if (!Array.isArray(arr) || !arr[0]) return fallback;
  return arr[0]?.value ?? fallback;
}

function targetsToIds(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((x) => String(x?.target_id || "")).filter(Boolean);
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

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoggedIn, username, password, csrfToken } = useContext(AuthContext);

  // ✅ file input reset keys
  const [bannerInputKey, setBannerInputKey] = useState(1);
  const [galleryInputKey, setGalleryInputKey] = useState(1);

  // form fields
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState([]);

  // terms
  const [cats, setCats] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadingTerms, setLoadingTerms] = useState(true);

  // existing images
  const [existingBannerUrl, setExistingBannerUrl] = useState("");
  const [existingBannerFid, setExistingBannerFid] = useState(null);

  const [existingGalleryFids, setExistingGalleryFids] = useState([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState([]);

  // new chosen
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // UI
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // ✅ Toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastCopied, setToastCopied] = useState(false);

  // ✅ load categories + tags
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
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingTerms(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ cleanup previews (memory leak protection)
  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      (galleryPreviews || []).forEach((u) => URL.revokeObjectURL(u));
    };
  }, [bannerPreview, galleryPreviews]);

  // ✅ load article details
  useEffect(() => {
    let cancelled = false;

    setErrMsg("");
    setLoadingArticle(true);

    if (!isLoggedIn) {
      setLoadingArticle(false);
      setErrMsg("You must login to edit the article.");
      return;
    }

    getArticleDetails({ id, username, password })
      .then((data) => {
        if (cancelled) return;

        setTitle(safeFirstValue(data?.title, ""));

        const bodyObj = Array.isArray(data?.body) ? data.body[0] : null;
        setBody(bodyObj?.value || "");

        const cat = Array.isArray(data?.field_category)
          ? data.field_category[0]
          : null;
        setCategoryId(cat?.target_id ? String(cat.target_id) : "");

        setTagIds(targetsToIds(data?.field_tags));

        const img = Array.isArray(data?.field_image)
          ? data.field_image[0]
          : null;
        const bannerFid = img?.target_id || null;
        setExistingBannerFid(bannerFid);
        setExistingBannerUrl(img?.url ? String(img.url) : "");

        const gal = Array.isArray(data?.field_gallery)
          ? data.field_gallery
          : [];
        const galFids = gal.map((x) => x?.target_id).filter(Boolean);
        const galUrls = gal.map((x) => x?.url).filter(Boolean);

        setExistingGalleryFids(galFids);
        setExistingGalleryUrls(galUrls);

        // reset new chosen
        if (bannerPreview) URL.revokeObjectURL(bannerPreview);
        (galleryPreviews || []).forEach((u) => URL.revokeObjectURL(u));

        setBannerFile(null);
        setBannerPreview("");
        setGalleryFiles([]);
        setGalleryPreviews([]);

        setBannerInputKey((k) => k + 1);
        setGalleryInputKey((k) => k + 1);
      })
      .catch((e) => {
        if (cancelled) return;
        setErrMsg(normalizeError(e));
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingArticle(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isLoggedIn, username, password]);

  // ✅ choose new banner
  function onChooseBanner(e) {
    setErrMsg("");
    const file = e.target.files?.[0];
    if (!file) return;

    const v = validateImageFile(file);
    if (v) {
      setErrMsg(v);
      return;
    }

    if (bannerPreview) URL.revokeObjectURL(bannerPreview);

    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  }

  // ✅ remove new banner (revert back to existing)
  function removeNewBanner() {
    setErrMsg("");
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerFile(null);
    setBannerPreview("");
    setBannerInputKey((k) => k + 1);
  }

  // ✅ choose new gallery (replace selection)
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

    (galleryPreviews || []).forEach((u) => URL.revokeObjectURL(u));

    setGalleryFiles(files);
    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  // ✅ remove one new gallery image (safe + input reset)
  function removeNewGalleryAt(index) {
    setErrMsg("");

    setGalleryPreviews((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });

    setGalleryFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setGalleryInputKey((k) => k + 1);
      return next;
    });
  }

  // ✅ remove one existing gallery image
  function removeExistingGalleryAt(index) {
    setExistingGalleryUrls((prev) => prev.filter((_, i) => i !== index));
    setExistingGalleryFids((prev) => prev.filter((_, i) => i !== index));
  }

  // ✅ clear all new gallery
  function clearNewGallery() {
    setErrMsg("");
    (galleryPreviews || []).forEach((u) => URL.revokeObjectURL(u));
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setGalleryInputKey((k) => k + 1);
  }

  function toggleTag(tid, checked) {
    const sid = String(tid);
    if (checked)
      setTagIds((prev) => (prev.includes(sid) ? prev : [...prev, sid]));
    else setTagIds((prev) => prev.filter((x) => x !== sid));
  }

  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (!title.trim()) return false;
    if (!body.trim()) return false;
    if (!categoryId) return false;
    if (!existingBannerFid && !bannerFile) return false;
    return true;
  }, [submitting, title, body, categoryId, existingBannerFid, bannerFile]);

  function openSuccessToast() {
    setToastCopied(false);
    setToastOpen(true);
  }

  function copyLink() {
    setToastCopied(false);
    const url = window.location.origin + `/articles/${id}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setToastCopied(true);
        setTimeout(() => setToastCopied(false), 1200);
      })
      .catch(() => {
        setErrMsg("Copy failed. Please copy the link manually.");
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    setErrMsg("");

    if (!isLoggedIn) {
      setErrMsg("You must login to edit the article.");
      return;
    }

    setSubmitting(true);

    const tokenPromise = csrfToken
      ? Promise.resolve(csrfToken)
      : getCsrfToken();

    let bannerFidToUse = existingBannerFid;

    tokenPromise
      .then((token) => {
        // banner upload if chosen
        if (!bannerFile) return token;

        return uploadBanner({
          file: bannerFile,
          csrfToken: token,
          username,
          password,
        }).then((bannerRes) => {
          const fid = bannerRes?.fid?.[0]?.value;
          if (!fid) throw new Error("Banner uploaded but fid not found.");
          bannerFidToUse = fid;
          return token;
        });
      })
      .then((token) => {
        // gallery upload if chosen
        if (!galleryFiles.length) return { token, newGalleryFids: [] };

        return uploadGallery({
          files: galleryFiles,
          csrfToken: token,
          username,
          password,
        }).then((galleryResArr) => {
          const newGalleryFids = (galleryResArr || [])
            .map((x) => x?.fid?.[0]?.value)
            .filter(Boolean);
          return { token, newGalleryFids };
        });
      })
      .then(({ token, newGalleryFids }) => {
        // merge existing + new, dedupe
        const merged = [
          ...existingGalleryFids.map((n) => Number(n)),
          ...newGalleryFids.map((n) => Number(n)),
        ].filter(Boolean);

        const mergedUnique = Array.from(new Set(merged));

        const payload = {
          type: [{ target_id: "blog" }],
          title: [{ value: title.trim() }],
          body: [{ value: body.trim(), format: "full_html" }],
          field_category: [{ target_id: Number(categoryId) || 0 }],
          field_tags: (tagIds || []).map((x) => ({ target_id: Number(x) })),
          field_image: [{ target_id: Number(bannerFidToUse) }],
          field_gallery: mergedUnique.map((fid) => ({
            target_id: Number(fid),
          })),
        };

        return updateArticle({
          nodeId: id,
          payload,
          csrfToken: token,
          username,
          password,
        });
      })
      .then(() => {
        openSuccessToast();
      })
      .catch((err) => setErrMsg(normalizeError(err)))
      .finally(() => setSubmitting(false));
  }

  if (!isLoggedIn) {
    return (
      <div>
        <Header />
        <Container className="py-4 edit-article-page">
          <Alert variant="warning">
            You must login first. <Link to="/login">Go to Login</Link>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <Container className="py-4 edit-article-page">
        {/* ✅ Toast */}
        <ToastContainer className="p-3 editToastWrap">
          <Toast
            bg="light"
            show={toastOpen}
            onClose={() => setToastOpen(false)}
            delay={2200}
            autohide
            className="editToast"
          >
            <Toast.Header closeButton>
              <strong className="me-auto">Saved</strong>
              <small>just now</small>
            </Toast.Header>

            <Toast.Body>
              <div className="editToastBodyRow">
                <div className="editToastText">
                  ✅ Article updated successfully
                </div>

                <div className="editToastBtns">
                  <button
                    type="button"
                    className="btn btn-sm caOutlineBtn"
                    onClick={() => navigate(`/articles/${id}`)}
                  >
                    View
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm caOutlineSecondaryBtn"
                    onClick={copyLink}
                  >
                    {toastCopied ? "Copied ✓" : "Copy"}
                  </button>
                </div>
              </div>
            </Toast.Body>
          </Toast>
        </ToastContainer>

        {/* Top Bar */}
        <div className="caTopBar">
          <div>
            <h2 className="m-0 caTitle">Edit Article</h2>
            <div className="caSubtle">Article ID: {id}</div>
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              className="caBackBtn"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>

            <Button
              variant="outline-primary"
              className="caOutlineBtn"
              onClick={() => navigate(`/articles/${id}`)}
            >
              View
            </Button>
          </div>
        </div>

        {errMsg && <Alert variant="danger">{errMsg}</Alert>}

        {loadingArticle ? (
          <div className="caCard">
            <div className="caLoadingLine">
              <Spinner size="sm" className="me-2" /> Loading article...
            </div>
          </div>
        ) : (
          <Form onSubmit={onSubmit}>
            <Row className="g-4">
              {/* LEFT */}
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
                    <Form.Label className="caLabel">Article content</Form.Label>
                    <Form.Control
                      className="caControl"
                      as="textarea"
                      rows={13}
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

              {/* RIGHT */}
              <Col lg={4}>
                {/* Banner */}
                <div className="caCard caSideCard">
                  <Form.Group className="mb-2">
                    <Form.Label className="caLabel">Banner Image</Form.Label>
                    <Form.Control
                      className="caControl"
                      key={bannerInputKey}
                      type="file"
                      accept="image/*"
                      onChange={onChooseBanner}
                    />
                    <div className="caHint">Max {MAX_IMAGE_MB}MB</div>
                  </Form.Group>

                  {bannerPreview ? (
                    <div className="mt-3">
                      <div className="mb-2 caSectionTitle">New Banner</div>

                      <div className="caPreviewWrap">
                        <img
                          src={bannerPreview}
                          alt="banner-preview"
                          className="caPreviewImg"
                        />

                        <button
                          type="button"
                          onClick={removeNewBanner}
                          title="Remove new banner"
                          aria-label="Remove"
                          className="caRemoveBtn"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ) : existingBannerUrl ? (
                    <div className="mt-3">
                      <div className="mb-2 caSectionTitle">Current Banner</div>

                      <div className="caPreviewWrap">
                        <img
                          src={existingBannerUrl}
                          alt="banner-current"
                          className="caPreviewImg"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      </div>

                      <div className="caHint">
                        Choose a new image above if you want to replace it.
                      </div>
                    </div>
                  ) : (
                    <div className="caEmptyHint">
                      No banner yet — please choose an image.
                    </div>
                  )}
                </div>

                {/* Gallery */}
                <div className="caCard caSideCard">
                  <Form.Group className="mb-2">
                    <Form.Label className="caLabel">Gallery Images</Form.Label>
                    <Form.Control
                      className="caControl"
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

                  {/* Existing Gallery */}
                  {existingGalleryUrls.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-2 caSectionTitle">Current Gallery</div>

                      <div className="caGalleryGrid">
                        {existingGalleryUrls.map((src, i) => (
                          <div key={i} className="caGalleryItem">
                            <img
                              src={src}
                              alt={`gallery-${i}`}
                              className="caGalleryImg"
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />

                            <button
                              type="button"
                              onClick={() => removeExistingGalleryAt(i)}
                              title="Remove"
                              aria-label="Remove"
                              className="caGalleryRemove"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="caHint">
                        Removed images will be saved after you click “Save
                        Changes”.
                      </div>
                    </div>
                  )}

                  {/* New Gallery */}
                  {galleryPreviews.length > 0 && (
                    <div className="mt-3">
                      <div className="caGalleryTop">
                        <div className="mb-2 caSectionTitle">New Images</div>

                        <button
                          type="button"
                          onClick={clearNewGallery}
                          className="caClearBtn"
                          title="Remove all new images"
                        >
                          Clear
                        </button>
                      </div>

                      <div className="caGalleryGrid">
                        {galleryPreviews.map((src, i) => (
                          <div key={i} className="caGalleryItem">
                            <img
                              src={src}
                              alt={`gallery-new-${i}`}
                              className="caGalleryImg"
                            />

                            <button
                              type="button"
                              onClick={() => removeNewGalleryAt(i)}
                              title="Remove"
                              aria-label="Remove"
                              className="caGalleryRemove"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!existingGalleryUrls.length && !galleryPreviews.length ? (
                    <div className="caEmptyHint">No gallery images yet.</div>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  className="w-100 caSubmitBtn"
                  disabled={!canSubmit}
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Container>
    </div>
  );
}
