import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Repository } from "typeorm";

import { User } from "../entities/User";
import { UserService } from "../services/UserService";



jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("UserService", () => {
  let mockRepo: jest.Mocked<Repository<User>>;
  let service: UserService;

  beforeEach(() => {
    mockRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;
    service = new UserService(mockRepo);
  });

  it("register → створює користувача", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.create.mockReturnValue({ id: 1, email: "test@test.com" } as User);
    mockRepo.save.mockResolvedValue({ id: 1, email: "test@test.com" } as User);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
    (jwt.sign as jest.Mock).mockReturnValue("fakeToken");

    const result = await service.register("test@test.com", "123", "123");

    expect(result.token).toContain("Bearer fakeToken");
    expect(result.user.email).toBe("test@test.com");
  });

  it("login → успішний логін", async () => {
    const fakeUser = { id: 1, email: "a", passwordHash: "hash" } as User;
    mockRepo.findOne.mockResolvedValue(fakeUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("token");

    const result = await service.login("a", "123");
    expect(result.token).toBe("Bearer token");
  });
});