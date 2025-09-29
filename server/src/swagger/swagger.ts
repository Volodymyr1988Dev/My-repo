/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: News Service API
 *   version: 1.0.0
 *   description: API для новинного сервісу
 *
 * servers:
 *   - url: http://localhost:10000/api
 *   - url: https://project-server-ec8e.onrender.com/api
 *
 * tags:
 *   - name: Auth
 *     description: Реєстрація та логін
 *   - name: NewsPosts
 *     description: CRUD операції для новин
 *   - name: Users
 *     description: Користувачі
 *
 * components:
 *   securitySchemes:
 *     jwt:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     NewsPost:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         header:
 *           type: string
 *           example: "Breaking News!"
 *         text:
 *           type: string
 *           example: "This is the content of the news post."
 *         genre:
 *           type: string
 *           example: "SPORTS"
 *         isPrivate:
 *           type: boolean
 *           example: false
 *         createDate:
 *           type: string
 *           format: date-time
 *           example: "2025-09-28T12:34:56Z"
 *         userId:
 *           type: integer
 *           example: 1
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: "user@example.com"
 *
 * paths:
 *   /register:
 *     post:
 *       tags: [Auth]
 *       summary: Реєстрація нового користувача
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [email, password, confirmPassword]
 *               properties:
 *                 email:
 *                   type: string
 *                   example: "newuser@gmail.com"
 *                 password:
 *                   type: string
 *                   example: "123456"
 *                 confirmPassword:
 *                   type: string
 *                   example: "123456"
 *       responses:
 *         201:
 *           description: Успішна реєстрація
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         400:
 *           description: Помилка валідації
 *
 *   /login:
 *     post:
 *       tags: [Auth]
 *       summary: Логін користувача
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [email, password]
 *               properties:
 *                 email:
 *                   type: string
 *                   example: "user@gmail.com"
 *                 password:
 *                   type: string
 *                   example: "123456"
 *       responses:
 *         200:
 *           description: Успішний логін
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                     example: "eyJhbGciOiJIUzI1NiIs..."
 *         401:
 *           description: Невірний логін або пароль
 *
 *   /newsposts:
 *     get:
 *       tags: [NewsPosts]
 *       summary: Отримати всі новини
 *       responses:
 *         200:
 *           description: Список новин
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/NewsPost'
 *
 *     post:
 *       tags: [NewsPosts]
 *       summary: Створити новину
 *       security:
 *         - jwt: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [header, text]
 *               properties:
 *                 header:
 *                   type: string
 *                   example: "Breaking News!"
 *                 text:
 *                   type: string
 *                   example: "Some text here..."
 *                 genre:
 *                   type: string
 *                   example: "POLITICS"
 *                 isPrivate:
 *                   type: boolean
 *                   example: false
 *       responses:
 *         201:
 *           description: Створена новина
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/NewsPost'
 *         401:
 *           description: Неавторизований
 *
 *   /newsposts/{id}:
 *     get:
 *       tags: [NewsPosts]
 *       summary: Отримати новину по id
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         200:
 *           description: Новина знайдена
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/NewsPost'
 *         404:
 *           description: Не знайдено
 *
 *     put:
 *       tags: [NewsPosts]
 *       summary: Оновити новину
 *       security:
 *         - jwt: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 header:
 *                   type: string
 *                 text:
 *                   type: string
 *                 genre:
 *                   type: string
 *                 isPrivate:
 *                   type: boolean
 *       responses:
 *         200:
 *           description: Новина оновлена
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/NewsPost'
 *         401:
 *           description: Неавторизований
 *         404:
 *           description: Не знайдено
 *
 *     delete:
 *       tags: [NewsPosts]
 *       summary: Видалити новину
 *       security:
 *         - jwt: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         204:
 *           description: Успішно видалено
 *         401:
 *           description: Неавторизований
 *         404:
 *           description: Не знайдено
 *
 *   /users:
 *     get:
 *       tags: [Users]
 *       summary: Отримати список користувачів
 *       security:
 *         - jwt: []
 *       responses:
 *         200:
 *           description: Список користувачів
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/User'
 */