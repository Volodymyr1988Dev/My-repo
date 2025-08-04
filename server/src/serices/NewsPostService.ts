import { NewsPostRepository } from "../DAL/NewsPostRepository";
import { NewsPostProps } from "../interface/NewsPostProps";
import { NewsPost } from "../interface/NewsPost";

export class NewsPostService {
    static async create(data: NewsPostProps): Promise<NewsPost> {
        return await NewsPostRepository.create(data);
    }

    static async getAll(params: { page: number; size: number }): Promise<NewsPost[]> {
      //  if (!params) {
       //     return await NewsPostRepository.getAll({ page: 0, size: Number.MAX_SAFE_INTEGER });
      //  }
        return await NewsPostRepository.getAll(params);
    }

    static async getById(id: number): Promise<NewsPost | undefined> {
        return await NewsPostRepository.getById(id);
    }

    static async update(id: number, data: Partial<NewsPostProps>): Promise<NewsPost> {
        return await NewsPostRepository.updatePost(id, data);
    }

    static async delete(id: number): Promise<number> {
        return await NewsPostRepository.deletePost(id);
    }
}