import {getTable} from "../controllers/fileDb";
import {NewsPostProps} from "../interface/NewsPostProps";
import {NewsPost} from "../interface/NewsPost";



const newsPostTablePromise = getTable('newsPosts');
export async function createPost (data: NewsPostProps): Promise<NewsPost> {
    const newsPostTable = await newsPostTablePromise;
    return await newsPostTable.create(data);
}

export async function getAllPosts (params?:{page?:number; size?:number}): Promise<NewsPost[]> {
    const newsPostTable = await newsPostTablePromise;
    const all = await newsPostTable.getAll();

    if (!params) return all;

    const {page=0, size=all.length} = params
    const start = page * size;

    return all.slice(start, start + size);

  //  return await newsPostTable.getAll();
}

export async function getPostById (id: number): Promise<NewsPost | undefined> {
    const newsPostTable = await newsPostTablePromise;
    return await newsPostTable.getById(id)
}



export async function updatePost (id: number, data: Partial<NewsPostProps>): Promise<NewsPost> {
    const newsPostTable = await newsPostTablePromise;
    return newsPostTable.update(id, data)
}

   // const updated = await newsPostTable.update(created.id, { title: 'Оновлений заголовок' });

export async function deletePost (id: number): Promise<number> {
    const newsPostTable = await newsPostTablePromise;
    return await newsPostTable.delete(id)
}