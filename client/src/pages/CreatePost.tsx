import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewPost } from "../API/posts";

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createNewPost({ title, text });
        navigate("/");
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h2>Створити новину</h2>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Заголовок"
                required
            />
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Текст"
                required
            />
            <button type="submit">Опублікувати</button>
        </form>
    );
}

const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "2rem",
    maxWidth: "600px",
};