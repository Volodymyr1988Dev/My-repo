import { Gennre } from "../enum/enum";


export const API_URL = `${import.meta.env.VITE_API_URL}/newsposts`;

export const fetchAllPosts = async () => {
    const res = await fetch(API_URL);
    return res.json();
};

export const getPostById = async (id: number) => {
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
};

export const createNewPost = async (post: { header: string; text: string; genre: Gennre; isPrivate: boolean }, 
    token: string | null = sessionStorage.getItem("token")
) => {
    if (!token) {
        throw new Error("No authentication token provided");
    }
    console.log("Creating post with token, lower +Bearer:", token);
    const res = await fetch(API_URL, {
        method: "POST",
       headers: {
            "Content-Type": "application/json",
            "Authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}`,
            },
        body: JSON.stringify(post),
    });
    if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create post");
    }
    return res.json();
};

export const updatePost = async (id: number, data: { header?: string; text?: string; genre?: Gennre; isPrivate?: boolean }) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
        throw new Error("No authentication token provided");
    }
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
             "Authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}`,
         },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const deletePost = async (id: number) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
        throw new Error("No authentication token provided");
    }

    const res = await fetch(`${API_URL}/${id}`, { 
        method: "DELETE", 
        headers: {
            "Content-Type": "application/json",
            "Authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        }
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to parse error response" }));
        throw new Error(err.message || "Failed to delete post");
    }

    return res.json();
};