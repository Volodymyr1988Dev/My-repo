import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Repository } from "typeorm";

import { User } from "../entities/User";
import { AppDataSource } from "../utils/DataSource";

const SECRET = process.env.JWT_SECRET || "supersecret";

export class UserService {
  private repo: Repository<User>;

  constructor(repo?: Repository<User>) {
    this.repo = repo ?? AppDataSource.getRepository(User);
  }

  async register(email: string, password: string, confirmPassword: string) {
    if (!email || !password || !confirmPassword)
      throw new Error("All fields are required");
    if (password !== confirmPassword)
      throw new Error("Passwords do not match");

    const existing = await this.repo.findOne({ where: { email } });
    if (existing) throw new Error("Email already registered");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.repo.create({ email, passwordHash });
    const saved = await this.repo.save(user);

    const token = jwt.sign({ id: saved.id, email: saved.email }, SECRET, {
      expiresIn: "1d",
    });

    return { user: saved, token: `Bearer ${token}` };
  }

  async login(email: string, password: string) {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
      expiresIn: "1d",
    });

    return { user, token: `Bearer ${token}` };
  }

  async getUserById(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new Error("User not found");
    return user;
  }
}