import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewPost } from "../API/posts";
import { Gennre } from "enum/enum";


export default function CreatePost() {
    const [header, setHeader] = useState("");
    const [text, setText] = useState("");
    const [genre, setGenre] = useState<Gennre>(Gennre.POLITIC);
    const [isPrivate, setIsPrivate] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
        const newPost = await createNewPost({ header, text, genre, isPrivate });
        console.log("New post created:", newPost);
        alert("Пост успішно створено!");
        navigate("/posts");
        }
        catch (err: any) {
            console.error("Error creating post:", err);
            alert(err.message || "Failed to create post");
        } 
  };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h2>Створити новину</h2>
            <input
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                placeholder="Заголовок"
                required
            />
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Текст"
                required
            />
            <label>
                Жанр:
                <select value={genre} onChange={(e) => setGenre(e.target.value as Gennre)}>
                    {Object.values(Gennre).map((g) => (
                        <option key={g} value={g}>
                            {g}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Приватна новина:
                <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
            </label>
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