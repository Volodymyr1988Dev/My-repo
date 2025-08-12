import minimist from 'minimist';
import { updatePost, closePool } from '../services/PoolService'; // твій файл з функціями
import { Genre } from '../enum/enum';
import { validateNewPost } from '../validation/validateNewPost';


(async () => {
  try {
    const args = minimist(process.argv.slice(2));
    const { id, title, text, genre, isPrivate } = args;

    if (!id) {
      console.error('❌ Потрібно вказати id поста, який оновлюємо: --id=1');
      process.exit(1);
    }

    const updateData: Record<string, any> = {};

    if (title !== undefined) updateData.title = title;
    if (text !== undefined) updateData.text = text;
    if (genre !== undefined) updateData.genre = genre as Genre;
    if (isPrivate !== undefined) {
      updateData.isPrivate = isPrivate === 'true' || isPrivate === true;
    }

    if (Object.keys(updateData).length === 0) {
      console.error('❌ Немає полів для оновлення');
      process.exit(1);
    }

    // Валідація — використовуємо схему нового поста, але без id та createDate
    const valid = validateNewPost({
      title: updateData.title ?? 'validTitle',
      text: updateData.text ?? 'validText',
      genre: updateData.genre ?? Genre.OTHER,
      isPrivate: updateData.isPrivate ?? false
    });

    if (!valid) {
      console.error('❌ Дані не валідні:', validateNewPost.errors);
      process.exit(1);
    }

    const post = await updatePost(Number(id), updateData);
    console.log('✅ Пост оновлено:', post);

  } catch (err) {
    console.error('❌ Помилка оновлення поста:', err);
  } finally {
    await closePool();
  }
})();