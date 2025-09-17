import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { deletePost } from "./API/posts";
import  type { NewsPost } from "./interface/NewsPost";

export default function NewsList() {
    const [posts, setPosts] = useState<NewsPost[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [hasMore, setHasMore] = useState(true);
    const page = Number(searchParams.get("page") || 0);
    const size = Number(searchParams.get("size") || 4);
    useEffect(() => {
        fetch(`/api/newsposts?page=${page}&size=${size}`)
            .then(res => res.json())
            .then(data => {
                console.log("Fetched data", data);
                setPosts(data.posts ?? data);
                setHasMore((data.posts ?? data).length === size);
            })
            .catch(console.error);
    }, [page, size]);

    const handlePrev = () => {
        const newPage = Math.max(0, page - 1);
        setSearchParams({ page: String(newPage), size: String(size) });
    };

    const handleNext = () => {
        const newPage = page + 1;
        setSearchParams({ page: String(newPage), size: String(size) });
    };
    const handleDelete = async (id: number) => {
        try {
            setPosts(posts.filter(post => post.id !== id));
                await deletePost(id);
                window.alert("Пост видалено");
            } 
        catch (err) {
            console.error("Не вдалося видалити пост", err);
        }
        }        
    return (
        <div>
            <h2>Новини</h2>
            {posts.map(post => (
                <div key={post.id} style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }} >
                <h3>{post.header}</h3>
                <button onClick={() => handleDelete(post.id)} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "1.5rem" }}>❌</button>
                </div>
                    
                    <p className="clamped-text">{post.text}</p>
                    <Link to={`/post/${post.id}`}>Читати більше</Link>
                </div>
            ))}

            <div style={{ marginTop: "2rem" }}>
                <button onClick={handlePrev} disabled={page === 0}>⬅ Попередня</button>
                <span style={{ margin: "0 1rem" }}>Сторінка {page + 1}</span>
                <button onClick={handleNext} disabled={!hasMore}>Наступна ➡</button>
            </div>
        </div>
    );
}