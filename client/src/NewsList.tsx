import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { NewsPost } from "./interface/NewsPost";

export default function NewsList() {
    const [posts, setPosts] = useState<NewsPost[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [hasMore, setHasMore] = useState(true);
    let page = Number(searchParams.get("page") || 0);
    let size = Number(searchParams.get("size") || 4);
    useEffect(() => {
        fetch(`/api/newsposts?page=${page}&size=${size}`)
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setHasMore(data.length === size);
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

    return (
        <div>
            <h2>Новини</h2>
            {posts.map(post => (
                <div key={post.id} style={{ marginBottom: "1rem" }}>
                    <h3>{post.title}</h3>
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