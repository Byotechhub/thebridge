import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.userType !== 'candidate') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    const matches = await query<any>(`
      SELECT m.id as match_id, m.score, m.status, j.*, u.company_name as employer_name
      FROM matches m
      JOIN jobs j ON m.job_id = j.id
      JOIN users u ON j.employer_id = u.id
      WHERE m.candidate_id = ?
      ORDER BY m.score DESC
    `, [userId]);

    // For each job, also get its skills
    const matchesWithSkills = await Promise.all(matches.map(async (match: any) => {
      const skills = await query<any>(`
        SELECT s.name 
        FROM skills s
        JOIN job_skills js ON s.id = js.skill_id
        WHERE js.job_id = ?
      `, [match.id]);
      return {
        ...match,
        skills: skills.map((s: any) => s.name)
      };
    }));

    return NextResponse.json(matchesWithSkills);
  } catch (error) {
    console.error('Matches fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
