"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import apiRouter from "@/api/router";
import { SiteHeader } from "@/components/SiteHeader";

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
    <div className="min-h-screen bg-[#eef6ff] text-slate-950">
      <SiteHeader showSearch />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-[#0757c7] shadow-sm ring-1 ring-blue-100 hover:bg-blue-50"
          href="/products"
        >
          Back to products
        </Link>

        {isLoading ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="aspect-square animate-pulse rounded-xl bg-blue-100" />
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-blue-100">
              <div className="h-8 w-2/3 animate-pulse rounded bg-blue-100" />
              <div className="mt-4 h-5 w-full animate-pulse rounded bg-blue-100" />
              <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-blue-100" />
              <div className="mt-8 h-10 w-32 animate-pulse rounded bg-blue-100" />
            </div>
          </div>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 font-semibold text-red-700">
            Could not load this product. It may be unavailable or the Rails API
            may not be running.
          </div>
        ) : product ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-blue-100">
              <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-blue-100 via-sky-50 to-white p-8 text-center text-3xl font-black text-[#0757c7]">
                {product.name}
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-blue-100 p-3">
                {["Secure", "Fast", "Tracked"].map((label) => (
                  <div
                    className="rounded-md bg-blue-50 px-3 py-2 text-center text-xs font-bold text-sky-700"
                    key={label}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-blue-100 md:p-7">
              <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0757c7]">
                {product.status}
              </p>
              <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                {product.description || "No description yet."}
              </p>

              <div className="mt-7 rounded-xl bg-[#f7fbff] p-5 ring-1 ring-blue-100">
                <div className="text-4xl font-black">
                  {formatPrice(product.priceCents, product.currency)}
                </div>
                <p className="mt-2 text-sm font-bold text-emerald-700">
                  Free shipping on selected orders
                </p>

                <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="rounded-md bg-white p-3 ring-1 ring-blue-100">
                    <span className="block font-bold text-slate-950">SKU</span>
                    {product.sku || "Not assigned"}
                  </div>
                  <div className="rounded-md bg-white p-3 ring-1 ring-blue-100">
                    <span className="block font-bold text-slate-950">Stock</span>
                    {product.stockQuantity} available
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button className="rounded-md bg-[#0757c7] px-5 py-3 font-bold text-white shadow-sm hover:bg-[#063f98]">
                    Add to cart
                  </button>
                  <button className="rounded-md bg-white px-5 py-3 font-bold text-[#0757c7] ring-1 ring-blue-200 hover:bg-blue-50">
                    Buy now
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}
