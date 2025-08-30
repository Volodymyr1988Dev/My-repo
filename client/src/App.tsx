import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import ViewPost from "./pages/ViewPost";
import NewsList from "./NewsList";
import SideBar from "sideBar/sideBar";
import Register from "./pages/Register";
import Login from "./pages/Login";
function App() {

  const [token, setToken] = useState<string | null>(sessionStorage.getItem("token"));
useEffect(() => {
    const handleStorageChange = () => {
      setToken(sessionStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  if (!token) {
    return (
      <div style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/create" element={<CreatePost />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/posts" />} />
          <Route path="/posts" element={<NewsList />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/post/:id" element={<ViewPost />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;