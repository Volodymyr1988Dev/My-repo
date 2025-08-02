import {getTable} from "../../server/src/fileDb";
import {NewsPostProps} from "../../server/src/interface/NewsPostProps";
import {NewsPost} from "./interface/NewsPost";



const newsPostTablePromise = getTable('newsPosts');

    const newPostData: NewsPostProps = {
        title: 'Лисичка народила!',
        text: 'У Чернігові в зоопарку лисичка народила лисенятко!',
    };
export async function createPost (data: NewsPostProps): Promise<NewsPost> {
    const newsPostTable = await newsPostTablePromise;
    return await newsPostTable.create(data);
}

export async function getAllPosts (): Promise<NewsPost[]> {
    const newsPostTable = await newsPostTablePromise;
    return await newsPostTable.getAll();
}

export async function getPostById (id: number): Promise<NewsPost | undefined> {
    const newsPostTable = await newsPostTablePromise;
    return await newsPostTable.getById(id)
}

   // const byId = await newsPostTable.getById(created.id);

export async function updatePost (id: number, data: Partial<NewsPostProps>): Promise<NewsPost> {
    const newsPostTable = await newsPostTablePromise;
    return newsPostTable.update(id, data)
}

   // const updated = await newsPostTable.update(created.id, { title: 'Оновлений заголовок' });

export async function deletePost (id: number): Promise<number> {
    const newsPostTable = await newsPostTablePromise;
    return await newsPostTable.delete(id)
}