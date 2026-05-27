"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiRouter from "@/api/router";
import { SiteHeader } from "@/components/SiteHeader";
import { currentUserQueryKey, useCurrentUser } from "@/hooks/useCurrentUser";

type User = APISchema.User;

function ProfileForm({ currentUser }: { currentUser: User }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(currentUser.name || "");
  const [email, setEmail] = useState(currentUser.email);
  const [message, setMessage] = useState<string | null>(null);

  const updateProfile = useMutation({
    mutationFn: apiRouter.auth.updateCurrentUser,
    onSuccess: (user) => {
      queryClient.setQueryData(currentUserQueryKey, user);
      setMessage("Profile updated.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    updateProfile.mutate({ name, email });
  };

  return (
    <form
      className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-blue-100"
      onSubmit={handleSubmit}
    >
      {message ? (
        <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      ) : null}

      {updateProfile.error ? (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          {updateProfile.error instanceof Error
            ? updateProfile.error.message
            : "Could not update profile."}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold">
          Name
          <input
            className="mt-2 w-full rounded-md border border-blue-200 bg-blue-50/40 px-3 py-2.5 outline-none focus:border-[#0757c7] focus:bg-white focus:ring-4 focus:ring-blue-100"
            onChange={(event) => setName(event.target.value)}
            type="text"
            value={name}
          />
        </label>

        <label className="block text-sm font-bold">
          Email
          <input
            className="mt-2 w-full rounded-md border border-blue-200 bg-blue-50/40 px-3 py-2.5 outline-none focus:border-[#0757c7] focus:bg-white focus:ring-4 focus:ring-blue-100"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
        </label>
      </div>

      <button
        className="mt-6 rounded-md bg-[#0757c7] px-5 py-3 font-bold text-white shadow-sm hover:bg-[#063f98] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={updateProfile.isPending}
        type="submit"
      >
        {updateProfile.isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}

export default function ProfilePage() {
  const { data: currentUser, error, isLoading } = useCurrentUser();

  return (
    <div className="min-h-screen bg-[#eef6ff] text-slate-950">
      <SiteHeader showSearch />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link
          className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-[#0757c7] shadow-sm ring-1 ring-blue-100 hover:bg-blue-50"
          href="/products"
        >
          Back to products
        </Link>

        <section className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-blue-100 md:p-7">
          <p className="text-sm font-bold uppercase tracking-wide text-sky-700">
            Account
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Profile settings
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Keep your marketplace account details current for checkout and order
            communication.
          </p>
        </section>

        {isLoading ? (
          <div className="mt-6 rounded-xl bg-white p-6 font-semibold shadow-sm ring-1 ring-blue-100">
            Loading profile...
          </div>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 font-semibold text-red-700">
            Please sign in to manage your profile.
          </div>
        ) : currentUser ? (
          <ProfileForm currentUser={currentUser} key={currentUser.id} />
        ) : null}
      </main>
    </div>
  );
}
