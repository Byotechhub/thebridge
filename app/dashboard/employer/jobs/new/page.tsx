'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skills, setSkills] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          skills: skillList,
        }),
      });

      if (response.ok) {
        router.push('/dashboard/employer');
        router.refresh();
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to create job');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl text-blue-600">RoleBridge</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/dashboard/employer">
            <Button variant="outline" size="sm">Back to Dashboard</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>

          {error && (
            <div className="mb-6 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Job Title"
                name="title"
                required
                placeholder="e.g. Senior Frontend Engineer"
                disabled={loading}
              />
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  required
                  rows={5}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  disabled={loading}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Location"
                  name="location"
                  required
                  placeholder="e.g. Remote, New York, NY"
                  disabled={loading}
                />
                <Input
                  label="Salary Range (Optional)"
                  name="salaryRange"
                  placeholder="e.g. $120k - $150k"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-medium text-gray-700">Job Type</label>
                  <select
                    name="jobType"
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={loading}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <Input
                  label="Experience Level"
                  name="experienceLevel"
                  placeholder="e.g. Senior, 5+ years"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-700">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. React, TypeScript, Node.js"
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Posting job...' : 'Post Job Listing'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
