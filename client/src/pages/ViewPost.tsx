import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { deletePost, getPostById } from "../API/posts";
import { NewsPost } from "../interface/NewsPost";

export default function ViewPost() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<NewsPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
const navigate = useNavigate()
    useEffect(() => {
        const loadPost = async () => {
            try {
                if (!id) return;
                const data = await getPostById(Number(id));
                if (!data) {
                    setError("Пост не знайдено");
                } else {
                    setPost(data);
                }
            } catch (err) {
                setError("Помилка при завантаженні поста");
            } finally {
                setLoading(false);
            }
        };
        loadPost();
    }, [id]);

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return null;
const handleDelete = async () => {
    if (!id) return;
    try {
            await deletePost(Number(id));
            alert("Пост видалено");
            navigate("/posts");
        } catch (err) {
            alert("Не вдалося видалити пост");
        }  
}
    return (
        <div style={postStyle}>
            <div style={{ display: "flex", justifyContent: "space-between" }} >
                <h1>{post.title}</h1>
                <button onClick={handleDelete} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "1.5rem" }}>❌</button>
            </div>
            <p>{post.text}</p>
            <p><strong>Жанр:</strong> {post.genre}</p>
            <p><strong>Приватна:</strong> {post.isPrivate ? "Так" : "Ні"}</p>
            <small>Створено: {new Date(post.createDate).toLocaleString()}</small>
            <div style={{ marginTop: "1rem" }}>
                <Link to={`/edit/${post.id}`}>Редагувати</Link> | <Link to="/">На головну</Link>
            </div>
        </div>
    );
}

const postStyle: React.CSSProperties = {
    padding: "2rem",
    maxWidth: "800px",
    margin: "0 auto",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};