import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface MatchWithCandidate {
  id: string;
  score: number;
  status: string;
  full_name: string;
  email: string;
  experience_level: string;
}

export default async function JobMatchesPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const { id: jobId } = await params;

  if (!session || session.user.userType !== 'employer') {
    redirect('/login');
  }

  // Verify the job belongs to this employer
  const jobs = await query<any>(`SELECT title FROM jobs WHERE id = '${jobId}' AND employer_id = '${session.user.id}'`);
  if (jobs.length === 0) {
    redirect('/dashboard/employer');
  }

  const jobTitle = jobs[0].title;

  // Fetch matches with candidate info
  const matches = await query<MatchWithCandidate>(`
    SELECT m.id, m.score, m.status, u.full_name, u.email, u.experience_level
    FROM matches m
    JOIN users u ON m.candidate_id = u.id
    WHERE m.job_id = '${jobId}'
    ORDER BY m.score DESC
  `);

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
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Matches for {jobTitle}</h1>
            <p className="text-gray-500 mt-2">Discover candidates pre-vetted for this role.</p>
          </div>

          {matches.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-300 text-center text-gray-500">
              <p className="text-lg">No matches found yet.</p>
              <p className="text-sm">Matching happens automatically when new candidates join.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {matches.map((match) => (
                <div key={match.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-900">{match.full_name}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        {Math.round(match.score)}% Match
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                      <span>{match.email}</span>
                      <span>•</span>
                      <span>{match.experience_level || 'Experience not specified'}</span>
                      <span>•</span>
                      <span className="capitalize">{match.status}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-2">
                    <Button size="sm">Shortlist</Button>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
