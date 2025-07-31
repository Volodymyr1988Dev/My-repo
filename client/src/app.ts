import {getTable} from "./fileDb";
import {NewsPostProps} from "./interface/NewsPostProps";


async function app() {
    const newsPostTable = await getTable('newsPosts');

    const newPostData: NewsPostProps = {
        title: 'Лисичка народила!',
        text: 'У Чернігові в зоопарку лисичка народила лисенятко!',
    };

    const created = await newsPostTable.create(newPostData);
    console.log('🔹 Created:', created);

    const all = await newsPostTable.getAll();
    console.log('📄 All:', all);

    const byId = await newsPostTable.getById(created.id);
    console.log('🔍 By ID:', byId);

    const updated = await newsPostTable.update(created.id, { title: 'Оновлений заголовок' });
    console.log('✏️ Updated:', updated);

    const deletedId = await newsPostTable.delete(created.id);
    console.log('🗑️ Deleted ID:', deletedId);
}

app().catch(console.error);