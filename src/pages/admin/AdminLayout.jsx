import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../../components/Header";
import "./admin.css";

export default function AdminLayout() {
  return (
    <div className="admin-root">
      {/* Header already uses <Container> internally */}
      <Header />

      {/* ✅ Make admin body use same Bootstrap container padding as header */}
      <Container className="admin-body-container">
        <Row className="g-0 admin-body-row">
          {/* Sidebar */}
          <Col xs={12} lg={3} xl={2} className="admin-sidebar-col">
            <aside className="admin-sidebar">
              <div className="admin-brand">Admin Panel</div>

              <nav className="admin-nav">
                <NavLink to="/admin" end className="admin-link">
                  Dashboard
                </NavLink>
                <NavLink to="/admin/articles" className="admin-link">
                  Articles
                </NavLink>
                <NavLink to="/admin/users" className="admin-link">
                  Users
                </NavLink>
              </nav>
            </aside>
          </Col>

          {/* Content */}
          <Col xs={12} lg={9} xl={10} className="admin-content-col">
            <main className="admin-main">
              <div className="admin-content">
                <Outlet />
              </div>
            </main>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
