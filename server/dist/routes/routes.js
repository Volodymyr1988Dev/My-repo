"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateNewPost_1 = require("../validation/validateNewPost");
const validationError_1 = require("../Errors/validationError");
const newsPostServiceError_1 = require("../Errors/newsPostServiceError");
const auth_1 = require("../middleware/auth");
const passport_1 = __importDefault(require("passport"));
const getUser_1 = require("../middleware/getUser");
const DataSource_1 = require("../utils/DataSource");
const NewsPost_1 = require("../entities/NewsPost");
const User_1 = require("../entities/User");
const NewsService_1 = require("../services/NewsService");
const router = (0, express_1.Router)();
const newsService = new NewsService_1.NewsService();
router.get("/newsposts", async (req, res) => {
    try {
        const page = Number(req.query.page) || 0;
        const size = Number(req.query.size) || 10;
        const { posts, total } = await newsService.getPosts(page, size);
        res.json({ total, page, size, posts });
    }
    catch (err) {
        console.error("❌ GET /newsposts failed:", err);
        res.status(500).send("Server error");
    }
});
router.post("/newsposts", passport_1.default.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const isValid = (0, validateNewPost_1.validateNewPost)(req.body);
        if (!isValid) {
            const errors = validateNewPost_1.validateNewPost.errors?.map(e => `${e.instancePath} ${e.message}`).join(', ');
            return next(new validationError_1.ValidationError(`Validation failed: ${errors}`));
        }
        const userRepo = DataSource_1.AppDataSource.getRepository(User_1.User);
        const postRepo = DataSource_1.AppDataSource.getRepository(NewsPost_1.NewsPost);
        const author = await userRepo.findOneBy({ id: req.user.id });
        console.log("req.user:", req.user);
        console.log("found author:", author);
        if (!author)
            return res.status(401).json({ error: "Unauthorized" });
        const newPost = postRepo.create({ ...req.body, author });
        await postRepo.save(newPost);
        console.log("✅ Saved post:", newPost);
        res.status(201).json(newPost);
    }
    catch (err) {
        console.error('❌ POST /newsposts failed:', err);
        res.status(500).json({ error: "Server error", details: err instanceof Error ? err.message : err });
    }
});
router.get("/newsposts/:id", async (req, res) => {
    try {
        const post = await newsService.getPostById(Number(req.params.id));
        if (!post)
            return res.status(404).send("Not found");
        res.json(post);
    }
    catch (err) {
        console.error("❌ GET /newsposts/:id failed:", err);
        res.status(500).send("Server error");
    }
});
router.put("/newsposts/:id", passport_1.default.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const user = req.user;
        const updated = await newsService.updatePost(Number(req.params.id), req.body, user.id);
        if (!updated)
            return res.status(404).send("Not found");
        res.json(updated);
    }
    catch (err) {
        console.error("❌ PUT /newsposts/:id failed:", err);
        if (err.message === "Forbidden") {
            return res.status(403).json({ error: "Forbidden" });
        }
        res.status(500).send("Server error");
    }
});
router.delete("/newsposts/:id", passport_1.default.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const user = req.user;
        const deletedId = await newsService.deletePost(Number(req.params.id), user.id);
        if (!deletedId)
            return res.status(404).send("Not found");
        res.json({ deletedId });
    }
    catch (err) {
        console.error("❌ DELETE /newsposts failed:", err);
        if (err.message === "Forbidden") {
            return res.status(403).json({ error: "Forbidden" });
        }
        res.status(500).send("Server error");
    }
});
router.post("/register", auth_1.registerHandler);
router.post("/login", auth_1.loginHandler);
router.get("/user", passport_1.default.authenticate('jwt', { session: false }), getUser_1.getUserHandler);
router.get('/error', (_req, _res, next) => {
    return next(new newsPostServiceError_1.NewsPostServiceError('Simulated service error'));
});
exports.default = router;
