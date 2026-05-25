import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <div className="text-xl font-bold">Emarket</div>
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
          <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
            <a href="/login">Sign in</a>
            <a href="/seller">Sell</a>
            <a href="/cart">Cart</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-slate-900 text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-300">
                Marketplace MVP
              </p>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                Buy and sell everyday products in one modern marketplace.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-slate-300">
                Emarket brings customers, sellers, products, carts, and orders
                into a single Next.js and Rails commerce platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="rounded-md bg-amber-400 px-5 py-3 font-semibold text-slate-950"
                  href="/products"
                >
                  Browse products
                </Link>
                <Link
                  className="rounded-md border border-white/30 px-5 py-3 font-semibold"
                  href="/seller"
                >
                  Start selling
                </Link>
              </div>
            </div>
            <div className="rounded-lg bg-white p-5 text-slate-950 shadow-xl">
              <div className="mb-4 text-sm font-semibold text-slate-500">
                Today&apos;s marketplace preview
              </div>
              <div className="space-y-3">
                {["Wireless headphones", "Smart home hub", "Running shoes"].map(
                  (product) => (
                    <div
                      className="flex items-center justify-between rounded-md border border-slate-200 p-4"
                      key={product}
                    >
                      <span className="font-medium">{product}</span>
                      <span className="text-sm text-emerald-600">In stock</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="text-2xl font-bold">Shop by category</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Electronics", "Home", "Fashion", "Sports"].map((category) => (
              <Link
                className="rounded-lg border border-slate-200 bg-white p-6 font-semibold shadow-sm"
                href="/products"
                key={category}
              >
                {category}
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Featured products</h2>
              <p className="mt-2 text-slate-600">
                Static placeholders for the first storefront screen.
              </p>
            </div>
            <Link className="text-sm font-semibold text-slate-700" href="/products">
              View all
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Noise-canceling headphones",
              "Ergonomic office chair",
              "Stainless steel cookware",
            ].map((product) => (
              <article
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                key={product}
              >
                <div className="mb-4 aspect-[4/3] rounded-md bg-slate-100" />
                <h3 className="font-semibold">{product}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Marketplace-ready product card placeholder.
                </p>
                <div className="mt-4 font-bold">$99.00</div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
