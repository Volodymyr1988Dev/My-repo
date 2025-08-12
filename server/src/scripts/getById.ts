import 'dotenv/config';
import minimist from 'minimist';
import { getPostById, closePool } from '../services/PoolService';

(async () => {
  try {
    const args = minimist(process.argv.slice(2));
    const { id } = args;
    if (!id) {
      console.error('❌ Використання: node scripts/getById --id=1');
      process.exit(1);
    }

    const post = await getPostById(Number(id));
    console.log('📄 Пост:', post);
  } catch (err) {
    console.error('❌ Помилка отримання поста:', err);
  } finally {
    await closePool();
  }
})();