"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    window.location.href = "/";
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-6">
      <h1 className="font-heading mb-8 text-2xl font-semibold text-slate-900 dark:text-slate-50">
        Sign in
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="py-3"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="py-3"
          required
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <Button type="submit" className="w-full py-3">
          Sign in
        </Button>
      </form>
      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="rounded-lg border border-slate-200 py-3 transition-colors hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="rounded-lg border border-slate-200 py-3 transition-colors hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
        >
          Continue with GitHub
        </button>
      </div>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[#3B82F6] hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
