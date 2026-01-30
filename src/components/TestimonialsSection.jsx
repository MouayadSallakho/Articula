// src/components/TestimonialsSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { ApiConfig } from "../api/ApiConfig";
import { toAbsUrl } from "../api/blogApi";
import "./TestimonialsSection.css";

/* ---------- Helpers ---------- */
function clampRating(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, Math.round(n)));
}

function getInitials(name) {
  const s = String(name || "").trim();
  if (!s) return "?";
  return s.charAt(0).toUpperCase();
}

function Stars({ value = 0 }) {
  const r = clampRating(value);
  const full = "★".repeat(r);
  const empty = "☆".repeat(5 - r);

  return (
    <div className="tStars" aria-label={`Rating ${r} out of 5`}>
      <span className="tStarsFull">{full}</span>
      <span className="tStarsEmpty">{empty}</span>
    </div>
  );
}

/* ---------- Skeleton ---------- */
function TestimonialSkeleton() {
  return (
    <div className="tItem">
      <div className="tLeft">
        <div className="tSkel tSkelAvatar" />
      </div>
      <div className="tRight">
        <div className="tSkel tSkelLine w60" />
        <div className="tSkel tSkelLine w30" />
        <div className="tSkel tSkelLine w90" />
        <div className="tSkel tSkelLine w80" />
      </div>
    </div>
  );
}

/* ---------- Component ---------- */
export default function TestimonialsSection({ limit = 2, step = 2 }) {
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(Number(limit) || 2);

  const endpoint = useMemo(() => {
    return ApiConfig.BASE_URL_TAMKEEN + "/testimonials";
  }, []);

  function load() {
    setLoading(true);
    setErrMsg("");
    setVisibleCount(Number(limit) || 2);

    fetch(endpoint, { headers: { Accept: "application/json" } })
      .then((res) => {
        return res.json().then((data) => {
          if (!res.ok) {
            const msg =
              data?.message || `Failed to load testimonials (${res.status})`;
            throw new Error(msg);
          }
          return data;
        });
      })
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setItems(arr);
      })
      .catch((e) => {
        setErrMsg(e?.message || "Request failed");
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
        console.log("Testimonials request finished");
      });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useMemo(() => {
    const c = Math.max(1, Number(visibleCount) || 2);
    return (items || []).slice(0, c);
  }, [items, visibleCount]);

  const canLoadMore = !loading && !errMsg && items.length > visibleCount;

  return (
    <div className="articleTestimonialsSection">
      <div className="tHead">
        <div>
          <div className="tTitleRow">
            <h3 className="tTitle">Customer Reviews</h3>

            {!loading && !errMsg && (
              <span className="tCountPill">{items.length}</span>
            )}
          </div>

         <div className="tSub">Quick feedback from our customers ✨</div>
        </div>

        <Button
          variant="outline-secondary"
          className="tRefreshBtn"
          onClick={load}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="tList">
          <TestimonialSkeleton />
          <TestimonialSkeleton />
          <TestimonialSkeleton />
        </div>
      ) : errMsg ? (
        <div className="articleErrorBox">{errMsg}</div>
      ) : visible.length === 0 ? (
        <div className="sideMut">No testimonials yet.</div>
      ) : (
        <>
          <div className="tList">
            {visible.map((it, idx) => {
              const name = it?.full_name || "Anonymous";
              const img = it?.image ? toAbsUrl(it.image) : "";
              const rating = it?.rating || 0;
              const bodyHtml = it?.body || "";

              return (
                <div className="tItem" key={idx}>
                  <div className="tLeft">
                    {img ? (
                      <img className="tAvatar" src={img} alt={name} />
                    ) : (
                      <div className="tAvatarFallback">
                        {getInitials(name)}
                      </div>
                    )}
                  </div>

                  <div className="tRight">
                    <div className="tTopRow">
                      <div className="tName">{name}</div>
                      <Stars value={rating} />
                    </div>

                    <div
                      className="tBody"
                      dangerouslySetInnerHTML={{ __html: bodyHtml }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load more */}
          {canLoadMore && (
            <div className="tMoreWrap">
              <button
                type="button"
                className="tMoreListBtn"
                onClick={() =>
                  setVisibleCount((c) =>
                    Math.min(items.length, Number(c) + (Number(step) || 2))
                  )
                }
              >
              Show more reviews
              </button>
            </div>
          )}

          {/* Show less */}
          {!loading && !errMsg && items.length > (Number(limit) || 2) && visibleCount >= items.length && (
            <div className="tMoreWrap">
              <button
                type="button"
                className="tMoreListBtn"
                onClick={() => setVisibleCount(Number(limit) || 2)}
              >
               Show less
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
