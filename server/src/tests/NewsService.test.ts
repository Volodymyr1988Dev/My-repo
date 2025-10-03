import { Repository } from "typeorm";

jest.mock("../utils/DataSource", () => {
  return {
    AppDataSource: {
      getRepository: jest.fn(),
    },
  };
});

import { NewsPost } from "../entities/NewsPost";
import { User } from "../entities/User";
import { NewsService } from "../services/NewsService";
import { AppDataSource } from "../utils/DataSource";

let repoMock: jest.Mocked<Repository<NewsPost>>;
let userRepoMock: jest.Mocked<Repository<User>>;

describe("NewsService", () => {
  let newsService: NewsService;

  beforeEach(() => {
    repoMock = {
      create: jest.fn(),
      save: jest.fn(),
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<Repository<NewsPost>>;

    userRepoMock = {
      findOneBy: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    (AppDataSource.getRepository as jest.Mock).mockImplementation(
      (entity: unknown) => {
        if (entity === User || entity === "User") return userRepoMock;
        if (entity === NewsPost || entity === "NewsPost") return repoMock;
        return repoMock;
      }
    );

    newsService = new NewsService();
    jest.clearAllMocks();
  });

  it("createPost → успішне створення поста", async () => {
    userRepoMock.findOneBy.mockResolvedValue({ id: 1 } as User);
    repoMock.create.mockReturnValue({ header: "test" } as NewsPost);
    repoMock.save.mockResolvedValue({ id: 1, header: "test" } as NewsPost);

    const result = await newsService.createPost({ header: "test" }, 1);

    expect(userRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repoMock.create).toHaveBeenCalled();
    expect(repoMock.save).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, header: "test" });
  });

  it("createPost → якщо автора нема, кидає помилку", async () => {
    userRepoMock.findOneBy.mockResolvedValue(null);

    await expect(
      newsService.createPost({ header: "X" }, 99)
    ).rejects.toThrow("Author not found");
  });

  it("getPosts → повертає список постів і total", async () => {
    repoMock.findAndCount.mockResolvedValue([[{ id: 1 } as NewsPost], 1]);

    const result = await newsService.getPosts(0, 10);

    expect(repoMock.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      relations: ["author"],
    });
    expect(result).toEqual({ posts: [{ id: 1 }], total: 1 });
  });

  it("getPosts → повертає порожній список", async () => {
    repoMock.findAndCount.mockResolvedValue([[], 0]);

    const result = await newsService.getPosts(0, 10);

    expect(result).toEqual({ posts: [], total: 0 });
  });

  it("getPostById → повертає пост", async () => {
    repoMock.findOne.mockResolvedValue({ id: 1, header: "post" } as NewsPost);

    const result = await newsService.getPostById(1);

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ["author"],
    });
    expect(result).toEqual({ id: 1, header: "post" });
  });

  it("getPostById → якщо пост не знайдено, повертає null", async () => {
    repoMock.findOne.mockResolvedValue(null);

    const result = await newsService.getPostById(999);

    expect(result).toBeNull();
  });

  it("updatePost → успішне оновлення", async () => {
    const post = { id: 1, header: "old", author: { id: 1 } } as NewsPost;
    repoMock.findOne.mockResolvedValue(post);
    repoMock.merge.mockImplementation((target, data) =>
      Object.assign(target, data)
    );
    repoMock.save.mockResolvedValue({ ...post, header: "new" });

    const result = await newsService.updatePost(1, { header: "new" }, 1);

    expect(result).not.toBeNull();
    expect(result!.header).toBe("new");
    expect(repoMock.save).toHaveBeenCalled();
  });

  it("updatePost → якщо не автор, помилка Forbidden", async () => {
    repoMock.findOne.mockResolvedValue({ id: 1, author: { id: 9 } } as NewsPost);

    await expect(
      newsService.updatePost(1, { header: "new" }, 2)
    ).rejects.toThrow("Forbidden");
  });

  it("updatePost → якщо поста не існує, повертає null", async () => {
    repoMock.findOne.mockResolvedValue(null);

    const result = await newsService.updatePost(1, { header: "new" }, 1);

    expect(result).toBeNull();
  });

  it("deletePost → успіх", async () => {
    const post = { id: 1, author: { id: 1 } } as NewsPost;
    repoMock.findOne.mockResolvedValue(post);
    repoMock.remove.mockResolvedValue(post);

    const result = await newsService.deletePost(1, 1);

    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ["author"],
    });
    expect(repoMock.remove).toHaveBeenCalledWith(post);
    expect(result).toBe(1);
  });

  it("deletePost → якщо не автор, помилка Forbidden", async () => {
    repoMock.findOne.mockResolvedValue({ id: 3, author: { id: 99 } } as NewsPost);

    await expect(newsService.deletePost(3, 2)).rejects.toThrow("Forbidden");
  });

  it("deletePost → якщо поста нема, повертає null", async () => {
    repoMock.findOne.mockResolvedValue(null);

    const result = await newsService.deletePost(5, 1);

    expect(result).toBeNull();
  });
});