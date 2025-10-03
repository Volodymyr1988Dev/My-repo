import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../entities/User";
import { registerHandler, loginHandler } from "../middleware/auth";
import { getUserHandler } from "../middleware/getUser";
import { AppDataSource } from "../utils/DataSource";

jest.mock("../utils/DataSource", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

interface AuthRequest extends Request {
  user?: {id: number; email: string};
}

describe("Auth Handlers", () => {
  let mockRepo: Record<string, jest.Mock>;
  let res: Response;
  let json: jest.Mock;
  let status: jest.Mock;
  let next: jest.Mock;

  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    res = { json, status } as unknown as Response;
    next = jest.fn();

    mockRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

    jest.clearAllMocks();
  });

  it("registerHandler → створює користувача", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.create.mockReturnValue({ id: 1, email: "test@test.com" } as User);
    mockRepo.save.mockResolvedValue({ id: 1, email: "test@test.com" } as User);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPass");
    (jwt.sign as jest.Mock).mockReturnValue("fakeToken");

    const req = {
      body: { email: "test@test.com", password: "123", confirmPassword: "123" },
    } as Request;

    await registerHandler(req, res, next);

    expect(mockRepo.create).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User created",
        token: expect.stringContaining("Bearer fakeToken"),
      })
    );
  });

  it("registerHandler → повертає 400, якщо email існує", async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, email: "exists@test.com" } as User);

    const req = {
      body: { email: "exists@test.com", password: "123", confirmPassword: "123" },
    } as Request;

    await registerHandler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: "Email already registered" });
  });

  it("loginHandler → успішний логін", async () => {
    const fakeUser = { id: 1, email: "t@t.com", passwordHash: "hashed" } as User;
    mockRepo.findOne.mockResolvedValue(fakeUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("fakeToken");

    const req = { body: { email: "t@t.com", password: "123" } } as Request;

    await loginHandler(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Login successful",
        token: "Bearer fakeToken",
        user: { id: 1, email: "t@t.com" },
      })
    );
  });

  it("loginHandler → повертає 400, якщо пароль невірний", async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, email: "x", passwordHash: "hashed" } as User);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req = { body: { email: "x", password: "wrong" } } as Request;

    await loginHandler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  it("getUserHandler → повертає користувача з req", () => {
    const req = { user: { id: 1, email: "me@test.com" } } as AuthRequest;

    getUserHandler(req, res);

    expect(json).toHaveBeenCalledWith({ user: { id: 1, email: "me@test.com" } });
  });
});