'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth } from "@/app/firebase/firebaseClient";
import { signInWithGoogle } from "@/app/hooks/useGoogleAuth";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [polling, setPolling] = useState<boolean>(false);

  // 🔁 Poll until the user clicks the email link, then create session & redirect
  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval);

          try {
            // 1) Create session cookie
            const token = await user.getIdToken();
            const sess = await fetch("/api/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            });
            if (!sess.ok) throw new Error("Session creation failed");

            // 2) Set default role
            const roleRes = await fetch("/api/session/set-default-role", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ uid: user.uid }),
            });
            if (!roleRes.ok) throw new Error("Setting default role failed");

            // 3) Redirect
            router.push("/home");
          } catch (err: any) {
            console.error("Post-verification error:", err);
            setError("❌ Something went wrong finalizing your account.");
          }
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [polling, router]);

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInfoMessage("");

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(user);

      // we can set default-role now (even before they verify)
      const roleRes = await fetch("/api/session/set-default-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });
      if (!roleRes.ok) {
        console.warn("Default-role responded", await roleRes.text());
      }

      setInfoMessage("✅ Verification email sent. Check your inbox!");
      setPolling(true);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError("❌ Sign-up failed. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setInfoMessage("");

    try {
      // This helper calls signInWithPopup + /api/session POST under the hood
      const uid = await signInWithGoogle();

      // Now set default role
      const roleRes = await fetch("/api/session/set-default-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      if (!roleRes.ok) throw new Error("Failed to set default role");

      // Redirect straight to home
      router.push("/home");
    } catch (err: any) {
      console.error("Google sign-up error:", err);
      setError("❌ Google sign-up failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {infoMessage && <p className="text-green-500 text-center mb-2">{infoMessage}</p>}

        <form onSubmit={handleEmailSignUp}>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-4"
          >
            Sign Up with Email
          </button>
        </form>

        <hr className="my-4" />

        <button
          onClick={handleGoogleSignUp}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up with Google
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
