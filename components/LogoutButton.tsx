'use client';

import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export function LogoutButton() {
  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        router.push('/login');
      }
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}
