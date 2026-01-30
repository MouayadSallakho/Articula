// src/api/blogApi.js
import { apiRequest } from "./request";
import { ApiConfig } from "./ApiConfig";

// يساعدنا نعمل URL كامل للصور
export function toAbsUrl(path) {
  if (!path) return "";
  const p = String(path).trim();
  if (!p) return "";
  if (p.startsWith("http")) return p;

  const base = ApiConfig.BASE_URL_TAMKEEN.replace(/\/api\/?$/, "");
  return base + p;
}

// دالة داخلية لعمل request
function callBlogsApi({ params, username, password }) {
  const endpoint = `/blogs-api?${params.toString()}`;
  return apiRequest({
    endpoint,
    method: "GET",
    username,
    password,
    extraHeaders: { Accept: "application/json" },
  });
}

/**
 * ✅ getBlogList مع fallback تلقائي
 * - إذا الـ API ما بيحب page/items_per_page/sort params وبيعمل rows=[] pager=null
 *   منعيد الطلب بدونهم
 */
export function getBlogList({
  page = 0,
  itemsPerPage = 6,
  search = "",
  category = "",
  tag = "",
  sortBy = "created_date",
  sortOrder = "DESC",
  username,
  password,
} = {}) {
  const params = new URLSearchParams();

  // مهم: مثل users-list
  params.set("_format", "json");

  // جرّب أولاً بالـ paging + sort (إذا الباك يدعمهم)
  params.set("items_per_page", String(itemsPerPage));
  params.set("page", String(page));

  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (tag) params.set("tag", tag);

  if (sortBy) params.set("sort_by", sortBy);
  if (sortOrder) params.set("sort_order", sortOrder);

  // 1) الطلب الأساسي
  return callBlogsApi({ params, username, password }).then((res) => {
    const rows = Array.isArray(res?.rows) ? res.rows : [];
    const pager = res?.pager ?? null;

    // ✅ إذا رجع فاضي مثل مشكلتك بالضبط: rows=[] و pager=null
    // جرّب fallback بدون paging/sort
    const looksBrokenPaging = rows.length === 0 && !pager;

    if (looksBrokenPaging) {
      const params2 = new URLSearchParams();
      params2.set("_format", "json");

      // نخلي فقط الفلاتر اللي ممكن تكون مدعومة
      if (search) params2.set("search", search);
      if (category) params2.set("category", category);
      if (tag) params2.set("tag", tag);

      // (لا page / لا items_per_page / لا sort_by)
      return callBlogsApi({ params: params2, username, password });
    }

    return res;
  });
}

// ✅ Article Details
export function getArticleDetails({ id, username, password }) {
  const endpoint = `/node/${id}?_format=json`;
  return apiRequest({
    endpoint,
    method: "GET",
    username,
    password,
    extraHeaders: { Accept: "application/json" },
  });
}

// ✅ Author Profile
export function getUserProfileById({ uid, username, password }) {
  const endpoint = `/user/${uid}?_format=json`;
  return apiRequest({
    endpoint,
    method: "GET",
    username,
    password,
    extraHeaders: { Accept: "application/json" },
  });
}
