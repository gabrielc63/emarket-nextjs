import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const categories = [
  { name: "Electronics", meta: "Phones, audio, smart home" },
  { name: "Home", meta: "Kitchen, decor, tools" },
  { name: "Fashion", meta: "Shoes, basics, accessories" },
  { name: "Sports", meta: "Training, bikes, outdoors" },
];

const featuredProducts = [
  {
    name: "Noise-canceling headphones",
    price: "$99.00",
    tag: "Free shipping",
  },
  {
    name: "Ergonomic office chair",
    price: "$189.00",
    tag: "Top rated",
  },
  {
    name: "Stainless steel cookware",
    price: "$74.00",
    tag: "Deal of the day",
  },
];

const benefits = ["Protected checkout", "Fast local delivery", "Verified sellers"];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#eef6ff] text-slate-950">
      <SiteHeader showSearch />

      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#38bdf8_0,#0757c7_34%,#053a85_72%,#082f49_100%)] text-white">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#eef6ff] to-transparent" />
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-16">
            <div className="relative z-10">
              <p className="mb-4 inline-flex rounded-full bg-white/12 px-3 py-1 text-sm font-bold uppercase tracking-wide text-sky-100 ring-1 ring-white/20">
                Marketplace MVP
              </p>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.03] tracking-tight md:text-6xl">
                Everything you need, organized like a real marketplace.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50">
                Emarket brings products, sellers, customer accounts, carts, and
                orders into a clean Next.js and Rails commerce experience.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="rounded-md bg-white px-5 py-3 font-bold text-[#0757c7] shadow-[0_12px_30px_rgba(2,8,23,0.22)] hover:-translate-y-0.5 hover:bg-blue-50"
                  href="/products"
                >
                  Browse products
                </Link>
                <Link
                  className="rounded-md border border-white/30 px-5 py-3 font-bold text-white hover:-translate-y-0.5 hover:bg-white/10"
                  href="/seller"
                >
                  Start selling
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-2 text-sm text-blue-50">
                {benefits.map((benefit) => (
                  <span
                    className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15"
                    key={benefit}
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative z-10 rounded-xl bg-white p-4 text-slate-950 shadow-[0_24px_80px_rgba(2,8,23,0.32)] ring-1 ring-blue-100">
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-[#0757c7]">
                      Today&apos;s preview
                    </p>
                    <h2 className="mt-1 text-2xl font-black">Live deals</h2>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    Online
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  {featuredProducts.map((product, index) => (
                    <article
                      className="grid grid-cols-[72px_1fr_auto] items-center gap-3 rounded-lg bg-white p-3 shadow-sm ring-1 ring-blue-100"
                      key={product.name}
                    >
                      <div className="grid aspect-square place-items-center rounded-md bg-gradient-to-br from-blue-100 to-sky-100 text-sm font-black text-[#0757c7]">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="mt-1 text-xs font-semibold text-sky-700">
                          {product.tag}
                        </p>
                      </div>
                      <div className="text-right text-lg font-black">
                        {product.price}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="rounded-xl bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] ring-1 ring-blue-100">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Free shipping", "On selected marketplace deals"],
                ["Installments", "Flexible payment options"],
                ["Buyer support", "Help throughout the order"],
              ].map(([title, description]) => (
                <div
                  className="rounded-lg bg-[#f7fbff] p-4 ring-1 ring-blue-100"
                  key={title}
                >
                  <h2 className="font-black text-[#0757c7]">{title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-sky-700">
                Explore
              </p>
              <h2 className="mt-1 text-2xl font-black">Shop by category</h2>
            </div>
            <Link className="text-sm font-bold text-[#0757c7]" href="/products">
              See all
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                className="group rounded-xl bg-white p-5 shadow-sm ring-1 ring-blue-100 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(7,87,199,0.14)]"
                href="/products"
                key={category.name}
              >
                <div className="mb-5 h-2 w-16 rounded-full bg-gradient-to-r from-[#0757c7] to-sky-400" />
                <h3 className="text-lg font-black">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {category.meta}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-sky-700">
                Selected
              </p>
              <h2 className="mt-1 text-2xl font-black">Featured products</h2>
            </div>
            <Link className="text-sm font-bold text-[#0757c7]" href="/products">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <article
                className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-blue-100"
                key={product.name}
              >
                <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-blue-100 via-sky-50 to-white p-6 text-center text-xl font-black text-[#0757c7]">
                  {product.name}
                </div>
                <div className="p-5">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-sky-700">
                    {product.tag}
                  </span>
                  <h3 className="mt-3 font-bold">{product.name}</h3>
                  <div className="mt-3 text-2xl font-black">
                    {product.price}
                  </div>
                  <Link
                    className="mt-4 inline-flex rounded-md bg-[#0757c7] px-4 py-2 text-sm font-bold text-white hover:bg-[#063f98]"
                    href="/products"
                  >
                    View deal {index + 1}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
