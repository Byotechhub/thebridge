'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogoutButton } from '@/components/LogoutButton';
import Link from 'next/link';

interface JobMatch {
  match_id: string;
  id: string;
  title: string;
  employer_name: string;
  location: string;
  salary_range: string;
  job_type: string;
  score: number;
  status: string;
  skills: string[];
}

interface ProfileData {
  bio: string;
  experience_level: string;
  desired_roles: string;
  skills: string[];
}

export default function CandidateDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [profile, setProfile] = useState<ProfileData>({
    bio: '',
    experience_level: '',
    desired_roles: '',
    skills: []
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (user && user.userType === 'candidate') {
      fetchDashboardData();
    }
  }, [user]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [matchesRes, profileRes] = await Promise.all([
        fetch('/api/candidate/matches'),
        fetch('/api/candidate/profile')
      ]);

      if (matchesRes.ok) {
        const matchesData = await matchesRes.json();
        setMatches(matchesData);
      }

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile({
          bio: profileData.bio || '',
          experience_level: profileData.experience_level || '',
          desired_roles: profileData.desired_roles || '',
          skills: profileData.skills || []
        });
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch('/api/candidate/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        alert('Profile updated successfully!');
        fetchDashboardData(); // Refresh matches
      }
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setUpdating(false);
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skillToRemove) });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user || user.userType !== 'candidate') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Unauthorized access.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl text-blue-600">RoleBridge</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <span className="text-sm text-gray-600">
            Candidate: <strong>{user.name}</strong>
          </span>
          <Link href="/">
            <Button variant="ghost" size="sm">Home</Button>
          </Link>
          <LogoutButton />
        </nav>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Matched Jobs */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold">Your Matched Jobs</h1>
            
            {matches.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                <p className="text-lg">No matches found yet.</p>
                <p className="text-sm mt-2">Try updating your profile with more skills and desired roles!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {matches.map((match) => (
                  <div key={match.match_id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">{match.title}</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          {Math.round(match.score)}% Match
                        </span>
                      </div>
                      <p className="text-blue-600 font-medium">{match.employer_name}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                        <span>{match.location}</span>
                        <span>•</span>
                        <span>{match.job_type}</span>
                        {match.salary_range && (
                          <>
                            <span>•</span>
                            <span>{match.salary_range}</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {match.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-2">
                      <Button size="sm">Apply Now</Button>
                      <Button variant="outline" size="sm">Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Profile Management */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Your Profile</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea 
                    className="w-full p-2 border rounded-md text-sm min-h-[100px]"
                    placeholder="Tell us about yourself..."
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>
                
                <Input 
                  label="Experience Level" 
                  placeholder="e.g. Mid-Level, 5 years"
                  value={profile.experience_level}
                  onChange={(e) => setProfile({ ...profile, experience_level: e.target.value })}
                />
                
                <Input 
                  label="Desired Roles" 
                  placeholder="e.g. Frontend Developer, Product Manager"
                  value={profile.desired_roles}
                  onChange={(e) => setProfile({ ...profile, desired_roles: e.target.value })}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Skills</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. React"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.skills.map((skill, idx) => (
                      <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-blue-900">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={updating}>
                  {updating ? 'Saving...' : 'Update Profile & Refresh Matches'}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
