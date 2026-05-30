import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Job } from '@/types';
import { LogoutButton } from '@/components/LogoutButton';

export default async function EmployerDashboard() {
  const session = await getSession();

  if (!session || session.user.userType !== 'employer') {
    redirect('/login');
  }

  const jobs = await query<Job>(`
    SELECT * FROM jobs 
    WHERE employer_id = '${session.user.id}' 
    ORDER BY created_at DESC
  `);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl text-blue-600">RoleBridge</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <span className="text-sm text-gray-600">
            Employer: <strong>{session.user.name}</strong>
          </span>
          <Link href="/">
            <Button variant="outline" size="sm">Home</Button>
          </Link>
          <LogoutButton />
        </nav>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Employer Dashboard</h1>
            <Link href="/dashboard/employer/jobs/new">
              <Button>Post a New Job</Button>
            </Link>
          </div>

          <div className="grid gap-6">
            <h2 className="text-xl font-semibold">Your Job Listings</h2>
            
            {jobs.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                <p className="text-lg">You haven't posted any jobs yet.</p>
                <Link href="/dashboard/employer/jobs/new" className="text-blue-600 hover:underline mt-2 inline-block">
                  Create your first listing now
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.jobType}</span>
                        {job.salaryRange && (
                          <>
                            <span>•</span>
                            <span>{job.salaryRange}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-2">
                      <Link href={`/dashboard/employer/jobs/${job.id}/matches`}>
                        <Button variant="outline" size="sm">View Matches</Button>
                      </Link>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
