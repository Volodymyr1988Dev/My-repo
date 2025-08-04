import {Router, Request, Response} from "express";
import {getAllPosts, getPostById, createPost, updatePost, deletePost} from "../API"
import { NewsPostService } from "../serices/NewsPostService";

const router = Router();

router.get("/newsposts", async (req: Request, res: Response) => {
    try {

        const page = Number(req.query.page) || 0;
        const size = Number(req.query.size) || 10;
        const posts = await NewsPostService.getAll({page, size});
        console.log(`page # ${page}, size ${size}`);
        res.json(posts);
    } catch (err) {
        console.error('❌ GET /newsposts failed:', err);
        res.status(500).send("Server error");
    }
});

router.get("/newsposts/:id", async (req: Request, res: Response) => {
    try {
        const post = await NewsPostService.getById(Number(req.params.id));
        if (!post) return res.status(404).send("Not found");
        res.json(post);
    } catch (err) {
        console.error('❌ GET /newsposts/:id failed:', err);
        res.status(500).send("Server error");
    }
});

router.post("/newsposts", async (req: Request, res: Response) => {
    try {
        const post = await NewsPostService.create(req.body);
        res.json(post);
    } catch (err) {
        console.error('❌ POST /newsposts failed:', err);
        res.status(500).send("Server error");
    }
});

router.put("/newsposts/:id", async (req: Request, res: Response) => {
    try {
        const updated = await NewsPostService.update(Number(req.params.id), req.body);
        res.json(updated);
    } catch (err) {
        console.error('❌ PUT /newsposts/:id failed:', err);
        res.status(500).send("Server error");
    }
});

router.delete("/newsposts/:id", async (req: Request, res: Response) => {
    try {
        const id = await NewsPostService.delete(Number(req.params.id));
        res.json({ id });
    } catch (err) {
        console.error('❌ DELETE /newsposts failed:', err);
        res.status(500).send("Server error");
    }
});

export default router
