import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//import { UserTable } from '../UserTable';
import { ValidationError } from '../Errors/validationError';
import { AppDataSource } from './DataSource';
import { User } from '../entities/User';

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
/*
export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword)
    return next(new ValidationError("All fields are required"));

  if (password !== confirmPassword)
    return next(new ValidationError("Passwords do not match"));

  const existingUser = await userTable.findByEmail(email);
  if (existingUser)
    return next(new ValidationError("Email already registered"));

  const hashedPassword = await bcrypt.hash(password, 10);
  //const user = await userTable.create({ email, password: hashedPassword });
 // console.log('User created:', user);
  const token = jwt.sign({ email }, SECRET, { expiresIn: '1d' });
  console.log('Generated token:', token);
  const user = await userTable.create({
    id: token,
    email,
    password: hashedPassword,
  });
 res.status(201).json({
      token: `Bearer ${token}`,
      user: user
    });
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ValidationError("Email and password are required"));

  const user = await userTable.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new ValidationError("Invalid credentials"));

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1d' });
  res.json({ token: `Bearer ${token}` });
}
*/