import { Router} from "express";
import { Request, Response, NextFunction } from "express";
import passport from "passport";

import {NewsPost} from "../entities/NewsPost";
import { User } from "../entities/User";
import { NewsPostServiceError } from "../Errors/newsPostServiceError";
import { ValidationError } from "../Errors/validationError";
import { registerHandler, loginHandler } from "../middleware/auth";
import { getUserHandler } from "../middleware/getUser";
import { NewsService } from "../services/NewsService";
import { AppDataSource } from "../utils/DataSource";
import { validateNewPost } from "../validation/validateNewPost";


const router = Router();
const newsService = new NewsService();

router.get("/newsposts", async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 0;
    const size = Number(req.query.size) || 10;
    const { posts, total } = await newsService.getPosts(page, size);
    res.json({ total, page, size, posts });
  } catch (err) {
    console.error("❌ GET /newsposts failed:", err);
    res.status(500).send("Server error");
  }
});


router.post("/newsposts",
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const isValid = validateNewPost(req.body);
            if (!isValid) {
                const errors = validateNewPost.errors?.map(e => `${e.instancePath} ${e.message}`).join(', ');
                return next(new ValidationError(`Validation failed: ${errors}`));
            }
            const userRepo = AppDataSource.getRepository(User);
            const postRepo = AppDataSource.getRepository(NewsPost);

            const author = await userRepo.findOneBy({ id: (req.user as User).id });
            console.log("req.user:", req.user);
            console.log("found author:", author);
            if (!author) return res.status(401).json({ error: "Unauthorized" });

            const newPost = postRepo.create({...req.body,author});
            await postRepo.save(newPost);
            console.log("✅ Saved post:", newPost);
            res.status(201).json(newPost);
        }
        catch (err) {
            console.error('❌ POST /newsposts failed:', err); 
             res.status(500).json({ error: "Server error", details: err instanceof Error ? err.message : err });  
          }
});
  

router.get("/newsposts/:id", async (req: Request, res: Response) => {
  try {
    const post = await newsService.getPostById(Number(req.params.id));
    if (!post) return res.status(404).send("Not found");
    res.json(post);
  } catch (err) {
    console.error("❌ GET /newsposts/:id failed:", err);
    res.status(500).send("Server error");
  }
});


router.put(
  "/newsposts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const updated = await newsService.updatePost(
        Number(req.params.id),
        req.body,
        user.id
      );
      if (!updated) return res.status(404).send("Not found");
      res.json(updated);
    } catch (err) {
      console.error("❌ PUT /newsposts/:id failed:", err);
      if ((err as Error).message === "Forbidden") {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.status(500).send("Server error");
    }
  }
);


router.delete(
  "/newsposts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res:Response) => {
    try {
      const user = req.user as User;
      const deletedId = await newsService.deletePost(Number(req.params.id), user.id);
      if (!deletedId) return res.status(404).send("Not found");
      res.json({ deletedId });
    } catch (err) {
      console.error("❌ DELETE /newsposts failed:", err);
      if ((err as Error).message === "Forbidden") {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.status(500).send("Server error");
    }
  }
);


router.post("/register", registerHandler);


router.post("/login", loginHandler);


router.get("/user", passport.authenticate('jwt', { session: false }), getUserHandler);

router.get('/error', (_req: Request, _res: Response, next: NextFunction) => {
  return next(new NewsPostServiceError('Simulated service error'));
});

export default router
