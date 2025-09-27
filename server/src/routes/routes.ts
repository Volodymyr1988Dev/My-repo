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
/**
 * @swagger
 * /newsposts:
 *   get:
 *     tags:
 *       - NewsPosts
 *     summary: Отримати список новин
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         type: integer
 *       - name: size
 *         in: query
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: Список новин
 *         schema:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             page:
 *               type: integer
 *             size:
 *               type: integer
 *             posts:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/NewsPost'
 */
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

/**
 * @swagger
 * /newsposts:
 *   post:
 *     tags:
 *       - NewsPosts
 *     summary: Створити новину
 *     description: Доступно тільки авторизованим користувачам
 *     security:
 *       - jwt: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Об'єкт новини
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - header
 *             - text
 *           properties:
 *             header:
 *               type: string
 *               example: "Breaking News!"
 *             text:
 *               type: string
 *               example: "This is the content of the news post."
 *             genre:
 *               type: string
 *               example: "SPORTS"
 *             isPrivate:
 *               type: boolean
 *               example: false
 *     responses:
 *       201:
 *         description: Створена новина
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             header:
 *               type: string
 *               example: "Breaking News!"
 *             text:
 *               type: string
 *               example: "This is the content of the news post."
 *             genre:
 *               type: string
 *               example: "SPORTS"
 *             isPrivate:
 *               type: boolean
 *               example: false
 *             createDate:
 *               type: string
 *               example: "2025-09-19T12:34:56Z"
 *             author:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 7
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *       401:
 *         description: Неавторизований доступ
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Unauthorized"
 *       500:
 *         description: Внутрішня помилка сервера
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Server error"
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
  
/**
 * @swagger
 * /newsposts/{id}:
 *   get:
 *     tags:
 *       - NewsPosts
 *     summary: Отримати новину за id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Новина
 *         schema:
 *           $ref: '#/definitions/NewsPost'
 *       404:
 *         description: Не знайдено
 */
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

/**
 * @swagger
 * /newsposts/{id}:
 *   put:
 *     tags:
 *       - NewsPosts
 *     summary: Оновити новину
 *     security:
 *       - jwt: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/NewsPost'
 *     responses:
 *       200:
 *         description: Оновлена новина
 *         schema:
 *           $ref: '#/definitions/NewsPost'
 *       404:
 *         description: Не знайдено
 */
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

/**
 * @swagger
 * /newsposts/{id}:
 *   delete:
 *     tags:
 *       - NewsPosts
 *     summary: Видалити новину
 *     security:
 *       - jwt: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Видалено
 *         schema:
 *           type: object
 *           properties:
 *             deletedId:
 *               type: integer
 *       404:
 *         description: Не знайдено
 */
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

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Реєстрація користувача
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 example: "mypassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "mypassword123"
 *     responses:
 *       201:
 *         description: Успішна реєстрація
 *         content:
 *           application/json:
 *             example:
 *               message: "User created"
 *               token: "Bearer eyJhbGciOiJIUzI1NiIsInR..."
 *               user:
 *                 id: 1
 *                 email: "test@example.com"
 *       400:
 *         description: Некоректні дані (наприклад, email вже існує або паролі не співпадають)
 *         content:
 *           application/json:
 *             example:
 *               error: "Email already registered"
 *       500:
 *         description: Внутрішня помилка сервера
 *         content:
 *           application/json:
 *             example:
 *               error: "Server error"
 */
router.post("/register", registerHandler);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Логін користувача
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Успішний логін
 */
router.post("/login", loginHandler);

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User
 *     summary: Отримати дані користувача
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Дані користувача
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.get("/user", passport.authenticate('jwt', { session: false }), getUserHandler);

router.get('/error', (_req: Request, _res: Response, next: NextFunction) => {
  return next(new NewsPostServiceError('Simulated service error'));
});

export default router
