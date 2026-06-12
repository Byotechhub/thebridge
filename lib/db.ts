import { createClient } from '@libsql/client';

const url = process.env.DATABASE_URL || 'file:local.db';
const authToken = process.env.DATABASE_AUTH_TOKEN;

const client = createClient({
  url,
  authToken,
});

/**
 * Executes a SQL query using libSQL client.
 */
export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await client.execute({
      sql,
      args: params,
    });
    
    // libSQL returns rows that can be accessed by column name
    // We map them to plain objects to maintain compatibility with existing code
    return result.rows.map(row => {
      const obj: any = {};
      result.columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj as T;
    });
  } catch (error: any) {
    console.error('Error executing query:', error);
    throw new Error(`Database query failed: ${error.message}`);
  }
}

/**
 * Executes a mutation (INSERT, UPDATE, DELETE).
 */
export async function mutate(sql: string, params: any[] = []): Promise<void> {
  try {
    await client.execute({
      sql,
      args: params,
    });
  } catch (error: any) {
    console.error('Error executing mutation:', error);
    throw new Error(`Database mutation failed: ${error.message}`);
  }
}

export default client;
