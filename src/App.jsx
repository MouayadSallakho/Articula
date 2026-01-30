import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "aos/dist/aos.css";
import AOS from "aos";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Account from "./pages/Account";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import FaqPage from "./pages/FaqPage";
import Jops from "./pages/Jops";
import BlogList from "./pages/BlogList";
import ArticleDetails from "./pages/ArticleDetails";
import CreateArticle from "./pages/CreateArticle";
import MyArticles from "./pages/MyArticles";
import EditArticle from "./pages/EditArticle";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminArticles from "./pages/admin/AdminArticles";
import AdminUsers from "./pages/admin/AdminUsers";

import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 120 });
  }, []);

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/jobs" element={<Jops />} />

      {/* Article details عادة public */}
      <Route path="/articles/:id" element={<ArticleDetails />} />

      {/* Protected pages */}
      <Route
        path="/blog"
        element={
          <ProtectedRoute>
            <BlogList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />

      <Route
        path="/articles/create"
        element={
          <ProtectedRoute>
            <CreateArticle />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-articles"
        element={
          <ProtectedRoute>
            <MyArticles />
          </ProtectedRoute>
        }
      />

      <Route
        path="/articles/edit/:id"
        element={
          <ProtectedRoute>
            <EditArticle />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="articles" element={<AdminArticles />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
