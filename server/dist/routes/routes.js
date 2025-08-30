"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//import { getPostById, createPost, updatePost, deletePost} from "../API"
//import { NewsPostService } from "../serices/NewsPostService";
const validateNewPost_1 = require("../validation/validateNewPost");
const validationError_1 = require("../Errors/validationError");
const newsPostServiceError_1 = require("../Errors/newsPostServiceError");
const auth_1 = require("../middleware/auth");
const passport_1 = __importDefault(require("passport"));
const getUser_1 = require("../scripts/getUser");
const DataSource_1 = require("../middleware/DataSource");
const NewsPost_1 = require("../entities/NewsPost");
const User_1 = require("../entities/User");
const router = (0, express_1.Router)();
router.get("/newsposts", async (req, res) => {
    try {
        const page = Number(req.query.page) || 0;
        const size = Number(req.query.size) || 10;
        //  const posts = await NewsPostService.getAll({page, size});
        const postRepo = DataSource_1.AppDataSource.getRepository(NewsPost_1.NewsPost);
        // const posts = await getAllPosts({page, size});
        //  console.log(`page # ${page}, size ${size}`);
        //   res.json(posts);
        const [posts, total] = await postRepo.findAndCount({
            skip: page * size,
            take: size,
            relations: ["author"],
            // const posts = await getAllPosts({ page, size });
            //  res.json(posts);
        });
        res.json({ total, page, size, posts });
    }
    catch (err) {
        console.error('❌ GET /newsposts failed:', err);
        res.status(500).send("Server error");
    }
});
router.get("/newsposts/:id", async (req, res) => {
    try {
        const postRepo = DataSource_1.AppDataSource.getRepository(NewsPost_1.NewsPost);
        // const post = await getPostById(Number(req.params.id));
        const post = await postRepo.findOne({
            where: { id: Number(req.params.id) },
            relations: ["author"],
        });
        if (!post)
            return res.status(404).send("Not found");
        res.json(post);
    }
    catch (err) {
        console.error('❌ GET /newsposts/:id failed:', err);
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
        //const post = await NewsPostService.create(req.body);
        //const post = await createPost(req.body);
        const userRepo = DataSource_1.AppDataSource.getRepository(User_1.User);
        const postRepo = DataSource_1.AppDataSource.getRepository(NewsPost_1.NewsPost);
        const author = await userRepo.findOneBy({ id: req.user.id });
        if (!author)
            return res.status(401).json({ error: "Unauthorized" });
        const newPost = postRepo.create({ ...req.body, author });
        await postRepo.save(newPost);
        res.status(201).json(newPost);
    }
    catch (err) {
        console.error('❌ POST /newsposts failed:', err);
    }
    // const post = await NewsPostService.create(req.body);
    // const post = await createPost(req.body);
    //  res.json(post);
    //  res.status(201).send('created')
});
router.post("/register", auth_1.registerHandler);
router.post("/login", auth_1.loginHandler);
router.get("/user", passport_1.default.authenticate('jwt', { session: false }), getUser_1.getUserHandler);
router.put("/newsposts/:id", passport_1.default.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const postRepo = DataSource_1.AppDataSource.getRepository(NewsPost_1.NewsPost);
        const post = await postRepo.findOne({
            where: { id: Number(req.params.id) },
            relations: ["author"],
        });
        if (!post)
            return res.status(404).json({ error: "Not found" });
        // опціонально: перевірка, чи цей юзер — автор
        if (post.author.id !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }
        postRepo.merge(post, req.body);
        await postRepo.save(post);
        res.json(post);
    }
    catch (err) {
        console.error('❌ PUT /newsposts/:id failed:', err);
        if (err instanceof validationError_1.ValidationError) {
            return next(err);
        }
        res.status(500).send("Server error");
    }
    // const isValid = validateNewPost(req.body)
    //   if (!isValid) {
    //  const errors = validateNewPost.errors?.map(e => `${e.instancePath} ${e.message}`).join(', ');
    //    return next(new ValidationError(`Validation failed: ${errors}`));
    //  }
    //const updated = await NewsPostService.update(Number(req.params.id), req.body);
    //    const updated = await updatePost(Number(req.params.id), req.body);
    //     res.json(updated);
    //      res.status(200).send('Updated')
});
router.delete("/newsposts/:id", async (req, res) => {
    try {
        // const id = await NewsPostService.delete(Number(req.params.id));
        //  const id = await deletePost(Number(req.params.id));
        //  res.json({ id });
        const postRepo = DataSource_1.AppDataSource.getRepository(NewsPost_1.NewsPost);
        const post = await postRepo.findOne({
            where: { id: Number(req.params.id) },
            relations: ["author"],
        });
        if (!post)
            return res.status(404).json({ error: "Not found" });
        if (post.author.id !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }
        await postRepo.remove(post);
        res.json({ deletedId: post.id });
    }
    catch (err) {
        console.error('❌ DELETE /newsposts failed:', err);
        res.status(500).send("Server error");
    }
});
router.get('/error', (_req, _res, next) => {
    return next(new newsPostServiceError_1.NewsPostServiceError('Simulated service error'));
});
exports.default = router;
