import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.userType === 'employer') {
    redirect('/dashboard/employer');
  } else {
    redirect('/dashboard/candidate');
  }
}
