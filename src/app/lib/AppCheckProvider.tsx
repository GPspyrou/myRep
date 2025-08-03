'use client';

import { ReactNode, useEffect } from 'react';
import { initializeApp }        from 'firebase/app';
import {
  initializeAppCheck,
  ReCaptchaV3Provider
} from 'firebase/app-check';
import firebaseConfig           from '@/app/firebase/firebaseConfig';

export function AppCheckProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const app = initializeApp(firebaseConfig);

    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY!
      ),
      isTokenAutoRefreshEnabled: true,
    });
  }, []);

  return <>{children}</>;
}