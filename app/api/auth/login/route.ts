import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { login } from '@/lib/auth';
import { User } from '@/types';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const users = await query<User>(`SELECT * FROM users WHERE email = ?`, [email]);
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.full_name,
      userType: user.user_type,
    };

    await login(sessionUser);

    return NextResponse.json({ user: sessionUser });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      details: error.toString()
    }, { status: 500 });
  }
}
