// src/api/userServices.js
import { apiRequest } from "./request";

function callUsersList({ params, username, password }) {
  const endpoint = `/users-list?${params.toString()}`;
  return apiRequest({
    endpoint,
    method: "GET",
    username,
    password,
    extraHeaders: { Accept: "application/json" },
  });
}

export function getUsersList({
  page = 0,
  itemsPerPage = 25,
  name = "",
  field_name = "",
  field_surname = "",
  mail = "",
  field_gender = "",
  status = "1",
  username,
  password,
} = {}) {
  const params = new URLSearchParams();

  // لازم
  params.set("_format", "json");

  // Filters
  if (name !== "") params.set("name", name || "");
  if (field_name !== "") params.set("field_name", field_name || "");
  if (field_surname !== "") params.set("field_surname", field_surname || "");

  // بعض السيرفرات بتستقبل mail حتى لو فاضي
  if (mail !== "") params.set("mail", mail || "");

  if (field_gender !== "" && field_gender !== null && field_gender !== undefined) {
    params.set("field_gender", String(field_gender));
  }

  // مهم: إذا status = "" ما نبعتو (حتى يجيب الكل)
  if (status !== "" && status !== null && status !== undefined) {
    params.set("status", String(status));
  }

  // ✅ أول محاولة: مع pagination (إذا الباك يدعمها)
  params.set("page", String(page));
  params.set("items_per_page", String(itemsPerPage));

  return callUsersList({ params, username, password }).then((res) => {
    const rows1 = Array.isArray(res?.rows) ? res.rows : [];
    const pager1 = res?.pager ?? null;

    // ✅ إذا رجع فاضي + pager null → يعني الباك ما عم يدعم page/items_per_page
    const looksBrokenPaging = rows1.length === 0 && !pager1;

    if (!looksBrokenPaging) return res;

    // ✅ Fallback: أعد الطلب بدون page/items_per_page
    const params2 = new URLSearchParams(params);
    params2.delete("page");
    params2.delete("items_per_page");

    return callUsersList({ params: params2, username, password }).then((res2) => {
      // إذا رجعت قائمة كبيرة، وخاصّة بالداشبورد بدنا فقط itemsPerPage
      const rows2 = Array.isArray(res2?.rows) ? res2.rows : [];
      const pager2 = res2?.pager ?? null;

      // قصّ النتائج محليًا فقط لما نحتاج
      const sliced = rows2.slice(0, Number(itemsPerPage || 25));

      // حافظ على شكل الريسبونس
      return {
        ...res2,
        rows: sliced,
        pager: pager2 || res2?.pager || null,
      };
    });
  });
}
