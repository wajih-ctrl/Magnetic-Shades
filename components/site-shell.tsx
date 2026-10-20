"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HelpCircle,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Brand } from "@/components/brand";
import { useDemo } from "@/components/store/demo-provider";

const nav = [
  ["Shop All", "/shop"],
  ["Vehicle Shades", "/collections/vehicle-shades"],
  ["Magnetic Signs", "/collections/magnetic-signs"],
  ["Accessories", "/products/surface-prep-kit"],
  ["How It Works", "/installation-care"],
];

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const {
    state,
    cartCount,
    cartSubtotal,
    cartOpen,
    setCartOpen,
    updateCartQty,
    removeCart,
  } = useDemo();
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#f8f8f6] text-[#1d2329]">
      <a
        href="#main"
        className="fixed -top-20 left-4 z-[100] rounded-lg bg-white px-4 py-2 focus:top-4"
      >
        Skip to content
      </a>
      <div className="bg-[#101419] py-2 text-xs text-[#cbd0d4]">
        <div className="site-container flex justify-between gap-4">
          <span>Interactive commerce prototype</span>
          <span>All pricing and fitments are demo data</span>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-[#e1e5e8]/90 bg-[#f8f8f6]/95 backdrop-blur-xl">
        <div className="site-container flex h-[74px] items-center gap-5">
          <Brand />
          <nav
            className="mr-auto hidden items-center gap-5 xl:flex"
            aria-label="Main navigation"
          >
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-semibold transition-colors hover:text-[#d96b36] ${path === href || path.startsWith(`${href}/`) ? "text-[#d96b36]" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button
              className="hidden rounded-full bg-[#d96b36] hover:bg-[#b95025] lg:inline-flex"
              asChild
            >
              <Link href="/configure/vehicle">Configure your shades</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
            >
              <Search className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden rounded-full sm:inline-flex"
              asChild
            >
              <Link href="/contact" aria-label="Help">
                <HelpCircle className="size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden rounded-full sm:inline-flex"
              asChild
            >
              <Link
                href="/account/quotes"
                aria-label="Customer account and quotes"
              >
                <UserRound className="size-4" />
              </Link>
            </Button>
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative rounded-full"
                  aria-label={`Cart with ${cartCount} items`}
                >
                  <ShoppingBag className="size-4" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#d96b36] text-[10px] text-white">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="flex w-full flex-col sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Your cart</SheetTitle>
                  <SheetDescription>
                    Payable, approved prototype products only.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-4">
                  {state.cart.length ? (
                    state.cart.map((item) => (
                      <article
                        key={item.id}
                        className="grid grid-cols-[72px_1fr] gap-3 border-b py-4"
                      >
                        <img
                          src={item.image}
                          alt=""
                          className="h-20 w-[72px] rounded-lg object-cover"
                        />
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <strong className="text-sm">{item.name}</strong>
                              <p className="mt-1 text-[11px] leading-4 text-[#626a73]">
                                {item.meta}
                              </p>
                            </div>
                            <button
                              aria-label={`Remove ${item.name}`}
                              onClick={() => removeCart(item.id)}
                              className="text-[#b83f43]"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            {item.signConfiguration ? (
                              <span className="rounded-full border px-3 py-1.5 text-xs font-semibold">
                                Approved quantity: {item.qty}
                              </span>
                            ) : (
                              <div className="inline-flex items-center rounded-full border">
                                <button
                                  aria-label={`Decrease ${item.name} quantity`}
                                  className="grid size-8 place-items-center"
                                  onClick={() =>
                                    item.qty === 1
                                      ? removeCart(item.id)
                                      : updateCartQty(item.id, item.qty - 1)
                                  }
                                >
                                  <Minus className="size-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-bold">
                                  {item.qty}
                                </span>
                                <button
                                  aria-label={`Increase ${item.name} quantity`}
                                  className="grid size-8 place-items-center"
                                  onClick={() =>
                                    updateCartQty(item.id, item.qty + 1)
                                  }
                                >
                                  <Plus className="size-3" />
                                </button>
                              </div>
                            )}
                            <strong className="text-sm">
                              {money(item.price * item.qty)}
                            </strong>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="grid min-h-64 place-items-center text-center">
                      <div>
                        <ShoppingBag className="mx-auto size-8 text-[#d96b36]" />
                        <h3 className="mt-4 font-semibold">
                          Your cart is empty
                        </h3>
                        <p className="mt-2 text-sm text-[#626a73]">
                          Add a ready-to-buy accessory or verified
                          configuration.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-t p-4">
                  <div className="mb-4 flex justify-between">
                    <span className="text-sm text-[#626a73]">Subtotal</span>
                    <strong>{money(cartSubtotal)}</strong>
                  </div>
                  <Button
                    className="w-full rounded-full bg-[#d96b36]"
                    disabled={!state.cart.length}
                    asChild={state.cart.length > 0}
                  >
                    <Link href="/cart" onClick={() => setCartOpen(false)}>
                      Review cart
                    </Link>
                  </Button>
                  <Button variant="ghost" className="mt-2 w-full" asChild>
                    <Link href="/shop" onClick={() => setCartOpen(false)}>
                      Continue shopping
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full xl:hidden"
                >
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    <Brand />
                  </SheetTitle>
                  <SheetDescription>
                    Browse the Magnetic Shades prototype.
                  </SheetDescription>
                </SheetHeader>
                <nav className="mt-6 grid gap-1 px-4">
                  {nav.map(([label, href]) => (
                    <Button
                      key={href}
                      variant="ghost"
                      className="justify-start"
                      asChild
                    >
                      <Link href={href}>{label}</Link>
                    </Button>
                  ))}
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/configure/vehicle">Configure your shades</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/contact">Help</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/account/quotes">Account / quotes</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/admin">Admin demo</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {searchOpen && (
          <form
            action="/shop"
            className="site-container flex gap-2 border-t border-[#e1e5e8] py-3"
          >
            <input
              name="q"
              autoFocus
              aria-label="Search products"
              placeholder="Search shades, signs or accessories…"
              className="h-11 flex-1 rounded-xl border border-[#e1e5e8] bg-white px-4 outline-none focus:border-[#d96b36]"
            />
            <Button type="submit" className="bg-[#171c22]">
              Search
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <X className="size-4" />
            </Button>
          </form>
        )}
      </header>
      <main id="main">{children}</main>
      <footer className="bg-[#101419] py-16 text-white">
        <div className="site-container grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Brand inverse />
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#aeb6bc]">
              Premium magnetic automotive accessories, explored through a fully
              simulated customer and operations experience.
            </p>
            <span className="mt-5 inline-block rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-[#aeb6bc]">
              Prototype experience · No live transactions
            </span>
          </div>
          <FooterCol
            title="Shop"
            links={[
              ["Shop all", "/shop"],
              ["Vehicle shades", "/collections/vehicle-shades"],
              ["Magnetic signs", "/collections/magnetic-signs"],
              ["Accessories", "/products/surface-prep-kit"],
            ]}
          />
          <FooterCol
            title="Support"
            links={[
              ["About", "/about"],
              ["Installation & care", "/installation-care"],
              ["FAQ", "/faq"],
              ["Contact", "/contact"],
              ["Order status", "/orders/status"],
            ]}
          />
          <FooterCol
            title="Policies & demo"
            links={[
              ["Shipping & returns", "/policies?section=shipping"],
              ["Privacy policy", "/policies?section=privacy"],
              ["Terms", "/policies?section=terms"],
              ["Demo access", "/demo-access"],
              ["Admin demo", "/admin"],
            ]}
          />
        </div>
        <div className="site-container mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-xs text-[#7f8a92] sm:flex-row">
          <span>© 2026 Magnetic Shades prototype</span>
          <span>
            Sample fitments are illustrative and not physically validated.
          </span>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold">{title}</h3>
      {links.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          className="mb-2 block text-sm text-[#aeb6bc] hover:text-white"
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
