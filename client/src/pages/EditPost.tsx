import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../API/posts";
import { NewsPost } from "../interface/NewsPost";

export default function EditPost() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [post, setPost] = useState<NewsPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        const loadPost = async () => {
            try {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post) return;
        await updatePost(post.id, { title: post.title, text: post.text });
        navigate(`/post/${post.id}`);
    };

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return null;

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h2>Редагувати пост</h2>
            <input
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                required
            />
            <textarea
                value={post.text}
                onChange={(e) => setPost({ ...post, text: e.target.value })}
                required
            />
            <button type="submit">Зберегти зміни</button>
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