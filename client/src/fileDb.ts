import fs from 'fs';
import path from 'path';
import { NewsPostProps } from './interface/NewsPostProps';
import { NewsPost } from './interface/NewsPost';


export class NewsPostTable {
    private filePath: string;

    constructor(tableName: string) {
        this.filePath = path.join(__dirname, `${tableName}.json`);

        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, '[]', 'utf8');
        }
    }

    private async read(): Promise<NewsPost[]> {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (err: any) {
            throw new Error(`Read error: ${err.message}`);
        }
    }

    private async write(data: NewsPost[]): Promise<void> {
        try {
            await fs.promises.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (err: any) {
            throw new Error(`Write error: ${err.message}`);
        }
    }

    async getAll(): Promise<NewsPost[]> {
        return await this.read();
    }

    async getById(id: number): Promise<NewsPost | undefined> {
        const posts = await this.read();
        return posts.find(post => post.id === id);
    }

    async create(data: NewsPostProps): Promise<NewsPost> {
        const posts = await this.read();
        const lastId = posts.length > 0 ? posts[posts.length - 1].id : 0;

        const newPost: NewsPost = {
            id: lastId + 1,
            ...data,
            createDate: new Date().toISOString(),
        };

        posts.push(newPost);
        await this.write(posts);
        return newPost;
    }

    async update(id: number, updatedData: Partial<NewsPostProps>): Promise<NewsPost> {
        const posts = await this.read();
        const index = posts.findIndex(post => post.id === id);
        if (index === -1) throw new Error(`Record with id ${id} not found`);

        posts[index] = {
            ...posts[index],
            ...updatedData,
        };

        await this.write(posts);
        return posts[index];
    }

    async delete(id: number): Promise<number> {
        const posts = await this.read();
        const index = posts.findIndex(post => post.id === id);
        if (index === -1) throw new Error(`Record with id ${id} not found`);

        posts.splice(index, 1);
        await this.write(posts);
        return id;
    }
}

// Фабрика для створення екземпляра
export async function getTable(tableName: string): Promise<NewsPostTable> {
    return new NewsPostTable(tableName);
}