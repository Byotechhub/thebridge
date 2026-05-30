export type UserRole = 'candidate' | 'employer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  userType: UserRole;
  companyName?: string;
  bio?: string;
  experienceLevel?: string;
  desiredRoles?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  employerId: string;
  title: string;
  description: string;
  location: string;
  salaryRange?: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  jobId: string;
  candidateId: string;
  score: number;
  status: 'pending' | 'viewed' | 'shortlisted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
