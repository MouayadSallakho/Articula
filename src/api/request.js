// src/api/request.js
import { ApiConfig } from "./ApiConfig";

function buildBasicAuth(username, password) {
  if (!username || !password) return null;
  return "Basic " + btoa(username + ":" + password);
}

// ✅ JSON requests (GET/POST/PATCH...)
export function apiRequest({
  endpoint,
  method = "GET",
  body,
  username,
  password,
  parseAs = "json",
  extraHeaders = {},
}) {
  const url = ApiConfig.BASE_URL_TAMKEEN + endpoint;

  const headers = {};

  // Add JSON content type if body exists
  if (body) headers["Content-Type"] = "application/json";

  // Basic Auth if provided
  const auth = buildBasicAuth(username, password);
  if (auth) headers["Authorization"] = auth;

  // Merge extra headers (Accept, X-CSRF-Token, etc.)
  Object.assign(headers, extraHeaders);

  return fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
    .then((res) => {
      const reader = parseAs === "text" ? res.text() : res.json();

      return reader.then((data) => {
if (!res.ok) {
  const msg =
    data && data.message ? data.message : `Request failed (${res.status})`;
  const err = new Error(msg);
  err.status = res.status;
  err.data = data;
  throw err;
}
        return data;
      });
    })
    .finally(() => {
      console.log("Request finished");
    });
}

// ✅ Upload file as octet-stream (binary)
export function uploadOctetStream({
  endpoint,
  file,
  filename,
  username,
  password,
  csrfToken,
}) {
  const url = ApiConfig.BASE_URL_TAMKEEN + endpoint;

  const auth = buildBasicAuth(username, password);
  if (!auth) return Promise.reject(new Error("Missing username/password"));
  if (!csrfToken) return Promise.reject(new Error("Missing csrfToken"));
  if (!file) return Promise.reject(new Error("Missing file"));

  const headers = {
    "Content-Type": "application/octet-stream",
    "Content-Disposition": `file; filename="${filename || file.name}"`,
    "X-CSRF-Token": csrfToken,
    Accept: "application/json",
    Authorization: auth,
  };

  return fetch(url, {
    method: "POST",
    headers,
    body: file,
  })
    .then((res) => {
      return res.json().then((data) => {
 if (!res.ok) {
  const msg = data?.message || `Upload failed (${res.status})`;
  const err = new Error(msg);
  err.status = res.status;
  err.data = data;
  throw err;
}
        return data;
      });
    })
    .finally(() => {
      console.log("Upload finished");
    });
}
