export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { ConfidentialClientApplication } from '@azure/msal-node';

let db: ReturnType<typeof getFirestore>;
let ratelimit: Ratelimit;

function initServices() {
  // Initialize Firebase Admin
  if (!admin.apps.length) {
    const rawKey = process.env.ADMIN_PRIVATE_KEY;
    if (!rawKey) {
      throw new Error('Missing ADMIN_PRIVATE_KEY env var');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.ADMIN_PROJECT_ID!,
        clientEmail: process.env.ADMIN_CLIENT_EMAIL!,
        privateKey: rawKey.replace(/\\n/g, '\n'),
      }),
    });
  }
  db = getFirestore();

  // Split combined Upstash secret by character count
  const combined = process.env.UPSTASH_COMBINED;
  if (!combined) {
    throw new Error('Missing UPSTASH_COMBINED env var');
  }
  const URL_LENGTH = 36; // length of the URL portion
  const upstashUrl = combined.slice(0, URL_LENGTH);
  const upstashToken = combined.slice(URL_LENGTH);

  // Initialize Upstash Redis
  const redis = new Redis({ url: upstashUrl, token: upstashToken });

  // Initialize rate limiter
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '6000 s'),
  });
}

// Acquire an OAuth2 access token using client credentials
async function getAccessToken(): Promise<string> {
  const { AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_CLIENT_SECRET } = process.env;
  if (!AZURE_CLIENT_ID || !AZURE_TENANT_ID || !AZURE_CLIENT_SECRET) {
    throw new Error('Missing Azure OAuth2 environment variables');
  }

  const cca = new ConfidentialClientApplication({
    auth: {
      clientId: AZURE_CLIENT_ID,
      authority: `https://login.microsoftonline.com/${AZURE_TENANT_ID}`,
      clientSecret: AZURE_CLIENT_SECRET,
    }
  });

  const result = await cca.acquireTokenByClientCredential({
    scopes: ['https://outlook.office365.com/.default'],
  });

  if (!result || !result.accessToken) {
    throw new Error('Failed to acquire access token from Azure AD');
  }

  return result.accessToken;
}

export async function POST(req: NextRequest) {
  initServices();
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const ua = req.headers.get('user-agent') ?? '';

  // Rate limiting
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }

  // Parse and validate body
  const { firstName, lastName, email, number, message, privacyConsent } = await req.json();
  if (!firstName || !lastName || !email || !number || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  if (!privacyConsent) {
    return NextResponse.json({ error: 'You must accept the Privacy Policy' }, { status: 400 });
  }

  try {
    // Record consent in Firestore
    await db.collection('privacyConsents').add({
      firstName,
      lastName,
      email,
      number,
      acceptedAt: new Date().toISOString(),
      ipAddress: ip,
      userAgent: ua,
      policyVersion: process.env.PRIVACY_POLICY_VERSION || '1.0',
      context: 'contact-form',
    });

    // Acquire OAuth2 token for SMTP
    const accessToken = await getAccessToken();

    // Configure Nodemailer with OAuth2
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_USER!,
        accessToken,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"${firstName} ${lastName}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `New Contact Form Submission`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${number}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
