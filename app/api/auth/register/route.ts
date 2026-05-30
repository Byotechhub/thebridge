import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import { login } from '@/lib/auth';
import { User } from '@/types';

export async function POST(request: Request) {
  try {
    const { email, password, name, role, userType, companyName, company_name } = await request.json();

    const finalRole = (role || userType) as 'candidate' | 'employer';
    const finalCompanyName = company_name || companyName;

    if (!email || !password || !name || !finalRole) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUsers = await query<User>(`SELECT * FROM users WHERE email = ?`, [email]);
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await query(
      `INSERT INTO users (id, email, password_hash, full_name, user_type, company_name) VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, email, hashedPassword, name, finalRole, finalCompanyName || null]
    );

    const user = { id: userId, email, name, userType: finalRole };
    await login(user);

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
