"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Product } from "@/lib/demo-data";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-bold uppercase tracking-[.18em] text-[#d96b36]">
      {children}
    </p>
  );
}

export function PageHero({
  eyebrow,
  title,
  copy,
  actions,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="border-b border-[#e1e5e8] bg-white py-16 sm:py-20">
      <div className="site-container">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="max-w-5xl text-4xl font-semibold tracking-[-.045em] sm:text-6xl">
          {title}
        </h1>
        {copy && (
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#626a73]">
            {copy}
          </p>
        )}
        {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const cta =
    product.eligibility === "configure"
      ? "Configure vehicle"
      : product.eligibility === "customize"
        ? "Customize"
        : product.eligibility === "quote"
          ? "Request quote"
          : product.eligibility === "soon"
            ? "Preview concept"
            : product.eligibility === "unavailable"
              ? "View details"
              : "Shop product";
  const href =
    product.eligibility === "configure"
      ? "/configure/vehicle"
      : product.eligibility === "customize"
        ? "/custom-signs/design"
        : product.eligibility === "quote"
          ? "/quote/request"
          : `/products/${product.slug}`;
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-[#e1e5e8] bg-white">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#e9ebec]"
      >
        <img
          src={product.image}
          alt=""
          className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <Badge className="absolute left-3 top-3 rounded-full bg-white/95 text-[#1d2329] hover:bg-white">
          {product.tag}
        </Badge>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[.1em] text-[#626a73]">
          {product.type}
        </p>
        <h3 className="mt-2 text-lg font-semibold tracking-[-.025em]">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#626a73]">
          {product.description}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <strong className="text-base">
            {product.price
              ? `$${product.price.toFixed(2)}`
              : product.eligibility === "soon"
                ? "Coming soon"
                : "Request quote"}
          </strong>
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-bold text-[#b95025]"
          >
            {cta}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Verified" ||
    status === "Approved" ||
    status === "Paid (demo)" ||
    status === "Ready"
      ? "border-[#cde8d8] bg-[#edf8f1] text-[#24764c]"
      : status === "Not Compatible" || status.includes("Failed")
        ? "border-[#efcccc] bg-[#fff0f0] text-[#b83f43]"
        : status === "Needs Confirmation" ||
            status.includes("Pending") ||
            status === "Under Review" ||
            status === "Awaiting Review"
          ? "border-[#ead8ab] bg-[#fff8e9] text-[#a46a13]"
          : "border-[#dde1e4] bg-[#f1f3f4] text-[#56606a]";
  return (
    <Badge variant="outline" className={`rounded-full ${cls}`}>
      {status}
    </Badge>
  );
}

export function EmptyState({
  title,
  copy,
  href = "/shop",
  label = "Shop products",
}: {
  title: string;
  copy: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#cbd0d4] bg-white px-6 py-16 text-center">
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="mx-auto mt-3 max-w-lg text-[#626a73]">{copy}</p>
      <Button
        asChild
        className="mt-6 rounded-full bg-[#d96b36] hover:bg-[#b95025]"
      >
        <Link href={href}>{label}</Link>
      </Button>
    </div>
  );
}
