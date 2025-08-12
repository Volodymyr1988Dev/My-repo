import minimist from 'minimist';
import { createPost, getAllPosts, closePool } from '../services/PoolService';
import { Genre } from '../enum/enum';
import { validateNewPost } from '../validation/validateNewPost';
import { NewsPostProps } from '../interface/NewsPostProps';

(async () => {
  try {
    const args = minimist(process.argv.slice(2));
    const { title, text, genre, isPrivate } = args;

    if (!title || !text) {
      console.error('❌ Використання: node scripts/insert --title="Заголовок" --text="Текст" [--genre=GENRE] [--isPrivate=true]');
      process.exit(1);
    }
    const newPost: NewsPostProps = {
      title,
      text,
      genre: genre as Genre,
      isPrivate: isPrivate === 'true' || isPrivate === true,
    };

    const valid = validateNewPost(newPost);
    if (!valid) {
      console.error('❌ Дані не валідні:', validateNewPost.errors);
      process.exit(1);
    }

    const post = await createPost(newPost);
    console.log('✅ Створено пост:', post);

  } catch (err) {
    console.error('❌ Помилка створення поста:', err);
  } finally {
    await closePool();
  }
})();