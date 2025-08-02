import {Router, Request, Response} from "express";
import {getAllPosts, getPostById, createPost, updatePost, deletePost} from "../API"

const router = Router();
function logRoute(method: string, path: string) {
    console.log(`🔗 Registering route [${method}] ${path}`);
}
logRoute('GET', '/newsposts');
router.get("/newsposts", async (_req: Request, res: Response) => {
    try {
        const posts = await getAllPosts();
        res.json(posts);
    } catch (err) {
        console.error('❌ GET /newsposts failed:', err);
        res.status(500).send("Server error");
    }
});
logRoute('GET', '/newsposts/:id');
router.get("/newsposts/:id", async (req: Request, res: Response) => {
    try {
        const post = await getPostById(Number(req.params.id));
        if (!post) return res.status(404).send("Not found");
        res.json(post);
    } catch (err) {
        console.error('❌ GET /newsposts/:id failed:', err);
        res.status(500).send("Server error");
    }
});
logRoute('POST', '/newsposts');
router.post("/newsposts", async (req: Request, res: Response) => {
    try {
        const post = await createPost(req.body);
        res.json(post);
    } catch (err) {
        console.error('❌ POST /newsposts failed:', err);
        res.status(500).send("Server error");
    }
});
logRoute('PUT', '/newsposts/:id');
router.put("/newsposts/:id", async (req: Request, res: Response) => {
    try {
        const updated = await updatePost(Number(req.params.id), req.body);
        res.json(updated);
    } catch (err) {
        console.error('❌ PUT /newsposts/:id failed:', err);
        res.status(500).send("Server error");
    }
});
logRoute('DELETE', '/newsposts/:id');
router.delete("/newsposts/:id", async (req: Request, res: Response) => {
    try {
        const id = await deletePost(Number(req.params.id));
        res.json({ id });
    } catch (err) {
        console.error('❌ DELETE /newsposts failed:', err);
        res.status(500).send("Server error");
    }
});

export default router
