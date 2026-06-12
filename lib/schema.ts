export const schema = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    user_type TEXT NOT NULL,
    company_name TEXT,
    bio TEXT,
    experience_level TEXT,
    desired_roles TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    employer_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    salary_range TEXT,
    job_type TEXT NOT NULL,
    experience_level TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES users(id)
  )`,
  `CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS job_skills (
    job_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    PRIMARY KEY (job_id, skill_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (skill_id) REFERENCES skills(id)
  )`,
  `CREATE TABLE IF NOT EXISTS user_skills (
    user_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (skill_id) REFERENCES skills(id)
  )`,
  `CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    candidate_id TEXT NOT NULL,
    score REAL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (candidate_id) REFERENCES users(id)
  )`
];
