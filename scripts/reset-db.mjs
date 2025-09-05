import { copyFileSync } from 'fs';

try {
  copyFileSync('db-backup.json', 'db.json');
  console.log('db.json reset from db-backup.json');
} catch (err) {
  console.error('Failed to reset db.json:', err.message);
  process.exitCode = 1;
}


