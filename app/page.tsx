import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getSession } from '@/lib/auth';
import { logout } from '@/lib/actions';

export default async function LandingPage() {
  const session = await getSession();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl text-blue-600">RoleBridge</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          {session ? (
            <>
              <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
                Dashboard
              </Link>
              <form action={logout}>
                <button type="submit" className="text-sm font-medium hover:underline underline-offset-4 text-gray-600">
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                Sign In
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Smart Skill-Based Job Matching
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Connecting qualified candidates with open roles faster and more accurately. No more endless scrolling.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register?role=candidate">
                  <Button size="lg">Find a Job</Button>
                </Link>
                <Link href="/register?role=employer">
                  <Button variant="outline" size="lg">Hire Talent</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Why RoleBridge?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-2 border p-6 rounded-lg shadow-sm">
                <div className="bg-blue-100 p-3 rounded-full mb-2">
                  <svg
                    className=" h-6 w-6 text-blue-600"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Skill-Based Matching</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our engine matches candidates based on actual skills, not just keywords.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 border p-6 rounded-lg shadow-sm">
                <div className="bg-blue-100 p-3 rounded-full mb-2">
                  <svg
                    className=" h-6 w-6 text-blue-600"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Pre-Vetted Talent</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Employers get high-fit applicants, reducing the time to interview.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 border p-6 rounded-lg shadow-sm">
                <div className="bg-blue-100 p-3 rounded-full mb-2">
                  <svg
                    className=" h-6 w-6 text-blue-600"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Save Time</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Fast-track your career or your hiring process with our intelligent platform.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2026 RoleBridge. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="/api/setup">
            DB Setup
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
