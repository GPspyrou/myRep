// This API route handles contact form submissions for a GoDaddy Office 365 account.
// It includes rate limiting, privacy consent storage, and email sending via OAuth2.
// Basic authentication is provided as commented-out code for reference.

// Import required modules for Next.js, email sending, and external services
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { ConfidentialClientApplication } from '@azure/msal-node';

// Declare global variables for Firestore and rate limiter
let db: ReturnType<typeof getFirestore>;
let ratelimit: Ratelimit;

/**
 * Initializes Firestore, Upstash Redis, and the rate limiter.
 * Sets up services for database operations and rate limiting.
 */
function initServices() {
  // Initialize Firebase Admin if not already set up
  if (!admin.apps.length) {
    // Retrieve Firebase private key from environment variable
    const rawKey = process.env.ADMIN_PRIVATE_KEY;
    if (!rawKey) throw new Error('Missing ADMIN_PRIVATE_KEY env var');

    // Configure Firebase Admin with service account credentials
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.ADMIN_PROJECT_ID!,
        clientEmail: process.env.ADMIN_CLIENT_EMAIL!,
        privateKey: rawKey.replace(/\\n/g, '\n'), // Replace escaped newlines
      }),
    });
  }
  // Assign Firestore instance
  db = getFirestore();

  // Retrieve combined Upstash secret for Redis
  const combinedUpstash = process.env.UPSTASH_COMBINED;
  if (!combinedUpstash) throw new Error('Missing UPSTASH_COMBINED env var');

  // Extract URL and token from combined secret - adjust length based on your Upstash URL
  const UPSTASH_URL_LEN = 36; // e.g., 
  const upstashUrl = combinedUpstash.slice(0, UPSTASH_URL_LEN);
  const upstashToken = combinedUpstash.slice(UPSTASH_URL_LEN);
  console.log('Upstash URL:', upstashUrl);

  // Initialize Redis client for rate limiting
  const redis = new Redis({ url: upstashUrl, token: upstashToken });
  // Configure rate limiter: 5 requests per 6000 seconds (100 minutes)
  ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '6000 s') });
}

/**
 * Acquires an OAuth2 access token from Azure AD using a combined secret.
 * Extracts client ID, tenant ID, and client secret for SMTP authentication.
 */
async function getAccessToken(): Promise<string> {
  // Retrieve combined Azure OAuth secret
  const combined = process.env.AZURE_OAUTH_COMBINED;
  if (!combined) throw new Error('Missing AZURE_OAUTH_COMBINED env var');

  // Define lengths for GUIDs (client ID and tenant ID)
  const CLIENT_ID_LEN = 36; // e.g.,
  const TENANT_ID_LEN = 36; // e.g., 
  const clientId = combined.slice(0, CLIENT_ID_LEN);
  const tenantId = combined.slice(CLIENT_ID_LEN, CLIENT_ID_LEN + TENANT_ID_LEN);
  const clientSecret = combined.slice(CLIENT_ID_LEN + TENANT_ID_LEN);

  // Validate extracted credentials
  if (!clientId || !tenantId || !clientSecret) {
    throw new Error('AZURE_OAUTH_COMBINED is not correctly formatted');
  }
  console.log('Azure Client ID:', clientId);
  console.log('Azure Client ID:', tenantId);
  // Initialize MSAL client for OAuth2
  const cca = new ConfidentialClientApplication({
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      clientSecret,
    },
  });

  // Request token for Office 365 SMTP
  const result = await cca.acquireTokenByClientCredential({
    scopes: ['https://outlook.office365.com/.default'],
  });
  if (!result || !result.accessToken) {
    throw new Error('Failed to acquire access token from Azure AD');
  }

  return result.accessToken;
}

/**
 * POST /api/contact
 * Processes contact form submissions:
 * - Validates input and privacy consent
 * - Applies rate limiting
 * - Stores consent in Firestore
 * - Sends email via Office 365 SMTP with OAuth2
 */
export async function POST(req: NextRequest) {
  // Initialize Firebase and rate limiter
  initServices();

  // Extract IP and user agent for rate limiting and logging
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const ua = req.headers.get('user-agent') ?? '';

  // Check rate limit for this IP
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  // Parse and validate form data
  const body = await req.json();
  const { firstName, lastName, email, number, message, privacyConsent } = body;
  if (!firstName || !lastName || !email || !number || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  if (!privacyConsent) {
    return NextResponse.json({ error: 'Privacy consent required' }, { status: 400 });
  }

  try {
    // Store privacy consent in Firestore for compliance
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

    // Obtain OAuth2 access token
    const accessToken = await getAccessToken();

    // Configure Nodemailer for Office 365 SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_USER!, // Office 365 email
        accessToken,
      },
    });

    // Send email with form details
    await transporter.sendMail({
      from: `"${firstName} ${lastName}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${number}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    // Return success response
    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    // Log and return error
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

/*
// Alternative: Basic Authentication (Deprecated by Microsoft in September 2025)
// Use this only if OAuth2 setup is not feasible. It’s less secure and temporary.

// Replace the OAuth2 transporter setup with:
// const transporter = nodemailer.createTransport({
//   host: 'smtp.office365.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER, // Office 365 email
//     pass: process.env.EMAIL_PASS, // Password or app password if MFA enabled
//   },
// });

// Update sendMail to use text instead of HTML for simplicity:
// await transporter.sendMail({
//   from: `"Contact Form" <${process.env.EMAIL_USER}>`,
//   to: process.env.EMAIL_USER,
//   replyTo: email,
//   subject: 'New Contact Form Submission',
//   text: `
// First Name: ${firstName}
// Last Name: ${lastName}
// Email: ${email}
// Phone Number: ${number}
// Message: ${message}
//   `,
// });

// Environment variables required:
// - EMAIL_USER: Your Office 365 email address
// - EMAIL_PASS: Your password or app password (if MFA is enabled)

// Note: Enable SMTP Authentication in GoDaddy’s Email & Office Dashboard.
// This method will stop working after September 2025. Transition to OAuth2 is recommended.
*/