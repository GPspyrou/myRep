'use client';

import { useState } from 'react';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  message: string;
  privacyConsent: boolean;              // <-- new
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    number: '',
    message: '',
    privacyConsent: false,               // <-- new
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || 'Failed to send message.');
      }

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        number: '',
        message: '',
        privacyConsent: false,           // reset checkbox
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
  onSubmit={handleSubmit}
  className="
    w-full
    max-w-[900px] 
    mx-auto
    bg-white
   
    rounded-md 
    shadow-lg 
    flex 
    flex-col 
    gap-4
    
  "
>
  {/* Row 1: Name + Email */}
  <div className="flex flex-col bg-white  md:flex-row gap-4">
    <input
      type="text"
      name="firstName"
      placeholder="Name *"
      value={formData.firstName}
      onChange={handleChange}
      required
      className="flex-1 p-3 border border-gray-300 text-black bg-[#e6e2d8] placeholder-gray-500"
    />

    <input
      type="email"
      name="email"
      placeholder="Email *"
      value={formData.email}
      onChange={handleChange}
      required
      className="flex-1 p-3 border border-gray-300 text-black bg-[#e6e2d8] placeholder-gray-500"
    />
  </div>

  {/* Row 2: Surname + Phone */}
  <div className="flex flex-col md:flex-row gap-4">
    <input
      type="text"
      name="lastName"
      placeholder="Surname *"
      value={formData.lastName}
      onChange={handleChange}
      required
      className="flex-1 p-3 border border-gray-300 text-black bg-[#e6e2d8] placeholder-gray-500"
    />

    <input
      type="tel"
      name="number"
      placeholder="Phone *"
      value={formData.number}
      onChange={handleChange}
      required
      className="flex-1 p-3 border border-gray-300 text-black bg-[#e6e2d8] placeholder-gray-500"
    />
  </div>

  {/* Message (full width) */}
  <textarea
    name="message"
    placeholder="Your Message"
    value={formData.message}
    onChange={handleChange}
    required
    className="p-3 border border-gray-300 text-black bg-[#e6e2d8] placeholder-gray-500 h-36 resize-none"
  />

  {/* Consent */}
  <div className="flex items-start gap-2">
    <input
      id="privacyConsent"
      type="checkbox"
      name="privacyConsent"
      checked={formData.privacyConsent}
      onChange={handleChange}
      required
      className="mt-1"
    />
    <label htmlFor="privacyConsent" className="text-sm text-black">
      I have read and agree with the{' '}
      <a
        href="/privacy-policy"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        Privacy Policy
      </a>{' '}
      *
    </label>
  </div>

  {/* Submit */}
  <button
    type="submit"
    disabled={loading}
    className="bg-black hover:bg-neutral-800 text-white font-semibold py-3 px-6 rounded transition-all"
  >
    {loading ? 'Sending...' : 'Submit'}
  </button>

  {/* Feedback */}
  {success && (
    <p className="text-green-600 text-center">
      Message sent successfully!
    </p>
  )}
  {error && (
    <p className="text-red-600 text-center">
      Error: {error}
    </p>
  )}
</form>

  );
}
