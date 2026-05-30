import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from '@/lib/auth';
import { query, mutate } from '@/lib/db';
import { Job } from '@/types';
import { runMatchingForJob } from '@/lib/matching';

export async function GET(request: Request) {
// ... existing code ...
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.userType !== 'employer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, location, salaryRange, jobType, experienceLevel, skills } = await request.json();

    if (!title || !description || !location || !jobType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const jobId = uuidv4();
    
    // Insert job
    const jobSql = `INSERT INTO jobs (id, employer_id, title, description, location, salary_range, job_type, experience_level) 
                    VALUES ('${jobId}', '${session.user.id}', '${title.replace(/'/g, "''")}', '${description.replace(/'/g, "''")}', 
                            '${location.replace(/'/g, "''")}', ${salaryRange ? `'${salaryRange.replace(/'/g, "''")}'` : 'NULL'}, 
                            '${jobType}', ${experienceLevel ? `'${experienceLevel.replace(/'/g, "''")}'` : 'NULL'})`;
    
    await mutate(jobSql);

    // Handle skills
    if (skills && Array.isArray(skills)) {
      for (const skillName of skills) {
        const trimmedSkill = skillName.trim();
        if (!trimmedSkill) continue;

        // Find or create skill
        let skillId: string;
        const existingSkills = await query<any>(`SELECT id FROM skills WHERE name = '${trimmedSkill.toLowerCase()}'`);
        
        if (existingSkills.length > 0) {
          skillId = existingSkills[0].id;
        } else {
          skillId = uuidv4();
          await mutate(`INSERT INTO skills (id, name) VALUES ('${skillId}', '${trimmedSkill.toLowerCase()}')`);
        }

        // Link skill to job
        await mutate(`INSERT INTO job_skills (job_id, skill_id) VALUES ('${jobId}', '${skillId}')`);
      }
    }

    // Trigger matching engine
    // We don't await this if we want it to run in background, but for MVP await is fine to ensure results.
    await runMatchingForJob(jobId);

    return NextResponse.json({ id: jobId }, { status: 201 });
  } catch (error) {
    console.error('Job creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
