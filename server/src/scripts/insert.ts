import minimist from 'minimist';
import { createPost, getAllPosts, closePool } from '../services/PoolService';
import { Genre } from '../enum/enum';
import { validateNewPost } from '../validation/validateNewPost';
import { NewsPostProps } from '../interface/NewsPostProps';

(async () => {
  try {
    const args = minimist(process.argv.slice(2));
    const { title, text, genre, isPrivate } = args;

    // Отримуємо поточну кількість постів (щоб призначити id = довжина + 1)
    const allPosts = await getAllPosts({ page: 0, size: Number.MAX_SAFE_INTEGER });
    const newId = allPosts.length + 1;

    // Формуємо новий пост
    const newPost: NewsPostProps = {
      title,
      text,
      genre: genre as Genre,
      isPrivate: isPrivate === 'true' || isPrivate === true,
    };

    // Валідація через Ajv
    const valid = validateNewPost(newPost);
    if (!valid) {
      console.error('❌ Дані не валідні:', validateNewPost.errors);
      process.exit(1);
    }

    // Запис у БД
    const post = await createPost(newPost);
    console.log('✅ Створено пост:', post);

  } catch (err) {
    console.error('❌ Помилка створення поста:', err);
  } finally {
    await closePool();
  }
})();