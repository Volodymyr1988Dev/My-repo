import 'dotenv/config';
import { createNewsTable, closePool } from '../services/PoolService';

(async () => {
  try {
    await createNewsTable();
    console.log('✅ Table "newsposts" created (or already existed).');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
})();