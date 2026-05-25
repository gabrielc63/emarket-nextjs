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

type Endpoints = {
  getProducts: () => Promise<APISchema.Product[]>;
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

const endpoints: Endpoints = {
  getProducts: async () => {
    const products = await api<ProductResponse[]>("products");

    return products.map(toProduct);
  },
};

export default endpoints;
