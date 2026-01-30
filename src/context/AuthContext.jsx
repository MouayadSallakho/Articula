import React, { createContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/request";
import { ApiConfig } from "../api/ApiConfig";

export const AuthContext = createContext(null);

const STORAGE_KEY = "tamkeen_auth_v1";

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveStoredAuth(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }) {
  // ✅ initialize من localStorage (هاي أهم نقطة لحل refresh)
  const stored = useMemo(() => loadStoredAuth(), []);
  const [currentUser, setCurrentUser] = useState(stored?.currentUser || null);
  const [username, setUsername] = useState(stored?.username || "");
  const [password, setPassword] = useState(stored?.password || "");
  const [csrfToken, setCsrfToken] = useState(stored?.csrfToken || "");
  const [logoutToken, setLogoutToken] = useState(stored?.logoutToken || "");
  const [loading, setLoading] = useState(false);

  // ✅ كل ما تتغير بيانات auth خزّنها
  useEffect(() => {
    const data = {
      currentUser,
      username,
      password,
      csrfToken,
      logoutToken,
    };

    // إذا ما في user → لا نخزّن
    if (!currentUser) {
      clearStoredAuth();
      return;
    }

    saveStoredAuth(data);
  }, [currentUser, username, password, csrfToken, logoutToken]);

  function login(name, pass) {
    setLoading(true);

    return apiRequest({
      endpoint: ApiConfig.ENDPOINTS.LOGIN,
      method: "POST",
      body: { name, pass },
      parseAs: "json",
      extraHeaders: { Accept: "application/json" },
    })
      .then((res) => {
        // response: { current_user, csrf_token, logout_token }
        const cu = res?.current_user || res?.currentUser; // احتياط إذا صار camelCase
        const c = res?.csrf_token || res?.csrfToken || "";
        const lt = res?.logout_token || res?.logoutToken || "";

        if (!cu) throw new Error("Login failed: current_user not found");

        setCurrentUser(cu);
        setUsername(name);
        setPassword(pass);
        setCsrfToken(c);
        setLogoutToken(lt);

        return res;
      })
      .catch((err) => {
        // إذا فشل login لا تترك بيانات قديمة
        setCurrentUser(null);
        setUsername("");
        setPassword("");
        setCsrfToken("");
        setLogoutToken("");
        clearStoredAuth();
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function logout() {
    // ✅ حتى لو logout endpoint فيه مشاكل: نحن نمسح محليًا أكيد
    setLoading(true);

    return Promise.resolve()
      .then(() => {
        // إذا عندك endpoint logout لاحقًا منضيفه هون
      })
      .catch(() => {})
      .finally(() => {
        setCurrentUser(null);
        setUsername("");
        setPassword("");
        setCsrfToken("");
        setLogoutToken("");
        clearStoredAuth();
        setLoading(false);
      });
  }

  const value = {
    currentUser,
    username,
    password,
    csrfToken,
    logoutToken,
    loading,
    isLoggedIn: !!currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
