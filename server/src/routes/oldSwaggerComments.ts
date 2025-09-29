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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - header
 *               - text
 *             properties:
 *               header:
 *                 type: string
 *                 example: "Breaking News!"
 *               text:
 *                 type: string
 *                 example: "This is the content of the news post."
 *               genre:
 *                 type: string
 *                 example: "SPORTS"
 *               isPrivate:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Створена новина
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsPost'
 *       401:
 *         description: Неавторизований доступ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Внутрішня помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */

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

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User
 *     summary: Отримати дані користувача
 *     security:
 *       - jwt: []
*     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Дані користувача
 *         content:
 *           application/json:
 *             example:
 *               token: "Bearer eyJhbGciOiJIUzI1NiIsInR..."
 *               user:
 *                 id: 1
 *                 email: "test@example.com"
 *         schema:
 *           $ref: '#/definitions/User'
 */