"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiRouter from "@/api/router";
import type { Wishlist } from "@/api/wishlist";
import { SiteHeader } from "@/components/SiteHeader";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const formatPrice = (priceCents: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(priceCents / 100);
};

const NEW_WISHLIST_VALUE = "__new_wishlist__";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const productId = params.id;
  const [selectedWishlistId, setSelectedWishlistId] = useState("");
  const [newWishlistName, setNewWishlistName] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [wishlistFormError, setWishlistFormError] = useState("");
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useCurrentUser();

  const {
    data: product,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products", productId],
    queryFn: () => apiRouter.products.getProduct(productId),
    enabled: Boolean(productId),
  });

  const { data: wishlists, isLoading: areWishlistsLoading } = useQuery({
    enabled: Boolean(currentUser),
    queryKey: ["wishlists"],
    queryFn: apiRouter.wishlists.getWishlists,
  });

  const effectiveWishlistId =
    selectedWishlistId ||
    (wishlists?.length ? String(wishlists[0].id) : NEW_WISHLIST_VALUE);
  const selectedWishlist = wishlists?.find(
    (wishlist) => String(wishlist.id) === effectiveWishlistId,
  );
  const isProductInSelectedWishlist = Boolean(
    product &&
      selectedWishlist?.items.some((item) => item.product.id === product.id),
  );
  const shouldCreateWishlist =
    effectiveWishlistId === NEW_WISHLIST_VALUE || !wishlists?.length;

  const saveToWishlist = useMutation({
    mutationFn: async () => {
      if (!product) {
        throw new Error("Product is not ready yet.");
      }

      const wishlist = shouldCreateWishlist
        ? await apiRouter.wishlists.createWishlist({
            name: newWishlistName.trim(),
          })
        : selectedWishlist;

      if (!wishlist) {
        throw new Error("Choose a wishlist before saving this product.");
      }

      return await apiRouter.wishlists.addProductToWishlist({
        wishlistId: wishlist.id,
        productId: product.id,
      });
    },
    onSuccess: (wishlist) => {
      setWishlistFormError("");
      setWishlistMessage(
        `${product?.name ?? "Product"} saved to ${wishlist.name}.`,
      );
      setSelectedWishlistId(String(wishlist.id));
      setNewWishlistName("");
      queryClient.setQueryData<Wishlist[]>(["wishlists"], (current = []) => {
        const wishlistExists = current.some((item) => item.id === wishlist.id);

        return wishlistExists
          ? current.map((item) => (item.id === wishlist.id ? wishlist : item))
          : [...current, wishlist];
      });
      queryClient.invalidateQueries({ queryKey: ["wishlists"] });
    },
  });

  const handleWishlistSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWishlistFormError("");
    setWishlistMessage("");

    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (shouldCreateWishlist && !newWishlistName.trim()) {
      setWishlistFormError("Name the new wishlist before saving this product.");
      return;
    }

    saveToWishlist.mutate();
  };

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

                <form
                  className="mt-6 rounded-lg bg-white p-4 ring-1 ring-blue-100"
                  onSubmit={handleWishlistSubmit}
                >
                  <label
                    className="block text-sm font-black text-slate-950"
                    htmlFor="wishlist-select"
                  >
                    Save to wishlist
                  </label>
                  <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
                    <select
                      className="min-h-12 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-[#0757c7] focus:ring-2 focus:ring-blue-100"
                      disabled={
                        !currentUser ||
                        isCurrentUserLoading ||
                        areWishlistsLoading
                      }
                      id="wishlist-select"
                      onChange={(event) => {
                        setSelectedWishlistId(event.target.value);
                        setWishlistFormError("");
                        setWishlistMessage("");
                      }}
                      value={effectiveWishlistId}
                    >
                      {wishlists?.map((wishlist) => (
                        <option key={wishlist.id} value={wishlist.id}>
                          {wishlist.name}
                        </option>
                      ))}
                      <option value={NEW_WISHLIST_VALUE}>
                        Create a new wishlist
                      </option>
                    </select>

                    <button
                      className="min-h-12 rounded-md bg-[#0757c7] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#063f98] disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={
                        saveToWishlist.isPending ||
                        isLoading ||
                        isCurrentUserLoading ||
                        areWishlistsLoading ||
                        isProductInSelectedWishlist
                      }
                      type="submit"
                    >
                      {isCurrentUserLoading || areWishlistsLoading
                        ? "Loading..."
                        : !currentUser
                        ? "Sign in to save"
                        : saveToWishlist.isPending
                          ? "Saving..."
                          : isProductInSelectedWishlist
                            ? "Already saved"
                            : "Save product"}
                    </button>
                  </div>

                  {shouldCreateWishlist ? (
                    <div className="mt-3">
                      <label
                        className="block text-xs font-bold uppercase tracking-wide text-sky-700"
                        htmlFor="wishlist-name"
                      >
                        New wishlist name
                      </label>
                      <input
                        className="mt-2 min-h-12 w-full rounded-md border border-blue-200 px-3 py-2 text-sm font-semibold outline-none placeholder:text-slate-400 focus:border-[#0757c7] focus:ring-2 focus:ring-blue-100"
                        disabled={!currentUser || saveToWishlist.isPending}
                        id="wishlist-name"
                        onChange={(event) => {
                          setNewWishlistName(event.target.value);
                          setWishlistFormError("");
                        }}
                        placeholder="Favorites"
                        type="text"
                        value={newWishlistName}
                      />
                    </div>
                  ) : null}

                  {wishlistFormError || saveToWishlist.error ? (
                    <p className="mt-3 text-sm font-semibold text-red-700">
                      {wishlistFormError ||
                        (saveToWishlist.error instanceof Error
                          ? saveToWishlist.error.message
                          : "Could not save this product.")}
                    </p>
                  ) : null}

                  {wishlistMessage ? (
                    <p className="mt-3 text-sm font-semibold text-emerald-700">
                      {wishlistMessage}
                    </p>
                  ) : null}
                </form>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}
