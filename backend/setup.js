import 'dotenv/config';
import { User } from './src/models/user.js';
import { client } from './src/utils/db.js';

client.sync()
  .then(() => {
    console.log('Database & tables synced without making any changes to existing tables');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });
