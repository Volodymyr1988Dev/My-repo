import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

//import { UserTable } from '../UserTable';
import { User } from '../entities/User';
//import { ValidationError } from '../Errors/validationError';
import { AppDataSource } from '../utils/DataSource';

//const userTable = new UserTable();
const SECRET = process.env.JWT_SECRET || 'supersecret';

export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const userRepo = AppDataSource.getRepository(User);
    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepo.create({ email, passwordHash: hashedPassword });
    await userRepo.save(newUser);

    const token = jwt.sign({ id: newUser.id }, SECRET, { expiresIn: "1d" });

   return res.status(201).json({message: 'User created', token: `Bearer ${token}`, user: newUser });
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1d" });
    console.log('Generated token:', token);
    return res.json({message: 'Login successful',  token: `Bearer ${token}`, user:{id:user.id, email:user.email} });
  } catch (err) {
    next(err);
  }
}
