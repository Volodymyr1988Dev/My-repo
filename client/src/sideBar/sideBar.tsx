import React from "react";
import { useNavigate } from "react-router-dom";
//import {API_URL} from "../API/posts";

const SideBar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
  sessionStorage.removeItem('token');
   window.dispatchEvent(new Event("storage"));
  navigate("/login");
};
    return (
        <div style={{ width: "200px", padding: "1rem", background: "#f0f0f0" }}>
            <button onClick={() => navigate("/posts")}>🏠 Home</button>
            <button onClick={() => navigate("/create")}>➕ Створити новину</button>
            <button onClick={() => navigate(-1)}>↩️ Назад</button>
            <button onClick={handleLogout}>🚪 Log out</button>
        </div>
    );
};

export default SideBar;