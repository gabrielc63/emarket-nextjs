"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import apiRouter from "@/api/router";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("Buyer One");
  const [email, setEmail] = useState("buyer@example.com");
  const [password, setPassword] = useState("password123");
  const [passwordConfirmation, setPasswordConfirmation] =
    useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await apiRouter.auth.register({
        name,
        email,
        password,
        passwordConfirmation,
      });
      router.push("/products");
    } catch (registerError) {
      setError(
        registerError instanceof Error
          ? registerError.message
          : "Registration failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-950">
      <form
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <Link className="text-xl font-bold" href="/">
          Emarket
        </Link>
        <h1 className="mt-8 text-2xl font-bold">Create account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Register a buyer account and receive a JWT from the Rails API.
        </p>

        {error ? (
          <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <label className="mt-6 block text-sm font-medium">
          Name
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            onChange={(event) => setName(event.target.value)}
            type="text"
            value={name}
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Email
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Password
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Confirm password
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            type="password"
            value={passwordConfirmation}
          />
        </label>

        <button
          className="mt-6 w-full rounded-md bg-slate-900 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-5 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-semibold text-slate-900" href="/login">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
