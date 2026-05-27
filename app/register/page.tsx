"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import apiRouter from "@/api/router";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
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
    <main className="grid min-h-screen bg-[#eef6ff] px-4 py-10 text-slate-950 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:p-0">
      <section className="hidden bg-[radial-gradient(circle_at_top_left,#38bdf8_0,#0757c7_42%,#082f49_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Link className="flex items-center gap-2 text-xl font-black" href="/">
          <span className="grid size-9 place-items-center rounded-md bg-white text-[#0757c7]">
            E
          </span>
          Emarket
        </Link>
        <div className="max-w-xl">
          <p className="mb-4 inline-flex rounded-full bg-white/12 px-3 py-1 text-sm font-bold uppercase tracking-wide text-sky-100 ring-1 ring-white/20">
            Create account
          </p>
          <h1 className="text-5xl font-black leading-tight tracking-tight">
            Join the marketplace with a buyer-ready profile.
          </h1>
          <p className="mt-5 text-lg leading-8 text-blue-50">
            Register against the Rails API and move straight into the product
            experience.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {["Fast setup", "JWT backed", "Ready to shop"].map((item) => (
            <span
              className="rounded-md bg-white/10 px-3 py-2 font-bold ring-1 ring-white/15"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center">
        <form
          className="w-full max-w-md rounded-xl bg-white p-6 shadow-[0_24px_70px_rgba(7,87,199,0.14)] ring-1 ring-blue-100"
          onSubmit={handleSubmit}
        >
          <Link
            className="flex items-center gap-2 text-xl font-black lg:hidden"
            href="/"
          >
            <span className="grid size-9 place-items-center rounded-md bg-[#0757c7] text-white">
              E
            </span>
            Emarket
          </Link>
          <h1 className="mt-8 text-3xl font-black tracking-tight">
            Create account
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Register an account.
          </p>

          {error ? (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}

          <label className="mt-6 block text-sm font-bold">
            Name
            <input
              className="mt-2 w-full rounded-md border border-blue-200 bg-blue-50/40 px-3 py-2.5 outline-none focus:border-[#0757c7] focus:bg-white focus:ring-4 focus:ring-blue-100"
              onChange={(event) => setName(event.target.value)}
              type="text"
              value={name}
            />
          </label>

          <label className="mt-4 block text-sm font-bold">
            Email
            <input
              className="mt-2 w-full rounded-md border border-blue-200 bg-blue-50/40 px-3 py-2.5 outline-none focus:border-[#0757c7] focus:bg-white focus:ring-4 focus:ring-blue-100"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
            />
          </label>

          <label className="mt-4 block text-sm font-bold">
            Password
            <input
              className="mt-2 w-full rounded-md border border-blue-200 bg-blue-50/40 px-3 py-2.5 outline-none focus:border-[#0757c7] focus:bg-white focus:ring-4 focus:ring-blue-100"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </label>

          <label className="mt-4 block text-sm font-bold">
            Confirm password
            <input
              className="mt-2 w-full rounded-md border border-blue-200 bg-blue-50/40 px-3 py-2.5 outline-none focus:border-[#0757c7] focus:bg-white focus:ring-4 focus:ring-blue-100"
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              type="password"
              value={passwordConfirmation}
            />
          </label>

          <button
            className="mt-6 w-full rounded-md bg-[#0757c7] px-4 py-3 font-bold text-white shadow-sm hover:bg-[#063f98] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-bold text-[#0757c7]" href="/login">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
