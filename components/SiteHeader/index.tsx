"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUserMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserMenuOpen]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setIsUserMenuOpen(false);

    try {
      await apiRouter.auth.logout();
    } finally {
      queryClient.clear();
      router.push("/");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-blue-900/10 bg-[#0757c7] text-white shadow-[0_10px_30px_rgba(7,87,199,0.18)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap">
        <Link
          className="flex items-center gap-2 text-xl font-black tracking-tight"
          href="/"
        >
          <span className="grid size-9 place-items-center rounded-md bg-white text-[#0757c7] shadow-sm">
            E
          </span>
          <span>Emarket</span>
        </Link>

        {showSearch ? (
          <div className="order-3 flex w-full flex-1 items-center rounded-md bg-white p-1 shadow-[0_8px_24px_rgba(15,23,42,0.16)] ring-1 ring-white/30 lg:order-none lg:w-auto">
            <input
              aria-label="Search products"
              className="w-full rounded-md px-4 py-2.5 text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="Search products, brands, and stores"
              type="search"
            />
            <button className="rounded-md bg-sky-500 px-5 py-2.5 font-bold text-white shadow-sm hover:bg-sky-400">
              Search
            </button>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <nav className="ml-auto flex items-center gap-1 text-sm font-semibold">
          <Link className="rounded-md px-3 py-2 hover:bg-white/10" href="/products">
            Products
          </Link>
          <Link className="rounded-md px-3 py-2 hover:bg-white/10" href="/seller">
            Sell
          </Link>
          <Link className="rounded-md px-3 py-2 hover:bg-white/10" href="/cart">
            Cart
          </Link>
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 font-semibold hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSigningOut}
                onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
                type="button"
              >
                <span>{currentUser.name || "Account"}</span>
                <span aria-hidden="true" className="text-xs">
                  {isUserMenuOpen ? "^" : "v"}
                </span>
              </button>

              {isUserMenuOpen ? (
                <div
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-md border border-slate-200 bg-white py-1 text-sm font-semibold text-slate-800 shadow-xl"
                  role="menu"
                >
                  <Link
                    className="block px-4 py-2 hover:bg-blue-50"
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    role="menuitem"
                  >
                    Settings
                  </Link>
                  <Link
                    className="block px-4 py-2 hover:bg-blue-50"
                    href="/wishlists"
                    onClick={() => setIsUserMenuOpen(false)}
                    role="menuitem"
                  >
                    Wishlists
                  </Link>
                  <button
                    className="block w-full cursor-pointer px-4 py-2 text-left text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSigningOut}
                    onClick={handleSignOut}
                    role="menuitem"
                    type="button"
                  >
                    {isSigningOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              ) : null}
            </div>
          ) : isLoading ? null : (
            <Link className="rounded-md bg-white px-3 py-2 text-[#0757c7] hover:bg-blue-50" href="/login">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
