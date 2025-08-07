import {Router, Request, Response, NextFunction} from "express";
import {getAllPosts, getPostById, createPost, updatePost, deletePost} from "../API"
import { NewsPostService } from "../serices/NewsPostService";
import { validateNewPost } from "../validation/validateNewPost";
import { ValidationError } from "../Errors/validationError";
import { NewsPostServiceError } from "../Errors/newsPostServiceError";
import bcrypt from "bcrypt";
import { UserInterface } from "../interface/userInterface";
import { registerHandler, loginHandler } from "../middleware/auth";
import passport from "passport";
import { getUserHandler } from "../middleware/getUser";



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

router.post("/newsposts", async (req: Request, res: Response, next: NextFunction) => {
   // try {
        const isValid = validateNewPost(req.body)
        if (!isValid) {
            const errors = validateNewPost.errors?.map(e => `${e.instancePath} ${e.message}`).join(', ');
        return next(new ValidationError(`Validation failed: ${errors}`));
        }
        const post = await NewsPostService.create(req.body);
        res.json(post);
        res.status(201).send('created')
   // } catch (err) {
   //     console.error('❌ POST /newsposts failed:', err);
   //     res.status(500).send("Server error");
   // }
});
//router.post("/register", (req, res, next) => {
  //console.log("➡️ Register route triggered");
 // next(); // передаємо управління до registerHandler
//}, registerHandler);
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/user", passport.authenticate('jwt', { session: false }), getUserHandler);
router.put("/newsposts/:id", async (req: Request, res: Response, next: NextFunction) => {
   // try {
   const isValid = validateNewPost(req.body)
   if (!isValid) {
    const errors = validateNewPost.errors?.map(e => `${e.instancePath} ${e.message}`).join(', ');
    return next(new ValidationError(`Validation failed: ${errors}`));
  }
        const updated = await NewsPostService.update(Number(req.params.id), req.body);
        res.json(updated);
        res.status(200).send('Updated')
   // } catch (err) {
   //     console.error('❌ PUT /newsposts/:id failed:', err);
  //      res.status(500).send("Server error");
  //  }
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
router.get("/ping", (_req, res) => {
  res.send("pong");
});
router.get('/error', (_req: Request, _res: Response, next: NextFunction) => {
  return next(new NewsPostServiceError('Simulated service error'));
});

export default router
