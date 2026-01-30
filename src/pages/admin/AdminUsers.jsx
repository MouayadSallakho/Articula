// src/pages/admin/AdminUsers.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";

import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { getUsersList } from "../../api/userServices";
import { toAbsUrl } from "../../api/articleServices";

function normalizeError(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  return err.message || "Request failed";
}

// يسحب src من <img ... src="...">
function extractImgSrc(html) {
  if (!html) return "";
  const s = String(html);
  const m = s.match(/src="([^"]+)"/i);
  return m ? m[1] : "";
}

// يسحب النص من <time>...</time>
function stripTags(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, "").trim();
}

export default function AdminUsers() {
  const { isLoggedIn, username, password } = useContext(AuthContext);

  // data
  const [rows, setRows] = useState([]);
  const [pager, setPager] = useState(null);

  // ui state
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // pagination
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // ✅ Server-side filters (API)
  const [name, setName] = useState(""); // username (name)
  const [firstName, setFirstName] = useState(""); // field_name
  const [surname, setSurname] = useState(""); // field_surname
  const [mail, setMail] = useState(""); // mail
  const [status, setStatus] = useState("1"); // 1 active, 0 blocked, "" all
  const [gender, setGender] = useState(""); // 9 / 10 / "" all

  const totalPages = Number(pager?.total_pages || 1);
  const totalItems = Number(pager?.total_items || rows.length || 0);
  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  // ✅ reset page when any filter changes
  useEffect(() => {
    setPage(0);
  }, [itemsPerPage, name, firstName, surname, mail, status, gender]);

  function fetchUsers() {
    setLoading(true);
    setErrMsg("");

    return getUsersList({
      page,
      itemsPerPage,
      name,
      field_name: firstName,
      field_surname: surname,
      mail,
      field_gender: gender,
      status,
      username,
      password,
    })
      .then((data) => {
        setRows(Array.isArray(data?.rows) ? data.rows : []);
        setPager(data?.pager || null);
      })
      .catch((e) => {
        setErrMsg(normalizeError(e));
        setRows([]);
        setPager(null);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, page, itemsPerPage, name, firstName, surname, mail, status, gender]);

  const activeFiltersText = useMemo(() => {
    const parts = [];
    if (name) parts.push(`Username: ${name}`);
    if (firstName) parts.push(`First name: ${firstName}`);
    if (surname) parts.push(`Surname: ${surname}`);
    if (mail) parts.push(`Email: ${mail}`);
    if (status === "1") parts.push("Status: Active");
    else if (status === "0") parts.push("Status: Blocked");
    else parts.push("Status: All");
    if (gender) parts.push(`Gender: ${gender}`);
    return parts.join(" • ");
  }, [name, firstName, surname, mail, status, gender]);

  function onReset() {
    setName("");
    setFirstName("");
    setSurname("");
    setMail("");
    setStatus("1");
    setGender("");
    setItemsPerPage(25);
    setPage(0);
  }

  if (!isLoggedIn) {
    return (
      <div>
        <Header />
        <Container className="py-4">
          <Alert variant="warning">You must login to access admin.</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div>
      {/* <Header /> */}

      <Container className="py-4">
        <Row>
          <Col>
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h2 className="m-0">Admin • Users</h2>
                <div className="text-muted">Server-side filtering using API query params.</div>
              </div>

              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  style={{ width: 170 }}
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>

                <Button variant="outline-secondary" onClick={onReset}>
                  Reset
                </Button>
              </div>
            </div>

            {/* Filters row */}
            <Row className="g-2 align-items-end mb-3">
              <Col md={3}>
                <Form.Label className="mb-1">Username</Form.Label>
                <div className="d-flex align-items-center gap-2 border rounded px-3 py-2 bg-white">
                  <FiSearch />
                  <input
                    style={{ border: "none", outline: "none", width: "100%" }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="name=..."
                  />
                </div>
              </Col>

              <Col md={3}>
                <Form.Label className="mb-1">First name</Form.Label>
                <input
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="field_name=..."
                />
              </Col>

              <Col md={3}>
                <Form.Label className="mb-1">Surname</Form.Label>
                <input
                  className="form-control"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="field_surname=..."
                />
              </Col>

              <Col md={3}>
                <Form.Label className="mb-1">Email</Form.Label>
                <input
                  className="form-control"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  placeholder="mail=..."
                />
              </Col>

              <Col md={3}>
                <Form.Label className="mb-1">Status</Form.Label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="1">Active</option>
                  <option value="0">Blocked</option>
                  <option value="">All</option>
                </select>
              </Col>

              <Col md={3}>
                <Form.Label className="mb-1">Gender</Form.Label>
                <select
                  className="form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </Col>

              <Col md={6} className="text-muted">
                <div className="small">
                  Active filters: <b>{activeFiltersText || "None"}</b>
                </div>
                <div className="small">
                  Page <b>{page + 1}</b> / <b>{totalPages}</b> • Total{" "}
                  <b>{totalItems}</b>
                </div>
              </Col>
            </Row>

            {errMsg ? <Alert variant="danger">{errMsg}</Alert> : null}

            {loading ? (
              <div className="p-3 bg-white rounded border">Loading...</div>
            ) : rows.length === 0 ? (
              <div className="p-3 bg-white rounded border">No users found.</div>
            ) : (
              <div className="table-responsive bg-white rounded border">
                <table className="table mb-0 align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: 80 }}>UID</th>
                      <th style={{ width: 80 }}>Pic</th>
                      <th>Username</th>
                      <th>Name</th>
                      <th>Surname</th>
                      <th>Email</th>
                      <th style={{ width: 140 }}>Mobile</th>
                      <th style={{ width: 110 }}>Gender</th>
                      <th style={{ width: 160 }}>Created</th>
                      <th style={{ width: 160 }}>Last login</th>
                      <th style={{ width: 90 }}>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((u) => {
                      const uid = u?.uid;
                      const imgSrc = extractImgSrc(u?.user_picture);
                      const absImg = imgSrc ? toAbsUrl(imgSrc) : "";

                      return (
                        <tr key={String(uid)}>
                          <td>{uid}</td>
                          <td>
                            {absImg ? (
                              <img
                                src={absImg}
                                alt={u?.name || "user"}
                                style={{
                                  width: 44,
                                  height: 44,
                                  objectFit: "cover",
                                  borderRadius: 10,
                                }}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "";
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: 10,
                                  background: "#f3effe",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 700,
                                  color: "#6341af",
                                }}
                              >
                                {(String(u?.name || "U").trim()[0] || "U").toUpperCase()}
                              </div>
                            )}
                          </td>

                          <td>{u?.name || "—"}</td>
                          <td>{u?.field_name || "—"}</td>
                          <td>{u?.field_surname || "—"}</td>
                          <td>{u?.mail || "—"}</td>
                          <td>{u?.field_mobile || "—"}</td>
                          <td>{u?.field_gender || "—"}</td>
                          <td>{stripTags(u?.created) || "—"}</td>
                          <td>{stripTags(u?.login) || "—"}</td>
                          <td>{String(u?.status) === "1" ? "Active" : "Blocked"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && !errMsg && totalPages > 1 ? (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                  variant="outline-secondary"
                  disabled={!canPrev}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </Button>

                <div className="text-muted">
                  Page <b>{page + 1}</b> of <b>{totalPages}</b> • Total{" "}
                  <b>{totalItems}</b>
                </div>

                <Button
                  variant="outline-secondary"
                  disabled={!canNext}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
