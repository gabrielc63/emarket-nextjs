import api from "./index";

type ProductResponse = {
  id: number;
  name: string;
  slug: string;
  sku?: string | null;
  description?: string | null;
  price_cents: number;
  currency: string;
  stock_quantity: number;
  status: string;
  created_at: string;
  updated_at: string;
};

type WishlistItemResponse = {
  id: number;
  created_at: string;
  updated_at: string;
  product: ProductResponse;
};

type WishlistResponse = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  items: WishlistItemResponse[];
};

export type WishlistItem = {
  id: number;
  createdAt: string;
  updatedAt: string;
  product: APISchema.Product;
};

export type Wishlist = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  items: WishlistItem[];
};

type CreateWishlistInput = {
  name: string;
};

type AddProductToWishlistInput = {
  wishlistId: number;
  productId: number;
};

type Endpoints = {
  getWishlists: () => Promise<Wishlist[]>;
  createWishlist: (input: CreateWishlistInput) => Promise<Wishlist>;
  addProductToWishlist: (input: AddProductToWishlistInput) => Promise<Wishlist>;
};

const toProduct = (product: ProductResponse): APISchema.Product => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  sku: product.sku ?? undefined,
  description: product.description ?? undefined,
  priceCents: product.price_cents,
  currency: product.currency,
  stockQuantity: product.stock_quantity,
  status: product.status,
  createdAt: product.created_at,
  updatedAt: product.updated_at,
});

const toWishlist = (wishlist: WishlistResponse): Wishlist => ({
  id: wishlist.id,
  name: wishlist.name,
  createdAt: wishlist.created_at,
  updatedAt: wishlist.updated_at,
  items: wishlist.items.map((item) => ({
    id: item.id,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    product: toProduct(item.product),
  })),
});

const endpoints: Endpoints = {
  getWishlists: async () => {
    const wishlists = await api<WishlistResponse[]>("wishlists");

    return wishlists.map(toWishlist);
  },
  createWishlist: async (input) => {
    const wishlist = await api<WishlistResponse>("wishlists", {
      method: "post",
      data: {
        wishlist: {
          name: input.name,
        },
      },
    });

    return toWishlist(wishlist);
  },
  addProductToWishlist: async (input) => {
    const wishlist = await api<WishlistResponse>(
      `wishlists/${input.wishlistId}/wishlist_items`,
      {
        method: "post",
        data: {
          product_id: input.productId,
        },
      },
    );

    return toWishlist(wishlist);
  },
};

export default endpoints;
