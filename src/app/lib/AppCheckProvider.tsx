'use client';

import { ReactNode, useEffect } from 'react';
import { getApps, initializeApp } from 'firebase/app';
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getToken,
  AppCheck
} from 'firebase/app-check';
import firebaseConfig from '@/app/firebase/firebaseConfig';

/**
 * Wrap your application to initialize Firebase App Check once,
 * and configure Google Maps to include the App Check token on every request.
 */
export function AppCheckProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize (or retrieve) the Firebase app
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

    // Initialize App Check
    const appCheck: AppCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY!
      ),
      isTokenAutoRefreshEnabled: true,
    });

    // Attach App Check token to all Google Maps JS API requests
    if (
      typeof window !== 'undefined' &&
      window.google?.maps?.Settings?.getInstance()
    ) {
      // @ts-ignore: augmenting Settings with fetchAppCheckToken
      (google.maps.Settings.getInstance() as any).fetchAppCheckToken = () =>
        getToken(appCheck, /* forceRefresh */ false).then((res) => res.token);
    }
  }, []);

  return <>{children}</>;
}
