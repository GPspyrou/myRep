'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { auth } from '@/app/firebase/firebaseClient';

const handleLogout = async (router: ReturnType<typeof useRouter>) => {
  try {
    await auth.signOut(); // Firebase sign-out
    await fetch('/api/session', { method: 'DELETE' }); // Remove session cookie
    router.push('/login');
  } catch (err) {
    console.error('Logout error:', err);
  }
};

export default function AuthWatcher({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Run only on first client-side load
    (async () => {
      try {
        const res = await fetch('/api/session/check');
        if (res.status === 401) {
          await handleLogout(router);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    })();
  }, [router]); 

  return <>{children}</>;
}
