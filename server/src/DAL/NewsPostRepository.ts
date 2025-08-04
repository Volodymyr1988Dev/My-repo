import { getTable } from "../fileDb";
import { NewsPostProps } from "../interface/NewsPostProps";
import { NewsPost } from "../interface/NewsPost";

const newsPostTablePromise = getTable('newsPosts');

export class NewsPostRepository {
    static async create(data: NewsPostProps): Promise<NewsPost> {
        const table = await newsPostTablePromise;
        return await table.create(data);
    }

    static async getAll(params: { page: number; size: number }): Promise<NewsPost[]> {
        const table = await newsPostTablePromise;
        const all = await table.getAll();

       // if (!params) return all;

        if (params.page < 0 || params.size <= 0) {
            throw new Error("Invalid pagination parameters");
        }
        const start = params.page * params.size;

        return all.slice(start, start + params.size);
    }

    static async getById(id: number): Promise<NewsPost | undefined> {
        const table = await newsPostTablePromise;
        return await table.getById(id);
    }

    static async updatePost(id: number, data: Partial<NewsPostProps>): Promise<NewsPost> {
        const table = await newsPostTablePromise;
        return table.update(id, data);
    }

    static async deletePost(id: number): Promise<number> {
        const table = await newsPostTablePromise;
        return await table.delete(id);
    }
}