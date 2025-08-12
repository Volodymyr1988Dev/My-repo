import 'dotenv/config';
import minimist from 'minimist';
import { deletePost, closePool } from '../services/PoolService';

(async () => {
  try {
    const args = minimist(process.argv.slice(2));
    const { id } = args;

    if (!id) {
      console.error('❌ Використання: node scripts/delete --id=1');
      process.exit(1);
    }

    const deleted = await deletePost(Number(id));
    console.log('🗑 Видалено:', deleted);
  } catch (err) {
    console.error('❌ Помилка видалення поста:', err);
  } finally {
    await closePool();
  }
})();