"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import apiRouter from "@/api/router";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type SiteHeaderProps = {
  showSearch?: boolean;
};

export const SiteHeader = ({ showSearch = false }: SiteHeaderProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser, isLoading } = useCurrentUser();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await apiRouter.auth.logout();
    } finally {
      queryClient.clear();
      router.push("/");
      router.refresh();
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
        <Link className="text-xl font-bold" href="/">
          Emarket
        </Link>

        {showSearch ? (
          <div className="flex flex-1 items-center rounded-md border border-slate-300 bg-white">
            <input
              className="w-full rounded-md px-4 py-2 outline-none"
              placeholder="Search products, brands, and stores"
              type="search"
            />
            <button className="rounded-r-md bg-amber-400 px-5 py-2 font-semibold text-slate-950">
              Search
            </button>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/products">Products</Link>
          <Link href="/seller">Sell</Link>
          <Link href="/cart">Cart</Link>
          {currentUser ? (
            <>
              <Link href="/profile">{currentUser.name || "Profile"}</Link>
              <button
                className="cursor-pointer rounded-md px-2 py-1 font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSigningOut}
                onClick={handleSignOut}
                type="button"
              >
                {isSigningOut ? "Signing out..." : "Sign out"}
              </button>
            </>
          ) : isLoading ? null : (
            <Link href="/login">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
};
