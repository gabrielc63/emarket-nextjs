"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import apiRouter from "@/api/router";

const formatPrice = (priceCents: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(priceCents / 100);
};

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const {
    data: product,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products", productId],
    queryFn: () => apiRouter.products.getProduct(productId),
    enabled: Boolean(productId),
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
        <Link className="text-sm font-semibold text-slate-700" href="/products">
          Back to products
        </Link>

        {isLoading ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="aspect-square animate-pulse rounded-lg bg-slate-100" />
            <div>
              <div className="h-8 w-2/3 animate-pulse rounded bg-slate-100" />
              <div className="mt-4 h-5 w-full animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="mt-8 h-10 w-32 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
            Could not load this product. It may be unavailable or the Rails API
            may not be running.
          </div>
        ) : product ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex aspect-square items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-center text-xl font-bold text-slate-500 shadow-sm">
              {product.name}
            </div>

            <section>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
                {product.status}
              </p>
              <h1 className="mt-2 text-3xl font-bold md:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 max-w-2xl text-slate-600">
                {product.description || "No description yet."}
              </p>

              <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-3xl font-bold">
                  {formatPrice(product.priceCents, product.currency)}
                </div>
                <div className="mt-3 text-sm text-slate-600">
                  SKU: {product.sku || "Not assigned"}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Stock: {product.stockQuantity} available
                </div>
                <button className="mt-6 w-full rounded-md bg-amber-400 px-5 py-3 font-semibold text-slate-950 md:w-auto">
                  Add to cart
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}
