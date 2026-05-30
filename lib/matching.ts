import { query, mutate } from './db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Simple matching engine to score candidates against a job based on skills.
 */
export async function runMatchingForJob(jobId: string) {
  try {
    // 1. Get job requirements
    const jobSkills = await query<{ skill_id: string }>(`
      SELECT skill_id FROM job_skills WHERE job_id = ?
    `, [jobId]);

    if (jobSkills.length === 0) return;

    const requiredSkillIds = jobSkills.map(s => s.skill_id);

    // 2. Get all candidates and their skills
    const candidates = await query<{ id: string }>(`
      SELECT id FROM users WHERE user_type = 'candidate'
    `);

    for (const candidate of candidates) {
      const candidateSkills = await query<{ skill_id: string }>(`
        SELECT skill_id FROM user_skills WHERE user_id = ?
      `, [candidate.id]);

      const candidateSkillIds = candidateSkills.map(s => s.skill_id);

      // 3. Calculate overlap
      const matchingSkills = candidateSkillIds.filter(id => requiredSkillIds.includes(id));
      const score = (matchingSkills.length / requiredSkillIds.length) * 100;

      if (score > 0) {
        // 4. Record the match
        const existingMatch = await query<any>(`
          SELECT id FROM matches WHERE job_id = ? AND candidate_id = ?
        `, [jobId, candidate.id]);

        if (existingMatch.length > 0) {
          await mutate(`
            UPDATE matches SET score = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
          `, [score, existingMatch[0].id]);
        } else {
          await mutate(`
            INSERT INTO matches (id, job_id, candidate_id, score, status)
            VALUES (?, ?, ?, ?, 'pending')
          `, [uuidv4(), jobId, candidate.id, score]);
        }
      }
    }
  } catch (error) {
    console.error('Matching engine error:', error);
  }
}

/**
 * Run matching for a candidate against all jobs.
 */
export async function runMatchingForCandidate(candidateId: string) {
  try {
    const candidateSkills = await query<{ skill_id: string }>(`
      SELECT skill_id FROM user_skills WHERE user_id = ?
    `, [candidateId]);

    if (candidateSkills.length === 0) return;
    const candidateSkillIds = candidateSkills.map(s => s.skill_id);

    const jobs = await query<{ id: string }>(`SELECT id FROM jobs`);

    for (const job of jobs) {
      const jobSkills = await query<{ skill_id: string }>(`
        SELECT skill_id FROM job_skills WHERE job_id = ?
      `, [job.id]);
      
      if (jobSkills.length === 0) continue;
      const requiredSkillIds = jobSkills.map(s => s.skill_id);

      const matchingSkills = candidateSkillIds.filter(id => requiredSkillIds.includes(id));
      const score = (matchingSkills.length / requiredSkillIds.length) * 100;

      if (score > 0) {
        const existingMatch = await query<any>(`
          SELECT id FROM matches WHERE job_id = ? AND candidate_id = ?
        `, [job.id, candidateId]);

        if (existingMatch.length > 0) {
          await mutate(`
            UPDATE matches SET score = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
          `, [score, existingMatch[0].id]);
        } else {
          await mutate(`
            INSERT INTO matches (id, job_id, candidate_id, score, status)
            VALUES (?, ?, ?, ?, 'pending')
          `, [uuidv4(), job.id, candidateId, score]);
        }
      }
    }
  } catch (error) {
    console.error('Matching engine error:', error);
  }
}
