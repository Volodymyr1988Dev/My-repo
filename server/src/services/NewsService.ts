import { AppDataSource } from "../middleware/DataSource";
import { NewsPost } from "../entities/NewsPost";

const repo = AppDataSource.getRepository(NewsPost);

export class NewsService {
 // async createPost(data: Partial<NewsPost>) {
   async createPost(data: Partial<NewsPost>, userId: number) {
    const userRepo = AppDataSource.getRepository("User");
    const author = await userRepo.findOneBy({ id: userId });
    if (!author) throw new Error("Author not found");
    const post = repo.create({ ...data, author });
    
    //const post = repo.create(data);
    const saved = await repo.save(post);
    console.log("✅ Збережено пост:", saved);
    return saved;
  }

  async getPosts(page: number, size: number) {
    const [posts, total] = await repo.findAndCount({
      skip: page * size,
      take: size,
      relations: ["author"],
    });
    console.log("📌 Отримано пости:", posts);
    return { posts, total };
  }

  async getPostById(id: number) {
    return await repo.findOne({
      where: { id },
      relations: ["author"],
    });
  }

  async updatePost(id: number, data: Partial<NewsPost>, userId: number) {
    const post = await repo.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!post) return null;
    if (post.author.id !== userId) throw new Error("Forbidden");

    repo.merge(post, data);
    return await repo.save(post);
  }

  async deletePost(id: number, userId: number) {
    const post = await repo.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!post) return null;
    if (post.author.id !== userId) throw new Error("Forbidden");

    await repo.remove(post);
    return post.id;
  }
}