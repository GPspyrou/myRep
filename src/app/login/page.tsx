// app/login/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/hooks/useFirebaseLogin';
import { signInWithGoogle } from '@/app/hooks/useGoogleAuth';
import { initializeApp, getApps } from 'firebase/app';
import firebaseConfig from '@/app/firebase/firebaseConfig';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const router                  = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      // Initialize app & App Check dynamically on client
      const app = !getApps().length
        ? initializeApp(firebaseConfig)
        : initializeApp(firebaseConfig);
      const { initializeAppCheck, ReCaptchaV3Provider, getToken } = await import('firebase/app-check');
      const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(
          process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY!
        ),
        isTokenAutoRefreshEnabled: true,
      });

      const { token } = await getToken(appCheck, true);
      console.log('✅ App Check Token:', token);

      await login(email, password);
      router.push('/listings');
    } catch (err: any) {
      console.error('❌ Login error:', err);
      let msg = 'Unknown error occurred';

      if (err.code === 'auth/user-not-found')       msg = 'No user found with that email.';
      else if (err.code === 'auth/wrong-password')  msg = 'Incorrect password.';
      else if (err.code === 'auth/invalid-email')   msg = 'Invalid email format.';
      else if (err.message === 'email-not-verified') {
        router.push('/verify-email');
        return;
      } else if (err.message?.includes('Token issue')) {
        msg = 'Token issue: server couldn’t verify.';
      }

      setError(`❌ ${msg}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const app = !getApps().length
        ? initializeApp(firebaseConfig)
        : initializeApp(firebaseConfig);
      const { initializeAppCheck, ReCaptchaV3Provider, getToken } = await import('firebase/app-check');
      const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(
          process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY!
        ),
        isTokenAutoRefreshEnabled: true,
      });

      const { token } = await getToken(appCheck, true);
      console.log('✅ App Check Token (Google):', token);

      await signInWithGoogle();
      router.push('/listings');
    } catch (err) {
      console.error('Google login error:', err);
      setError('❌ Google sign-in failed or your email is not verified.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <div className="text-red-600 text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded mb-4"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <p className="text-right text-sm mb-4">
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </p>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-4"
          >
            Login
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded flex items-center justify-center gap-2 hover:shadow-md transition mb-4"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        <p className="text-center mt-4 text-sm">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
