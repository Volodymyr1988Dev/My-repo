import { Repository } from "typeorm";

import { NewsPost } from "../entities/NewsPost";
import { User } from "../entities/User";
import { AppDataSource } from "../utils/DataSource";

//export const repo = AppDataSource.getRepository(NewsPost);

export class NewsService {
  private repo: Repository<NewsPost>;
  private userRepo: Repository<User>;

  constructor(
    repo?: Repository<NewsPost>,
    userRepo?: Repository<User>
  ) {
    this.repo = repo ?? AppDataSource.getRepository(NewsPost);
    this.userRepo = userRepo ?? AppDataSource.getRepository(User);
  }

   async createPost(data: Partial<NewsPost>, userId: number) {
    const userRepo = AppDataSource.getRepository("User");
    const author = await userRepo.findOneBy({ id: userId });
    if (!author) throw new Error("Author not found");
    const post = this.repo.create({ ...data, author });
    const saved = await this.repo.save(post);
    return saved;
  }

  async getPosts(page: number, size: number) {
    const [posts, total] = await this.repo.findAndCount({
      skip: page * size,
      take: size,
      relations: ["author"],
    });
    return { posts, total };
  }

  async getPostById(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ["author"],
    });
  }

  async updatePost(id: number, data: Partial<NewsPost>, userId: number) {
    const post = await this.repo.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!post) return null;
    if (post.author.id !== userId) throw new Error("Forbidden");

    this.repo.merge(post, data);
    return await this.repo.save(post);
  }

  async deletePost(id: number, userId: number) {
    const post = await this.repo.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!post) return null;
    if (post.author.id !== userId) throw new Error("Forbidden");

    await this.repo.remove(post);
    return post.id;
  }
}