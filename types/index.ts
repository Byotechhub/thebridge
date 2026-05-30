export type UserRole = 'candidate' | 'employer';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  user_type: UserRole;
  company_name?: string;
  bio?: string;
  experience_level?: string;
  desired_roles?: string;
  created_at?: string;
  updated_at?: string;
  // CamelCase versions for consistency with existing frontend code if needed
  fullName?: string;
  userType?: UserRole;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  location: string;
  salary_range?: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience_level?: string;
  created_at?: string;
  updated_at?: string;
  // CamelCase versions
  employerId?: string;
  salaryRange?: string;
  jobType?: string;
  experienceLevel?: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  job_id: string;
  candidate_id: string;
  score: number;
  status: 'pending' | 'viewed' | 'shortlisted' | 'rejected';
  created_at?: string;
  updated_at?: string;
  // CamelCase versions
  jobId?: string;
  candidateId?: string;
}
