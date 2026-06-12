import { NextResponse } from 'next/server';
import client from '@/lib/db';
import { schema } from '@/lib/schema';

export async function GET() {
  try {
    const results = [];
    
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL is not set, using default: file:local.db');
    }

    for (const statement of schema) {
      try {
        await client.execute(statement);
        results.push({ statement: statement.split('(')[0].trim(), status: 'ok' });
      } catch (err: any) {
        results.push({ statement: statement.split('(')[0].trim(), status: 'error', message: err.message });
      }
    }

    const hasError = results.some(r => r.status === 'error');
    
    return NextResponse.json({
      status: hasError ? 'partial_error' : 'ok',
      database: process.env.DATABASE_URL || 'file:local.db',
      results
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
