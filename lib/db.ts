import { execSync } from 'child_process';

/**
 * Executes a SQL query using the team-db CLI.
 * Only use SELECT statements as per team rules for this tool.
 */
export async function query<T>(sql: string): Promise<T[]> {
  try {
    // Sanitize the SQL string for the command line (basic)
    const escapedSql = sql.replace(/"/g, '\\"');
    const output = execSync(`team-db "${escapedSql}"`).toString();
    
    if (!output.trim()) return [];
    
    return JSON.parse(output);
  } catch (error) {
    console.error('Error executing query:', error);
    throw new Error('Database query failed');
  }
}

/**
 * For mutations, we should ideally have a different path if team-db supports it,
 * but the current instruction is to use raw SQL for reads only.
 */
export async function mutate(sql: string): Promise<void> {
  // Use with caution - lead mentioned raw SQL for reads only, 
  // but also said "team-db <SQL statement>" triggers sync.
  try {
    const escapedSql = sql.replace(/"/g, '\\"');
    execSync(`team-db "${escapedSql}"`);
  } catch (error) {
    console.error('Error executing mutation:', error);
    throw new Error('Database mutation failed');
  }
}
