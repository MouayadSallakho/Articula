// src/api/articleServices.js
import { ApiConfig } from "./ApiConfig";
import { apiRequest, uploadOctetStream } from "./request";

/* =========================
   Helpers
========================= */

// ✅ تحويل "/sites/..." إلى رابط كامل (للصور)
export function toAbsUrl(path) {
  if (!path) return "";
  const p = String(path).trim();
  if (!p) return "";
  if (p.startsWith("http")) return p;

  // BASE_URL_TAMKEEN = "https://tamkeen-dev.com/api"
  // remove trailing "/api" to avoid api/api
  const base = ApiConfig.BASE_URL_TAMKEEN.replace(/\/api\/?$/, "");
  return base + p;
}

/* =========================
   CSRF
========================= */

// ✅ 1) get CSRF token (TEXT)
export function getCsrfToken() {
  return apiRequest({
    endpoint: ApiConfig.ENDPOINTS.SESSION_TOKEN,
    method: "GET",
    parseAs: "text",
    extraHeaders: { Accept: "text/plain" },
  }).finally(() => {
    console.log("CSRF done");
  });
}

/* =========================
   Upload Banner
========================= */

// ✅ 2) Upload banner (single image)
export function uploadBanner({ file, csrfToken, username, password }) {
  return uploadOctetStream({
    endpoint: ApiConfig.ENDPOINTS.UPLOAD_BLOG_BANNER,
    file,
    filename: file?.name,
    username,
    password,
    csrfToken,
  }).finally(() => {
    console.log("Banner upload finished");
  });
}

/* =========================
   Upload Gallery
========================= */

// ✅ 3) Upload gallery (multiple)
export function uploadGallery({ files, csrfToken, username, password }) {
  const arr = Array.from(files || []);
  if (arr.length === 0) return Promise.resolve([]);

  const uploads = arr.map((file) => {
    return uploadOctetStream({
      endpoint: ApiConfig.ENDPOINTS.UPLOAD_BLOG_GALLERY,
      file,
      filename: file.name,
      username,
      password,
      csrfToken,
    });
  });

  return Promise.all(uploads).finally(() => {
    console.log("Gallery upload finished");
  });
}

/* =========================
   Create Article
========================= */

// ✅ 4) Create article
export function createArticle({
  title,
  body,
  categoryId,
  tagIds,
  bannerFid,
  galleryFids,
  csrfToken,
  username,
  password,
}) {
  if (!bannerFid) return Promise.reject(new Error("Banner image is required."));

  const payload = {
    type: [{ target_id: "blog" }],
    title: [{ value: title }],
    body: [{ value: body, format: "basic_html" }],
    field_category: [{ target_id: Number(categoryId) || 0 }],
    field_tags: (tagIds || []).map((id) => ({ target_id: Number(id) })),
    field_image: [{ target_id: Number(bannerFid) }],
    field_gallery: (galleryFids || []).map((fid) => ({
      target_id: Number(fid),
    })),
  };

  return apiRequest({
    endpoint: ApiConfig.ENDPOINTS.CREATE_BLOG_NODE,
    method: "POST",
    body: payload,
    username,
    password,
    extraHeaders: {
      Accept: "application/json",
      "X-CSRF-Token": csrfToken,
    },
  }).finally(() => {
    console.log("Create article finished");
  });
}

/* =========================
   My Articles - Current User
========================= */

// ✅ 5) Get My Articles (current user)
// ✅ GET لا يحتاج CSRF
export function getMyArticlesCurrentUser({
  page = 0,
  itemsPerPage = 10,
  username,
  password,
}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("items_per_page", String(itemsPerPage));

  return apiRequest({
    endpoint: `${
      ApiConfig.ENDPOINTS.MY_ARTICLES_CURRENT_USER
    }?${params.toString()}`,
    method: "GET",
    username,
    password,
    extraHeaders: { Accept: "application/json" },
  }).finally(() => {
    console.log("My Articles finished");
  });
}

/* =========================
   Update Article (PATCH)
========================= */

export function updateArticle({
  nodeId,
  payload, // body like Postman
  csrfToken,
  username,
  password,
}) {
  if (!nodeId) return Promise.reject(new Error("Missing nodeId"));
  if (!payload) return Promise.reject(new Error("Missing payload"));

  return apiRequest({
    endpoint: `${ApiConfig.ENDPOINTS.NODE}/${nodeId}?_format=json`,
    method: "PATCH",
    body: payload,
    username,
    password,
    extraHeaders: {
      Accept: "application/json",
      "X-CSRF-Token": csrfToken,
    },
  }).finally(() => {
    console.log("Update article finished");
  });
}

/* =========================
   Delete Article (DELETE)
========================= */

// ✅ Keep your original delete logic (best for 204/no body)
export function deleteArticle({ nodeId, csrfToken, username, password }) {
  // We’ll reuse Basic Auth through request.js style,
  // but to keep it simple and safe we do inline minimal here.

  if (!username || !password)
    return Promise.reject(new Error("Missing username/password"));
  if (!csrfToken) return Promise.reject(new Error("Missing csrfToken"));
  if (!nodeId) return Promise.reject(new Error("Missing nodeId"));

  const auth = "Basic " + btoa(username + ":" + password);

  const url =
    ApiConfig.BASE_URL_TAMKEEN +
    ApiConfig.ENDPOINTS.NODE +
    `/${nodeId}?_format=json`;

  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
      Authorization: auth,
      Accept: "application/json",
    },
  })
    .then((res) => {
      if (res.status === 204) return { ok: true };

      return res.text().then((text) => {
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = text;
        }

        if (!res.ok) {
          const msg =
            data && data.message
              ? data.message
              : `Delete failed (${res.status})`;
          throw new Error(msg);
        }
        return data || { ok: true };
      });
    })
    .finally(() => {
      console.log("Delete article finished");
    });
}
