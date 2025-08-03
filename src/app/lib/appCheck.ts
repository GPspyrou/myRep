// app/lib/appCheck.ts
import { getApps, initializeApp } from 'firebase/app';
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  AppCheck
} from 'firebase/app-check';
import firebaseConfig from '@/app/firebase/firebaseConfig';

const firebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

export const appCheck: AppCheck = initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider(
    process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY!
  ),
  isTokenAutoRefreshEnabled: true,
});
