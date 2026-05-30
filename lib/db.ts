import { execSync } from 'child_process';

/**
 * Executes a SQL query using the team-db CLI.
 * Only use SELECT statements as per team rules for this tool.
 */
export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    let finalSql = sql;
    params.forEach((param) => {
      const sanitizedParam = typeof param === 'string' ? `'${param.replace(/'/g, "''")}'` : param;
      finalSql = finalSql.replace('?', sanitizedParam);
    });

    const escapedSql = finalSql.replace(/"/g, '\\"');
    const output = execSync(`team-db "${escapedSql}"`).toString();
    
    if (!output.trim() || output.trim() === '[]') return [];
    
    try {
      return JSON.parse(output);
    } catch (e) {
      // If it's not JSON, it might be a success message or empty
      return [] as T[];
    }
  } catch (error) {
    console.error('Error executing query:', error);
    throw new Error('Database query failed');
  }
}

/**
 * For mutations, we should ideally have a different path if team-db supports it,
 * but the current instruction is to use raw SQL for reads only.
 */
export async function mutate(sql: string, params: any[] = []): Promise<void> {
  try {
    let finalSql = sql;
    params.forEach((param) => {
      const sanitizedParam = typeof param === 'string' ? `'${param.replace(/'/g, "''")}'` : param === null ? 'NULL' : param;
      finalSql = finalSql.replace('?', sanitizedParam);
    });

    const escapedSql = finalSql.replace(/"/g, '\\"');
    execSync(`team-db "${escapedSql}"`);
  } catch (error) {
    console.error('Error executing mutation:', error);
    throw new Error('Database mutation failed');
  }
}
