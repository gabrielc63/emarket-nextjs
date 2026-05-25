"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import apiRouter from "@/api/router";

const formatPrice = (priceCents: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(priceCents / 100);
};

export default function ProductsPage() {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: apiRouter.products.getProducts,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link className="text-xl font-bold" href="/">
            Emarket
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/products">Products</Link>
            <Link href="/seller">Sell</Link>
            <Link href="/cart">Cart</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
              Marketplace
            </p>
            <h1 className="mt-2 text-3xl font-bold">Products</h1>
            <p className="mt-2 text-slate-600">
              Browse active products from the Rails API.
            </p>
          </div>
          <Link
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            href="/"
          >
            Back home
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                key={item}
              >
                <div className="mb-4 aspect-[4/3] animate-pulse rounded-md bg-slate-100" />
                <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
            Could not load products. Check that the Rails API is running.
          </div>
        ) : products?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                key={product.id}
              >
                <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-md bg-slate-100 text-sm font-semibold text-slate-500">
                  {product.name}
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">{product.name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                      {product.description || "No description yet."}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                    {product.stockQuantity} left
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-lg font-bold">
                    {formatPrice(product.priceCents, product.currency)}
                  </div>
                  <Link
                    className="text-sm font-semibold text-slate-700"
                    href={`/products/${product.id}`}
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <h2 className="font-semibold">No products yet</h2>
            <p className="mt-2 text-sm text-slate-600">
              Add active products in the Rails API to populate this page.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
