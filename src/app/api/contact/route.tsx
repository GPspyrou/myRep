export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

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
  // Initialize Upstash Redis
  // Split combined Upstash secret by character count
  const combined = process.env.UPSTASH_COMBINED;
  if (!combined) {
    throw new Error('Missing UPSTASH_COMBINED env var');
  }
  // Known length of the URL portion
  const URL_LENGTH = 36; // e.g. length of "https://bright-dodo-10875.upstash.io"
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
    // Record consent
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

    // Send email
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
      tls: {
        // Ensure proper certificate verification in prod
        rejectUnauthorized: true,
      },
    });

    console.log(process.env.SMTP_USER, process.env.SMTP_PASS);
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