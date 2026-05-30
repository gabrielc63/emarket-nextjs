"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import apiRouter from "@/api/router";
import { SiteHeader } from "@/components/SiteHeader";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const formatPrice = (priceCents: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(priceCents / 100);
};

export default function WishlistsPage() {
  const {
    data: currentUser,
    error: currentUserError,
    isLoading: isCurrentUserLoading,
  } = useCurrentUser();

  const {
    data: wishlists,
    error: wishlistsError,
    isLoading: areWishlistsLoading,
  } = useQuery({
    enabled: Boolean(currentUser),
    queryKey: ["wishlists"],
    queryFn: apiRouter.wishlists.getWishlists,
  });

  const isLoading = isCurrentUserLoading || areWishlistsLoading;

  return (
    <div className="min-h-screen bg-[#eef6ff] text-slate-950">
      <SiteHeader showSearch />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-blue-100 md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-sky-700">
                Account
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                Wishlists
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Keep track of products you want to revisit, compare, or buy
                later.
              </p>
            </div>
            <Link
              className="inline-flex rounded-md bg-[#0757c7] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#063f98]"
              href="/products"
            >
              Browse products
            </Link>
          </div>
        </section>

        {isLoading ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {[0, 1].map((item) => (
              <div
                className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-blue-100"
                key={item}
              >
                <div className="h-6 w-1/3 animate-pulse rounded bg-blue-100" />
                <div className="mt-5 space-y-3">
                  <div className="h-16 animate-pulse rounded-md bg-blue-100" />
                  <div className="h-16 animate-pulse rounded-md bg-blue-100" />
                </div>
              </div>
            ))}
          </div>
        ) : currentUserError ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <h2 className="text-xl font-black">Sign in required</h2>
            <p className="mt-2 text-sm font-medium">
              Wishlists are saved to your account.
            </p>
            <Link
              className="mt-4 inline-flex rounded-md bg-[#0757c7] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#063f98]"
              href="/login"
            >
              Sign in
            </Link>
          </div>
        ) : wishlistsError ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 font-semibold text-red-700">
            Could not load wishlists. Check that the Rails API is running.
          </div>
        ) : wishlists?.length ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {wishlists.map((wishlist) => (
              <article
                className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-blue-100"
                key={wishlist.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black">{wishlist.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {wishlist.items.length}{" "}
                      {wishlist.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0757c7]">
                    Saved list
                  </span>
                </div>

                {wishlist.items.length ? (
                  <div className="mt-5 divide-y divide-blue-100">
                    {wishlist.items.map((item) => (
                      <Link
                        className="flex items-center justify-between gap-4 py-4 hover:text-[#0757c7]"
                        href={`/products/${item.product.id}`}
                        key={item.id}
                      >
                        <div>
                          <h3 className="font-bold">{item.product.name}</h3>
                          <p className="mt-1 line-clamp-1 text-sm text-slate-600">
                            {item.product.description || "No description yet."}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="font-black">
                            {formatPrice(
                              item.product.priceCents,
                              item.product.currency,
                            )}
                          </div>
                          <p className="mt-1 text-xs font-bold text-emerald-700">
                            {item.product.stockQuantity} left
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-md bg-blue-50 p-4 text-sm font-semibold text-slate-600">
                    This wishlist is empty.
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-blue-100">
            <h2 className="text-xl font-black">No wishlists yet</h2>
            <p className="mt-2 text-sm text-slate-600">
              Create wishlists from product pages once wishlist actions are
              added to the storefront.
            </p>
            <Link
              className="mt-5 inline-flex rounded-md bg-[#0757c7] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#063f98]"
              href="/products"
            >
              Browse products
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
