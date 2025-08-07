import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import ViewPost from "./pages/ViewPost";
import NewsList from "./NewsList";
//import Home from "./pages/Home"; // винеси твою домашню логіку сюди
import SideBar from "sideBar/sideBar";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App2() {
  return (
   <div style={{display: "flex"}}>
        <Register/>
        <Login/>
        <SideBar/>
        <div style={{flex: 1, padding: "1rem"}}>
          <Routes>
            <Route path="/" element={<Navigate to="/api/newsposts"/>}/>
            <Route path="/api/newsposts" element={<NewsList/>}/>
            <Route path="/create" element={<CreatePost/>}/>
            <Route path="/edit/:id" element={<EditPost/>}/>
            <Route path="/post/:id" element={<ViewPost/>}/>
          </Routes>
        </div>
      </div>

  );
}

export default App2;