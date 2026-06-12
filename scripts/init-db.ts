import 'dotenv/config';
import { createClient } from '@libsql/client';
import { schema } from '../lib/schema';

const url = process.env.DATABASE_URL || 'file:local.db';
const authToken = process.env.DATABASE_AUTH_TOKEN;

const client = createClient({
  url,
  authToken,
});

async function main() {
  console.log('Initializing database schema...');
  
  for (const statement of schema) {
    try {
      await client.execute(statement);
    } catch (err: any) {
      console.error(`Error executing statement: ${statement}`);
      console.error(err.message);
    }
  }

  console.log('Database initialization complete.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
