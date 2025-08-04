import React from "react";
import {Routes, Route, Link, Navigate} from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import ViewPost from "./pages/ViewPost";
import Home from "./pages/Home";
import SideBar from "./sideBar/sideBar";
import {API_URL} from "./API/posts";
import NewsList from "./NewsList"; // винеси твою домашню логіку сюди

function App() {
  return (
      <div style={{display: "flex"}}>
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

export default App;