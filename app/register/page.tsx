'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'employer' ? 'employer' : 'candidate';
  const [role, setRole] = useState<'candidate' | 'employer'>(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userType: role,
        }),
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        const result = await response.json();
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="text-center">
          <Link href="/">
            <span className="text-3xl font-bold text-blue-600">RoleBridge</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8">
          <div className="flex p-1 bg-gray-100 rounded-lg mb-8">
            <button
              disabled={loading}
              onClick={() => setRole('candidate')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                role === 'candidate' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Candidate
            </button>
            <button
              disabled={loading}
              onClick={() => setRole('employer')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                role === 'employer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Employer
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Full Name"
                id="full-name"
                name="name"
                type="text"
                required
                placeholder={role === 'candidate' ? "John Doe" : "Hiring Manager"}
              />
              {role === 'employer' && (
                <Input
                  label="Company Name"
                  id="company-name"
                  name="companyName"
                  type="text"
                  required
                  placeholder="Acme Corp"
                />
              )}
              <Input
                label="Email address"
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : `Register as ${role === 'candidate' ? 'Candidate' : 'Employer'}`}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
