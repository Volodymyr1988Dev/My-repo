import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchAllPosts, deletePost } from "../API/posts";
import { NewsPost } from "../interface/NewsPost";

const Home = () => {
    const [posts, setPosts] = useState<NewsPost[]>([]);
    const navigate = useNavigate();
    const handleDelete = async (id: number) => {
        if (window.confirm("Ви впевнені, що хочете видалити цей пост?")) {
            try {
                await deletePost(id);
                setPosts(posts.filter((post) => post.id !== id));
            } catch (error) {
                console.error("Помилка при видаленні посту:", error);
            }
        }
    };
    useEffect(() => {
        fetchAllPosts().then(setPosts);
    }, []);

    return (
        <div>
            <h1>Новини</h1>
            {posts.map((post) => (
                <div
                    key={post.id}
                    onClick={() => navigate(`/post/${post.id}`)}
                    style={{...cardStyle, cursor: "pointer", position: "relative"}}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(post.id);
                        }}
                        style={deleteButtonStyle}
                        title="Видалити"
                    >
                        ❌
                    </button>
                    <h3>{post.header}</h3>
                    <p style={textClampStyle}>{post.text}</p>
                    <small>{new Date(post.createDate).toLocaleString()}</small>
                    <small>
                    Жанр: {post.genre} | {post.isPrivate ? "Приватна" : "Публічна"}
                    </small>
                    </div>
                    ))}
                    </div>
    );
};

const cardStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "1rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const textClampStyle: React.CSSProperties = {
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
};
const deleteButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "transparent",
    border: "none",
    color: "#c00",
    fontSize: "1rem",
    cursor: "pointer"
};

export default Home;