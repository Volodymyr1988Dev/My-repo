import {Router, Request, Response, NextFunction} from "express";
//import { getPostById, createPost, updatePost, deletePost} from "../API"
//import { NewsPostService } from "../serices/NewsPostService";
import { validateNewPost } from "../validation/validateNewPost";
import { ValidationError } from "../Errors/validationError";
import { NewsPostServiceError } from "../Errors/newsPostServiceError";
import bcrypt from "bcrypt";
import { UserInterface } from "../interface/UserInterface";
import { registerHandler, loginHandler } from "../middleware/auth";
import passport from "passport";
import { getUserHandler } from "../scripts/getUser";
//import { getAllPosts, getPostById, createNewsTable, createPost, closePool, deletePost, updatePost } from "../services/PoolService"; // додано для використання PoolService
import { AppDataSource } from "../middleware/DataSource";
import {NewsPost} from "../entities/NewsPost";
import { User } from "../entities/User";
import { NewsService } from "../services/NewsService";


const router = Router();
const newsService = new NewsService();
/*
router.get("/newsposts", async (req: Request, res: Response) => {
    try {

        const page = Number(req.query.page) || 0;
        const size = Number(req.query.size) || 10;
      //  const posts = await NewsPostService.getAll({page, size});
    
      // const postRepo = AppDataSource.getRepository(NewsPost);
     
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
    console.log("🔎 Found posts:", posts);
    res.json({ total, page, size, posts });
    } catch (err) {
        console.error('❌ GET /newsposts failed:', err);
        res.status(500).send("Server error");
    }
});

*/

router.get("/newsposts", async (req, res) => {
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
/*
router.get("/newsposts/:id", async (req: Request, res: Response) => {
    try {
        const postRepo = AppDataSource.getRepository(NewsPost);
       // const post = await getPostById(Number(req.params.id));
        const post = await postRepo.findOne({
            where: { id: Number(req.params.id) },
            relations: ["author"],
        });
        if (!post) return res.status(404).send("Not found");
        res.json(post);
    } catch (err) {
        console.error('❌ GET /newsposts/:id failed:', err);
        res.status(500).send("Server error");
    }
});
*/
router.post("/newsposts",
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const isValid = validateNewPost(req.body);
            if (!isValid) {
                const errors = validateNewPost.errors?.map(e => `${e.instancePath} ${e.message}`).join(', ');
                return next(new ValidationError(`Validation failed: ${errors}`));
            }

            //const post = await NewsPostService.create(req.body);
            //const post = await createPost(req.body);
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

       
       // const post = await NewsPostService.create(req.body);
       // const post = await createPost(req.body);
      //  res.json(post);
      //  res.status(201).send('created')
});
  

router.get("/newsposts/:id", async (req, res) => {
  try {
    const post = await newsService.getPostById(Number(req.params.id));
    if (!post) return res.status(404).send("Not found");
    res.json(post);
  } catch (err) {
    console.error("❌ GET /newsposts/:id failed:", err);
    res.status(500).send("Server error");
  }
});

// CREATE
/*
router.post(
  "/newsposts",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
       console.log("🔥 Дійшли до роуту /newsposts без passport");
      console.log("req.user: before is Valid", req.user);
      console.log('before is Valid')
      const isValid = validateNewPost(req.body);
      console.log("Validation result:", isValid);
      console.log('req.body beore !isValid:', req.body);
      if (!isValid) {
        const errors = validateNewPost.errors
          ?.map((e) => `${e.instancePath} ${e.message}`)
          .join(", ");
        return next(new ValidationError(`Validation failed: ${errors}`));
      }
      console.log("req.user:", req.user);

      const user = req.user as User;
      
    
      if (!user) return res.status(401).json({ error: "Unauthorized" });

     // const newPost = await newsService.createPost({
      //  ...req.body,
      //  author: user});
const newPost = await newsService.createPost(req.body, user.id);

      res.status(201).json(newPost);
    } catch (err) {
      console.error("❌ POST /newsposts failed:", err);
      res
        .status(500)
        .json({ error: "Server error", details: err instanceof Error ? err.message : err });
    }
  }
);
*/
/*
router.post(
  "/newsposts",
  // Passport JWT middleware
  passport.authenticate("jwt", { session: false, failWithError: true }),

  // Debug middleware
  (req: Request, res: Response, next: NextFunction) => {
    console.log("✅ Passport пропустив запит");
    console.log("req.user після Passport:", req.user);
    console.log("req.body:", req.body);
    next();
  },

  // Основна логіка створення посту
  async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      // Валідатор (можна залишити для дебагу)
      const isValid = validateNewPost(req.body);
      if (!isValid) {
        const errors = validateNewPost.errors
          ?.map((e) => `${e.instancePath} ${e.message}`)
          .join(", ");
        console.warn("⚠️ Валідація не пройшла:", errors);
        return res.status(400).json({ error: "Validation failed", details: errors });
      }

      // Створення посту через newsService
      const newPost = await newsService.createPost(req.body, user.id);
      console.log("✅ Збережено пост:", newPost);

      res.status(201).json({ ok: true, post: newPost });
    } catch (err) {
      console.error("❌ POST /newsposts failed:", err);
      res.status(500).json({ error: "Server error", details: err instanceof Error ? err.message : err });
    }
  },

  // Обробка помилок Passport
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("❌ Passport помилка:", err);
    res.status(401).json({ error: "Unauthorized", details: err.message || err });
  }
);
*/
// UPDATE
router.put(
  "/newsposts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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

// DELETE
router.delete(
  "/newsposts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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

/*
router.put("/newsposts/:id",
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
        try{
            const postRepo = AppDataSource.getRepository(NewsPost);
      const post = await postRepo.findOne({
        where: { id: Number(req.params.id) },
        relations: ["author"],
      });

      if (!post) return res.status(404).json({ error: "Not found" });

      // опціонально: перевірка, чи цей юзер — автор
      if (post.author.id !== (req.user as User).id) {
        return res.status(403).json({ error: "Forbidden" });
      }

      postRepo.merge(post, req.body);
      await postRepo.save(post);

      res.json(post);
        }
        catch (err) {
            console.error('❌ PUT /newsposts/:id failed:', err);
            if (err instanceof ValidationError) {
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

router.delete("/newsposts/:id", passport.authenticate('jwt', { session: false }), 
async (req: Request, res: Response) => {
    try {
       // const id = await NewsPostService.delete(Number(req.params.id));
      //  const id = await deletePost(Number(req.params.id));
      //  res.json({ id });
       const postRepo = AppDataSource.getRepository(NewsPost);
      const post = await postRepo.findOne({
        where: { id: Number(req.params.id) },
        relations: ["author"],
      });

      if (!post) return res.status(404).json({ error: "Not found" });

      if (post.author.id !== (req.user as User).id) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await postRepo.remove(post);
      res.json({ deletedId: post.id });
    } catch (err) {
        console.error('❌ DELETE /newsposts failed:', err);
        res.status(500).send("Server error");
    }
});
*/
router.get('/error', (_req: Request, _res: Response, next: NextFunction) => {
  return next(new NewsPostServiceError('Simulated service error'));
});

export default router
