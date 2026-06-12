import { createClient, Client } from '@libsql/client';

/**
 * Lazily initialized database client.
 * Created on first query to avoid failing at module load time on Vercel.
 */
let client: Client | null = null;

function getClient(): Client {
  if (!client) {
    const url = process.env.DATABASE_URL || 'file:local.db';
    const authToken = process.env.DATABASE_AUTH_TOKEN;
    try {
      client = createClient({ url, authToken });
    } catch (e: any) {
      throw new Error(`Failed to create database client: ${e.message}`);
    }
  }
  return client;
}

/**
 * Executes a SQL query using libSQL client.
 */
export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const db = getClient();
    const result = await db.execute({
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
    const db = getClient();
    await db.execute({
      sql,
      args: params,
    });
  } catch (error: any) {
    console.error('Error executing mutation:', error);
    throw new Error(`Database mutation failed: ${error.message}`);
  }
}

/**
 * Default export for compatibility (e.g. setup route).
 * Lazily initialized, will throw if DB can't connect.
 */
export default function getDefaultClient() {
  return getClient();
}
