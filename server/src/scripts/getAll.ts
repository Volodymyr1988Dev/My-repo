import minimist from 'minimist';
import { getAllPosts, closePool } from '../services/PoolService';

(async () => {
  try {
    const args = minimist(process.argv.slice(2));
    const { page, size } = args;
    const posts = await getAllPosts({ page, size });
    console.log('📄 Усі пости:', posts);
  } catch (err) {
    console.error('❌ Помилка отримання постів:', err);
  } finally {
    await closePool();
  }
})();