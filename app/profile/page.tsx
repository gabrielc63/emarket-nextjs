"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiRouter from "@/api/router";
import { SiteHeader } from "@/components/SiteHeader";
import { currentUserQueryKey, useCurrentUser } from "@/hooks/useCurrentUser";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: currentUser, error, isLoading } = useCurrentUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loadedUserId, setLoadedUserId] = useState<number | null>(null);

  if (currentUser && loadedUserId !== currentUser.id) {
    setLoadedUserId(currentUser.id);
    setName(currentUser.name || "");
    setEmail(currentUser.email);
  }

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
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link className="text-sm font-semibold text-slate-700" href="/products">
          Back to products
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Profile settings</h1>
        <p className="mt-2 text-slate-600">
          Update your marketplace account name and email.
        </p>

        {isLoading ? (
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            Loading profile...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
            Please sign in to manage your profile.
          </div>
        ) : (
          <form
            className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            onSubmit={handleSubmit}
          >
            {message ? (
              <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            {updateProfile.error ? (
              <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {updateProfile.error instanceof Error
                  ? updateProfile.error.message
                  : "Could not update profile."}
              </div>
            ) : null}

            <label className="block text-sm font-medium">
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

            <button
              className="mt-6 rounded-md bg-slate-900 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={updateProfile.isPending}
              type="submit"
            >
              {updateProfile.isPending ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
