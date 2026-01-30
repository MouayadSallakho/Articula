// src/hooks/useMyArticles.js
import { useEffect, useMemo, useState } from "react";
import { getMyArticlesCurrentUser } from "../api/articleServices";

function normalizeError(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  return err.message || "Request failed";
}

export function useMyArticles({ isLoggedIn, username, password }) {
  const [rows, setRows] = useState([]);
  const [pager, setPager] = useState(null);

  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // helper: reload manually if needed
  const [reloadKey, setReloadKey] = useState(0);
  function reload() {
    setReloadKey((k) => k + 1);
  }

  useEffect(() => {
    let cancelled = false;

    setError("");

    if (!isLoggedIn) {
      setRows([]);
      setPager(null);
      setLoading(false);
      setError("You must log in to view your articles.");
      return;
    }

    setLoading(true);

    getMyArticlesCurrentUser({ page, itemsPerPage, username, password })
      .then((data) => {
        if (cancelled) return;
        setRows(Array.isArray(data?.rows) ? data.rows : []);
        setPager(data?.pager || null);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(normalizeError(e));
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
  }, [isLoggedIn, username, password, page, itemsPerPage, reloadKey]);

  const totalPages = useMemo(() => Number(pager?.total_pages || 1), [pager]);
  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  return {
    rows,
    pager,

    page,
    setPage,

    itemsPerPage,
    setItemsPerPage,

    totalPages,
    canPrev,
    canNext,

    loading,
    error,

    reload,

    // helpful setters for UI actions:
    setRows,
    setPager,
    setError,
  };
}
