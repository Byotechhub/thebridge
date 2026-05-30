import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, mutate } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { runMatchingForCandidate } from '@/lib/matching';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.userType !== 'candidate') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const users = await query<any>(`SELECT * FROM users WHERE id = '${userId}'`);
    
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];
    const skills = await query<any>(`
      SELECT s.id, s.name 
      FROM skills s
      JOIN user_skills us ON s.id = us.skill_id
      WHERE us.user_id = '${userId}'
    `);

    return NextResponse.json({
      ...user,
      skills: skills.map((s: any) => s.name)
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.userType !== 'candidate') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { bio, experience_level, desired_roles, skills } = await request.json();

    // Update user profile
    await mutate(`
      UPDATE users 
      SET bio = ?,
          experience_level = ?,
          desired_roles = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [bio, experience_level, desired_roles, userId]);

    // Update skills
    if (skills && Array.isArray(skills)) {
      // Clear existing skills
      await mutate(`DELETE FROM user_skills WHERE user_id = ?`, [userId]);

      for (const skillName of skills) {
        const trimmedSkill = skillName.trim();
        if (!trimmedSkill) continue;

        // Find or create skill
        let skillId: string;
        const existingSkills = await query<any>(`SELECT id FROM skills WHERE name = ?`, [trimmedSkill.toLowerCase()]);
        
        if (existingSkills.length > 0) {
          skillId = existingSkills[0].id;
        } else {
          skillId = uuidv4();
          await mutate(`INSERT INTO skills (id, name) VALUES (?, ?)`, [skillId, trimmedSkill.toLowerCase()]);
        }

        // Link skill to user
        await mutate(`INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)`, [userId, skillId]);
      }
    }

    // Trigger matching engine
    await runMatchingForCandidate(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
