import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserTable } from '../UserTable';
import { ValidationError } from '../Errors/validationError';

const userTable = new UserTable();
const SECRET = process.env.JWT_SECRET || 'supersecret';

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