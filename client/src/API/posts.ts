export const API_URL = "/api/newsposts";

export const fetchAllPosts = async () => {
    const res = await fetch(API_URL);
    return res.json();
};

export const getPostById = async (id: number) => {
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
};

export const createNewPost = async (post: { title: string; text: string }) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
    });
    return res.json();
};

export const updatePost = async (id: number, data: { title?: string; text?: string }) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const deletePost = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};