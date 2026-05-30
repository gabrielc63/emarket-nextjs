"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiRouter from "@/api/router";
import { SiteHeader } from "@/components/SiteHeader";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const formatPrice = (priceCents: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(priceCents / 100);
};

const filters = ["All", "Free shipping", "In stock", "Best sellers"];

export default function ProductsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: apiRouter.products.getProducts,
  });
  const { data: wishlists } = useQuery({
    enabled: Boolean(currentUser),
    queryKey: ["wishlists"],
    queryFn: apiRouter.wishlists.getWishlists,
  });
  const savedProductIds = new Set(
    wishlists?.flatMap((wishlist) =>
      wishlist.items.map((item) => item.product.id),
    ) ?? [],
  );
  const addToWishlist = useMutation({
    mutationFn: async (productId: number) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      const availableWishlists =
        wishlists ?? (await apiRouter.wishlists.getWishlists());
      const wishlist =
        availableWishlists[0] ??
        (await apiRouter.wishlists.createWishlist({ name: "Favorites" }));

      await apiRouter.wishlists.addProductToWishlist({
        wishlistId: wishlist.id,
        productId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlists"] });
    },
  });

  return (
    <div className="min-h-screen bg-[#eef6ff] text-slate-950">
      <SiteHeader showSearch />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-blue-100 md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-sky-700">
                Marketplace
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                Products
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Browse active products from the Rails API with a storefront
                layout tuned for quick scanning.
              </p>
            </div>
            <Link
              className="inline-flex rounded-md bg-[#0757c7] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#063f98]"
              href="/"
            >
              Back home
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <button
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  index === 0
                    ? "bg-[#0757c7] text-white"
                    : "bg-blue-50 text-[#0757c7] hover:bg-blue-100"
                }`}
                key={filter}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div
                className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-blue-100"
                key={item}
              >
                <div className="aspect-[4/3] animate-pulse bg-blue-100" />
                <div className="p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-blue-100" />
                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-blue-100" />
                  <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-blue-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 font-semibold text-red-700">
            Could not load products. Check that the Rails API is running.
          </div>
        ) : products?.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-blue-100 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(7,87,199,0.14)]"
                key={product.id}
              >
                <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-blue-100 via-sky-50 to-white p-6 text-center text-lg font-black text-[#0757c7]">
                  <button
                    aria-label={
                      savedProductIds.has(product.id)
                        ? `${product.name} is already in your wishlist`
                        : `Add ${product.name} to wishlist`
                    }
                    className={`absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white text-xl shadow-sm ring-1 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 ${
                      savedProductIds.has(product.id)
                        ? "text-red-600 ring-red-100"
                        : "text-slate-400 ring-blue-100 hover:text-red-600"
                    }`}
                    disabled={addToWishlist.isPending}
                    onClick={() => addToWishlist.mutate(product.id)}
                    type="button"
                  >
                    {addToWishlist.isPending &&
                    addToWishlist.variables === product.id
                      ? "..."
                      : savedProductIds.has(product.id)
                        ? "♥"
                        : "♡"}
                  </button>
                  {product.name}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-black leading-snug">
                        {product.name}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {product.description || "No description yet."}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                      {product.stockQuantity} left
                    </span>
                  </div>
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-2xl font-black">
                        {formatPrice(product.priceCents, product.currency)}
                      </div>
                      <p className="mt-1 text-xs font-bold text-sky-700">
                        Store pickup available
                      </p>
                    </div>
                    <Link
                      className="rounded-md bg-blue-50 px-3 py-2 text-sm font-bold text-[#0757c7] hover:bg-[#0757c7] hover:text-white"
                      href={`/products/${product.id}`}
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-blue-100">
            <h2 className="text-xl font-black">No products yet</h2>
            <p className="mt-2 text-sm text-slate-600">
              Add active products in the Rails API to populate this page.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
