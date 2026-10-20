"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CarFront,
  Copy,
  DollarSign,
  Eye,
  FileImage,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/page-primitives";
import { useDemo } from "@/components/store/demo-provider";
import type { Fitment, FitmentStatus, Product } from "@/lib/demo-data";

const chartLoader = (
  <div className="grid h-full place-items-center text-xs text-[#737b82]">
    Loading chart…
  </div>
);
const TrendChart = dynamic(
  () =>
    import("@/components/pages/admin-charts").then(
      (module) => module.TrendChart,
    ),
  { ssr: false, loading: () => chartLoader },
);
const FitmentPieChart = dynamic(
  () =>
    import("@/components/pages/admin-charts").then(
      (module) => module.FitmentPieChart,
    ),
  { ssr: false, loading: () => chartLoader },
);

function AdminHeader({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-[#d96b36]">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#626a73]">{copy}</p>
      </div>
      {action}
    </div>
  );
}
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-[#e1e5e8] bg-white ${className}`}
    >
      {children}
    </section>
  );
}
function CardHead({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#e1e5e8] px-5 py-4">
      <h2 className="font-semibold">{title}</h2>
      {action}
    </div>
  );
}
function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-auto">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        {children}
      </table>
    </div>
  );
}
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-[#e1e5e8] bg-[#fafafa] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[.1em] text-[#626a73]">
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="border-b border-[#e1e5e8] px-4 py-3.5 align-middle">
      {children}
    </td>
  );
}

export function AdminDashboard() {
  const { state } = useDemo();
  const pendingFitments =
    state.fitmentRequests.length +
    state.fitments.filter((f) => f.status === "Needs Confirmation").length;
  const metrics: [string, string | number, LucideIcon, string, string][] = [
    [
      "Orders",
      state.orders.length,
      Package,
      "Paid and reviewable",
      "/admin/orders",
    ],
    [
      "Demo revenue",
      `$${state.orders.reduce((a, o) => a + o.total, 0).toFixed(0)}`,
      DollarSign,
      "Sample paid orders",
      "/admin/analytics",
    ],
    [
      "Pending quotes",
      state.quotes.filter((q) =>
        ["Submitted", "Under Review"].includes(q.status),
      ).length,
      FileImage,
      "Require review",
      "/admin/quotes-artwork",
    ],
    [
      "Fitment requests",
      pendingFitments,
      CarFront,
      "Manual attention",
      "/admin/fitments",
    ],
    [
      "Artwork pending",
      state.artwork.filter((a) => a.status !== "Approved").length,
      Eye,
      "Proof workflow",
      "/admin/quotes-artwork",
    ],
    [
      "Products attention",
      state.products.filter((p) => p.status === "Draft" || p.inventory === 0)
        .length,
      AlertTriangle,
      "Draft or unavailable",
      "/admin/products",
    ],
  ];
  return (
    <div className="p-5 sm:p-8">
      <AdminHeader
        eyebrow="Operations overview"
        title="Good morning, demo administrator."
        copy="A connected snapshot of customer activity, pending reviews and product attention."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {metrics.map(([label, value, Icon, copy, href]) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border border-[#e1e5e8] bg-white p-4 hover:border-[#d96b36]"
          >
            <Icon className="size-4 text-[#d96b36]" />
            <strong className="mt-4 block text-2xl">{value}</strong>
            <span className="mt-1 block text-xs font-semibold">{label}</span>
            <small className="mt-1 block text-[10px] text-[#737b82]">
              {copy}
            </small>
          </Link>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
        <Card>
          <CardHead
            title="Recent orders"
            action={
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-[#b95025]"
              >
                View all
              </Link>
            }
          />
          <TableWrap>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Total</Th>
                <Th>Payment</Th>
                <Th>Fulfillment</Th>
              </tr>
            </thead>
            <tbody>
              {state.orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <Td>
                    <Link
                      href="/admin/orders"
                      className="font-bold text-[#b95025]"
                    >
                      {order.id}
                    </Link>
                  </Td>
                  <Td>{order.customer}</Td>
                  <Td>${order.total.toFixed(2)}</Td>
                  <Td>
                    <StatusBadge status={order.payment} />
                  </Td>
                  <Td>{order.fulfillment}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>
        <Card>
          <CardHead title="Recent activity" />
          <div className="divide-y">
            {[
              [
                "Fitment",
                "Ford F-150 record needs confirmation",
                "/admin/fitments",
              ],
              [
                "Artwork",
                "Northline proof awaits review",
                "/admin/quotes-artwork",
              ],
              [
                "Inventory",
                "Storage sleeve is out of stock",
                "/admin/products",
              ],
              [
                "Quote",
                `${state.quotes[0]?.id} is ${state.quotes[0]?.status}`,
                "/admin/quotes-artwork",
              ],
            ].map(([title, copy, href]) => (
              <Link
                href={href}
                key={title}
                className="block p-5 text-sm hover:bg-[#fafafa]"
              >
                <strong>{title}</strong>
                <p className="mt-1 text-xs leading-5 text-[#626a73]">{copy}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card>
          <CardHead title="Pending artwork approvals" />
          <div className="divide-y">
            {state.artwork.map((artwork) => (
              <Link
                key={artwork.id}
                href="/admin/quotes-artwork"
                className="flex items-center justify-between gap-3 p-5 hover:bg-[#fafafa]"
              >
                <div>
                  <strong className="text-sm">{artwork.filename}</strong>
                  <p className="mt-1 text-xs text-[#626a73]">
                    {artwork.customer} · Proof v{artwork.proof}
                  </p>
                </div>
                <StatusBadge status={artwork.status} />
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <CardHead title="Fitments requiring attention" />
          <div className="divide-y">
            {state.fitments
              .filter((fitment) => fitment.status !== "Verified")
              .map((fitment) => (
                <Link
                  key={fitment.id}
                  href="/admin/fitments"
                  className="flex items-center justify-between gap-3 p-5 hover:bg-[#fafafa]"
                >
                  <div>
                    <strong className="text-sm">
                      {fitment.year} {fitment.make} {fitment.model}
                    </strong>
                    <p className="mt-1 text-xs text-[#626a73]">
                      {fitment.id} · Rev {fitment.revision}
                    </p>
                  </div>
                  <StatusBadge status={fitment.status} />
                </Link>
              ))}
          </div>
        </Card>
        <Card>
          <CardHead title="Top product summary" />
          <div className="divide-y">
            {state.products.slice(0, 4).map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="flex items-center justify-between gap-3 p-4 hover:bg-[#fafafa]"
              >
                <div>
                  <span className="text-xs text-[#737b82]">0{index + 1}</span>
                  <strong className="ml-3 text-sm">{product.name}</strong>
                </div>
                <span className="text-xs">{product.inventory} stock</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function AdminProducts() {
  const { state, updateProduct, addProduct, duplicateProduct } = useDemo();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("updated");
  const [editing, setEditing] = useState<Product | null>(null);
  const items = useMemo(
    () =>
      state.products
        .filter(
          (product) =>
            (product.name + product.sku)
              .toLowerCase()
              .includes(search.toLowerCase()) &&
            (status === "all" || product.status === status) &&
            (category === "all" || product.category === category),
        )
        .sort((a, b) =>
          sort === "name"
            ? a.name.localeCompare(b.name)
            : sort === "inventory"
              ? a.inventory - b.inventory
              : sort === "price"
                ? a.price - b.price
                : new Date(b.updated).getTime() - new Date(a.updated).getTime(),
        ),
    [state.products, search, status, category, sort],
  );
  const createProduct = () => {
    const suffix = Date.now();
    setEditing({
      id: `p-${suffix}`,
      slug: `new-demo-product-${suffix}`,
      name: "",
      sku: "",
      category: "magnetic-signs",
      type: "Care accessory",
      price: 0,
      inventory: 0,
      status: "Draft",
      tag: "New",
      eligibility: "buy",
      color: "Graphite",
      updated: "Oct 16, 2026",
      description: "",
      image: state.products[0]?.image || "",
      approvedClaims: "",
      variants: [],
      shippingWeight: 0,
      shippingClass: "Standard demo parcel",
      taxCategory: "Demo standard",
    });
  };
  return (
    <div className="p-5 sm:p-8">
      <AdminHeader
        eyebrow="Catalog"
        title="Product management"
        copy="Create, edit, duplicate and publish records. Saved changes update the connected storefront."
        action={
          <Button onClick={createProduct}>
            <Plus />
            Create product
          </Button>
        }
      />
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_180px_180px]">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 size-4 text-[#737b82]" />
          <Input
            className="bg-white pl-10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products or SKU"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="vehicle-shades">Vehicle shades</SelectItem>
            <SelectItem value="magnetic-signs">Signs & accessories</SelectItem>
            <SelectItem value="future-products">Future products</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Recently updated</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="inventory">Inventory</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <TableWrap>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>SKU</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Inventory</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((product) => (
              <tr key={product.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt=""
                      className="h-10 w-12 rounded-md object-cover"
                    />
                    <strong>{product.name}</strong>
                  </div>
                </Td>
                <Td>{product.sku}</Td>
                <Td>{product.category}</Td>
                <Td>{product.price ? `$${product.price}` : "—"}</Td>
                <Td>
                  <span
                    className={
                      product.inventory === 0 ? "font-bold text-[#b83f43]" : ""
                    }
                  >
                    {product.inventory}
                  </span>
                </Td>
                <Td>
                  <StatusBadge status={product.status} />
                </Td>
                <Td>{product.updated}</Td>
                <Td>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditing(product)}
                    >
                      <Pencil />
                      Edit
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Duplicate ${product.name}`}
                      onClick={() => duplicateProduct(product.id)}
                    >
                      <Copy />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`View ${product.name}`}
                      asChild
                    >
                      <Link href={`/products/${product.slug}`}>
                        <Eye />
                      </Link>
                    </Button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>
      {!items.length && (
        <div className="mt-4 rounded-xl border border-dashed bg-white p-8 text-center text-sm text-[#626a73]">
          No products match those admin filters.
        </div>
      )}
      {editing && (
        <ProductDialog
          product={editing}
          isNew={!state.products.some((item) => item.id === editing.id)}
          onClose={() => setEditing(null)}
          onSave={(product) => {
            if (state.products.some((item) => item.id === product.id))
              updateProduct(product.id, product);
            else addProduct(product);
            setEditing(null);
          }}
          existingSkus={state.products
            .filter((product) => product.id !== editing.id)
            .map((product) => product.sku)}
        />
      )}
    </div>
  );
}

function ProductDialog({
  product,
  isNew,
  onClose,
  onSave,
  existingSkus,
}: {
  product: Product;
  isNew: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  existingSkus: string[];
}) {
  const [draft, setDraft] = useState(product);
  const [variants, setVariants] = useState((product.variants || []).join(", "));
  const [error, setError] = useState("");
  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const save = () => {
    if (!draft.name.trim() || !draft.sku.trim() || !draft.slug.trim()) {
      setError("Name, slug and SKU are required.");
      return;
    }
    if (
      existingSkus.some((sku) => sku.toLowerCase() === draft.sku.toLowerCase())
    ) {
      setError("SKU must be unique.");
      return;
    }
    if (draft.price < 0 || draft.inventory < 0) {
      setError("Price and inventory cannot be negative.");
      return;
    }
    onSave({
      ...draft,
      variants: variants
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    });
  };
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isNew ? "Create product" : "Edit product"}</DialogTitle>
          <DialogDescription>
            Changes persist in browser-local state and update the storefront.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField
            label="Product name"
            value={draft.name}
            onChange={(value) => set("name", value)}
          />
          <AdminField
            label="SKU"
            value={draft.sku}
            onChange={(value) => set("sku", value)}
          />
          <AdminField
            label="URL slug"
            value={draft.slug}
            onChange={(value) =>
              set(
                "slug",
                value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, ""),
              )
            }
          />
          <AdminField
            label="Product type"
            value={draft.type}
            onChange={(value) => set("type", value)}
          />
          <div>
            <Label>Category</Label>
            <Select
              value={draft.category}
              onValueChange={(value: Product["category"]) =>
                set("category", value)
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vehicle-shades">Vehicle shades</SelectItem>
                <SelectItem value="magnetic-signs">
                  Signs & accessories
                </SelectItem>
                <SelectItem value="future-products">Future products</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AdminField
            label="Image URL"
            value={draft.image}
            onChange={(value) => set("image", value)}
          />
          <AdminField
            label="Price"
            value={String(draft.price)}
            onChange={(value) => set("price", Number(value))}
          />
          <AdminField
            label="Inventory"
            value={String(draft.inventory)}
            onChange={(value) => set("inventory", Number(value))}
          />
          <AdminField
            label="Shipping weight (kg)"
            value={String(draft.shippingWeight ?? 0)}
            onChange={(value) => set("shippingWeight", Number(value))}
          />
          <AdminField
            label="Shipping class"
            value={draft.shippingClass ?? ""}
            onChange={(value) => set("shippingClass", value)}
          />
          <AdminField
            label="Tax category"
            value={draft.taxCategory ?? ""}
            onChange={(value) => set("taxCategory", value)}
          />
          <AdminField
            label="Variants (comma separated)"
            value={variants}
            onChange={setVariants}
          />
          <div>
            <Label>Status</Label>
            <Select
              value={draft.status}
              onValueChange={(value: "Active" | "Draft") =>
                set("status", value)
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Purchase path</Label>
            <Select
              value={draft.eligibility}
              onValueChange={(value: Product["eligibility"]) =>
                set("eligibility", value)
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "buy",
                  "configure",
                  "customize",
                  "quote",
                  "soon",
                  "unavailable",
                ].map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={draft.description}
              onChange={(event) => set("description", event.target.value)}
              className="mt-2"
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Approved claims</Label>
            <Textarea
              value={draft.approvedClaims}
              onChange={(event) => set("approvedClaims", event.target.value)}
              className="mt-2"
            />
          </div>
        </div>
        {error && <p className="text-sm text-[#b83f43]">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function AdminField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2"
      />
    </div>
  );
}

export function AdminOrders() {
  const { state, updateOrder } = useDemo();
  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState("all");
  const [fulfillment, setFulfillment] = useState("all");
  const [selected, setSelected] = useState<
    (typeof state.orders)[number] | null
  >(null);
  const items = state.orders.filter(
    (order) =>
      (order.id + order.customer)
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (payment === "all" || order.payment === payment) &&
      (fulfillment === "all" || order.fulfillment === fulfillment),
  );
  return (
    <div className="p-5 sm:p-8">
      <AdminHeader
        eyebrow="Commerce"
        title="Order management"
        copy="Review simulated payment, fulfillment and customer cancellation or refund requests."
      />
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 size-4 text-[#737b82]" />
          <Input
            className="bg-white pl-10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order or customer"
          />
        </div>
        <Select value={payment} onValueChange={setPayment}>
          <SelectTrigger className="bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payment states</SelectItem>
            <SelectItem value="Paid (demo)">Paid (demo)</SelectItem>
            <SelectItem value="Failed (demo)">Failed (demo)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={fulfillment} onValueChange={setFulfillment}>
          <SelectTrigger className="bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fulfillment states</SelectItem>
            {[
              "Received",
              "Preparing",
              "Packed",
              "Demo shipped",
              "Completed",
            ].map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card>
        <TableWrap>
          <thead>
            <tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Date</Th>
              <Th>Total</Th>
              <Th>Payment</Th>
              <Th>Fulfillment</Th>
              <Th>Customer request</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((order) => (
              <tr key={order.id}>
                <Td>
                  <strong>{order.id}</strong>
                </Td>
                <Td>{order.customer}</Td>
                <Td>{order.date}</Td>
                <Td>${order.total.toFixed(2)}</Td>
                <Td>
                  <StatusBadge status={order.payment} />
                </Td>
                <Td>{order.fulfillment}</Td>
                <Td>{order.request}</Td>
                <Td>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelected(order)}
                  >
                    View
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>
      {selected && (
        <Dialog open onOpenChange={(open) => !open && setSelected(null)}>
          <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selected.id} · {selected.customer}
              </DialogTitle>
              <DialogDescription>
                {selected.email} · {selected.delivery}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Fulfillment status</Label>
                <Select
                  value={selected.fulfillment}
                  onValueChange={(value) => {
                    updateOrder(selected.id, { fulfillment: value });
                    setSelected({
                      ...selected,
                      fulfillment: value,
                      timeline: [...selected.timeline, value],
                    });
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Received",
                      "Preparing",
                      "Packed",
                      "Demo shipped",
                      "Completed",
                    ].map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Request review</Label>
                <Select
                  value={selected.request}
                  onValueChange={(value) => {
                    updateOrder(selected.id, { request: value });
                    setSelected({ ...selected, request: value });
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "None",
                      "Cancellation requested",
                      "Cancellation approved",
                      "Refund requested",
                      "Refund approved",
                      "Declined",
                    ].map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-xl bg-[#f4f5f5] p-4">
              <h3 className="font-semibold">Purchased items and variations</h3>
              <div className="mt-3 divide-y">
                {selected.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between gap-4 py-3 text-sm"
                  >
                    <span>
                      {item.qty} × {item.name}
                      <small className="block text-[#626a73]">
                        {item.meta}
                      </small>
                    </span>
                    <strong>${(item.price * item.qty).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t pt-3">
                <span>Order total</span>
                <strong>${selected.total.toFixed(2)}</strong>
              </div>
            </div>
            <div className="rounded-xl bg-[#f4f5f5] p-4">
              <h3 className="font-semibold">Timeline</h3>
              <div className="mt-3 space-y-2">
                {selected.timeline.map((item, index) => (
                  <p
                    key={`${item}-${index}`}
                    className="text-sm text-[#626a73]"
                  >
                    {index + 1}. {item}
                  </p>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelected(null)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export function AdminQuotesArtwork() {
  const { state, updateQuote, updateArtwork } = useDemo();
  const [selectedQuote, setSelectedQuote] = useState<
    (typeof state.quotes)[number] | null
  >(null);
  const [selectedArtwork, setSelectedArtwork] = useState<
    (typeof state.artwork)[number] | null
  >(null);
  return (
    <div className="p-5 sm:p-8">
      <AdminHeader
        eyebrow="Creative operations"
        title="Quotes & artwork"
        copy="Quote, proof approval and production readiness remain separate review states."
      />
      <Tabs defaultValue="quotes">
        <TabsList className="flex-wrap">
          <TabsTrigger value="quotes">Quote requests</TabsTrigger>
          <TabsTrigger value="artwork">Artwork submissions</TabsTrigger>
          <TabsTrigger value="proofs">Proof reviews</TabsTrigger>
          <TabsTrigger value="readiness">Production readiness</TabsTrigger>
        </TabsList>
        <TabsContent value="quotes" className="mt-4">
          <Card>
            <TableWrap>
              <thead>
                <tr>
                  <Th>Reference</Th>
                  <Th>Customer</Th>
                  <Th>Product</Th>
                  <Th>Configuration</Th>
                  <Th>Qty</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {state.quotes.map((quote) => (
                  <tr key={quote.id}>
                    <Td>
                      <strong>{quote.id}</strong>
                    </Td>
                    <Td>{quote.customer}</Td>
                    <Td>{quote.product}</Td>
                    <Td>{quote.config}</Td>
                    <Td>{quote.qty}</Td>
                    <Td>
                      {quote.amount ? `$${quote.amount.toFixed(2)}` : "Pending"}
                    </Td>
                    <Td>
                      <StatusBadge status={quote.status} />
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Select
                          value={quote.status}
                          onValueChange={(status) =>
                            updateQuote(quote.id, status)
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Submitted",
                              "Under Review",
                              "Revision Required",
                              "Quoted",
                              "Accepted",
                              "Declined",
                            ].map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedQuote(quote)}
                        >
                          Open
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </Card>
        </TabsContent>
        <TabsContent value="artwork" className="mt-4">
          <Card>
            <TableWrap>
              <thead>
                <tr>
                  <Th>Artwork</Th>
                  <Th>Customer</Th>
                  <Th>Product</Th>
                  <Th>Filename</Th>
                  <Th>Proof</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {state.artwork.map((artwork) => (
                  <tr key={artwork.id}>
                    <Td>
                      <strong>{artwork.id}</strong>
                    </Td>
                    <Td>{artwork.customer}</Td>
                    <Td>{artwork.product}</Td>
                    <Td>{artwork.filename}</Td>
                    <Td>v{artwork.proof}</Td>
                    <Td>
                      <StatusBadge status={artwork.status} />
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedArtwork(artwork)}
                      >
                        Review
                      </Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </Card>
        </TabsContent>
        <TabsContent value="proofs" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {state.artwork.map((artwork) => (
              <Card key={artwork.id} className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#626a73]">
                      {artwork.id} · Proof v{artwork.proof}
                    </p>
                    <h2 className="mt-1 font-semibold">{artwork.customer}</h2>
                    <p className="mt-1 text-sm text-[#626a73]">
                      {artwork.filename}
                    </p>
                  </div>
                  <StatusBadge status={artwork.status} />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateArtwork(artwork.id, "Proof Prepared")}
                  >
                    Create next proof
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateArtwork(artwork.id, "Revision Requested")
                    }
                  >
                    Request revision
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#24764c]"
                    onClick={() => updateArtwork(artwork.id, "Approved")}
                  >
                    Mark approved
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="readiness" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {state.artwork.map((artwork) => (
              <Card key={artwork.id} className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#626a73]">{artwork.id}</p>
                    <h2 className="mt-1 font-semibold">{artwork.product}</h2>
                  </div>
                  <StatusBadge status={artwork.readiness} />
                </div>
                <p className="mt-4 text-sm leading-6 text-[#626a73]">
                  {artwork.status === "Approved"
                    ? "Proof approval allows this record to be marked ready for a later, separately confirmed production step."
                    : "Production readiness remains blocked until the proof is approved."}
                </p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      {selectedQuote && (
        <QuoteDialog
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onSave={(amount, status) => {
            updateQuote(selectedQuote.id, { amount, status });
            setSelectedQuote(null);
          }}
        />
      )}
      {selectedArtwork && (
        <Dialog open onOpenChange={(open) => !open && setSelectedArtwork(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedArtwork.id} · {selectedArtwork.customer}
              </DialogTitle>
              <DialogDescription>
                {selectedArtwork.product} · {selectedArtwork.filename}
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-xl bg-[#f4f5f5] p-5">
              <p className="text-sm">
                Proof version <strong>{selectedArtwork.proof}</strong>
              </p>
              <div className="mt-2">
                <StatusBadge status={selectedArtwork.status} />
              </div>
              <p className="mt-3 text-sm text-[#626a73]">
                Production readiness: {selectedArtwork.readiness}
              </p>
            </div>
            <div>
              <Label>Proof action</Label>
              <Select
                value={selectedArtwork.status}
                onValueChange={(status) => {
                  updateArtwork(selectedArtwork.id, status);
                  setSelectedArtwork({
                    ...selectedArtwork,
                    status,
                    readiness: status === "Approved" ? "Ready" : "Blocked",
                    proof:
                      status === "Proof Prepared"
                        ? selectedArtwork.proof + 1
                        : selectedArtwork.proof,
                  });
                }}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Awaiting Review",
                    "Proof Prepared",
                    "Revision Requested",
                    "Approved",
                  ].map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedArtwork(null)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function QuoteDialog({
  quote,
  onClose,
  onSave,
}: {
  quote: {
    id: string;
    customer: string;
    product: string;
    qty: number;
    config: string;
    status: string;
    amount: number | null;
  };
  onClose: () => void;
  onSave: (amount: number | null, status: string) => void;
}) {
  const [amount, setAmount] = useState(
    quote.amount ? String(quote.amount) : "",
  );
  const [status, setStatus] = useState(quote.status);
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {quote.id} · {quote.customer}
          </DialogTitle>
          <DialogDescription>
            {quote.product} · {quote.config} · Quantity {quote.qty}
          </DialogDescription>
        </DialogHeader>
        <AdminField
          label="Demo quote amount"
          value={amount}
          onChange={setAmount}
        />
        <div>
          <Label>Quote status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                "Submitted",
                "Under Review",
                "Revision Required",
                "Quoted",
                "Accepted",
                "Declined",
              ].map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(amount ? Number(amount) : null, status)}
          >
            Save quote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AdminFitments() {
  const { state, updateFitment, addFitment } = useDemo();
  const [search, setSearch] = useState("");
  const [make, setMake] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Fitment | null>(null);
  const [isNew, setIsNew] = useState(false);
  const items = state.fitments.filter(
    (fitment) =>
      `${fitment.year} ${fitment.make} ${fitment.model} ${fitment.trim} ${fitment.sku}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (make === "all" || fitment.make === make) &&
      (status === "all" || fitment.status === status),
  );
  const create = () => {
    const id = `FIT-${Date.now().toString().slice(-5)}`;
    setIsNew(true);
    setSelected({
      id,
      year: "2026",
      make: "",
      model: "",
      trim: "",
      body: "",
      market: "US Demo",
      sku: "MS-AE-240",
      zones: [],
      status: "Needs Confirmation",
      tested: "Oct 16, 2026",
      revision: 1,
      geometry: `GEO-${id}`,
      notes: "Manual review required.",
      exclusions: "Pending review",
      history: [],
    });
  };
  return (
    <div className="p-5 sm:p-8">
      <AdminHeader
        eyebrow="Compatibility control"
        title="Vehicle fitment management"
        copy="Create and revise controlled compatibility records. Every saved edit retains a versioned change note."
        action={
          <Button variant="outline" onClick={create}>
            <Plus />
            New fitment record
          </Button>
        }
      />
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_200px_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 size-4 text-[#737b82]" />
          <Input
            className="bg-white pl-10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search vehicle, SKU or trim"
          />
        </div>
        <Select value={make} onValueChange={setMake}>
          <SelectTrigger className="bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All makes</SelectItem>
            {Array.from(
              new Set(state.fitments.map((fitment) => fitment.make)),
            ).map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All approval states</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Needs Confirmation">
              Needs Confirmation
            </SelectItem>
            <SelectItem value="Not Compatible">Not Compatible</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <TableWrap>
          <thead>
            <tr>
              <Th>Vehicle</Th>
              <Th>Body / market</Th>
              <Th>SKU</Th>
              <Th>Supported zones</Th>
              <Th>Status</Th>
              <Th>Test date</Th>
              <Th>Revision</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((fitment) => (
              <tr key={fitment.id}>
                <Td>
                  <strong>
                    {fitment.year} {fitment.make} {fitment.model}
                  </strong>
                  <small className="block text-[#626a73]">{fitment.trim}</small>
                </Td>
                <Td>
                  {fitment.body}
                  <small className="block text-[#626a73]">
                    {fitment.market}
                  </small>
                </Td>
                <Td>{fitment.sku}</Td>
                <Td>
                  <span className="line-clamp-2 max-w-52">
                    {fitment.zones.join(", ") || "None"}
                  </span>
                </Td>
                <Td>
                  <StatusBadge status={fitment.status} />
                </Td>
                <Td>{fitment.tested}</Td>
                <Td>Rev {fitment.revision}</Td>
                <Td>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsNew(false);
                      setSelected(fitment);
                    }}
                  >
                    Open
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>
      {state.fitmentRequests.length > 0 && (
        <Card className="mt-5">
          <CardHead title="Customer fitment requests" />
          <div className="divide-y">
            {state.fitmentRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <strong className="text-sm">
                    {request.id} · {request.customer}
                  </strong>
                  <p className="mt-1 text-xs text-[#626a73]">
                    {request.vehicle}
                  </p>
                  <p className="mt-1 text-xs text-[#626a73]">
                    {request.sku} · {request.coverage} · {request.appearance}
                  </p>
                  <p className="mt-1 text-xs text-[#626a73]">
                    {request.email}
                    {request.phone && ` · ${request.phone}`}
                    {request.notes && ` · ${request.notes}`}
                  </p>
                </div>
                <StatusBadge status={request.status} />
              </div>
            ))}
          </div>
        </Card>
      )}
      {selected && (
        <FitmentDialog
          fitment={selected}
          isNew={isNew}
          onClose={() => setSelected(null)}
          onSave={(draft, note) => {
            if (isNew)
              addFitment({
                ...draft,
                history: [
                  {
                    revision: 1,
                    date: "Oct 16, 2026",
                    note,
                    status: draft.status,
                    zones: draft.zones,
                  },
                ],
              });
            else updateFitment(draft.id, draft, note);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

const coverageZones = [
  "Driver front",
  "Driver rear",
  "Passenger front",
  "Passenger rear",
  "Windshield",
];
function FitmentDialog({
  fitment,
  isNew,
  onClose,
  onSave,
}: {
  fitment: Fitment;
  isNew: boolean;
  onClose: () => void;
  onSave: (fitment: Fitment, note: string) => void;
}) {
  const [draft, setDraft] = useState(structuredClone(fitment));
  const [note, setNote] = useState(
    isNew
      ? "Initial mock fitment record."
      : "Updated coverage or validation details.",
  );
  const [error, setError] = useState("");
  const set = <K extends keyof Fitment>(key: K, value: Fitment[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const toggleZone = (zone: string) =>
    set(
      "zones",
      draft.zones.includes(zone)
        ? draft.zones.filter((item) => item !== zone)
        : [...draft.zones, zone],
    );
  const save = () => {
    if (
      !draft.year ||
      !draft.make ||
      !draft.model ||
      !draft.trim ||
      !draft.body ||
      !draft.sku
    ) {
      setError("Year, make, model, trim, body style and SKU are required.");
      return;
    }
    if (!note.trim()) {
      setError("Add a revision note describing the change.");
      return;
    }
    onSave(draft, note);
  };
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isNew
              ? "Create fitment record"
              : `${draft.year} ${draft.make} ${draft.model} ${draft.trim}`}
          </DialogTitle>
          <DialogDescription>
            {draft.id} · Geometry/model revision {draft.geometry}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField
            label="Year"
            value={draft.year}
            onChange={(value) => set("year", value)}
          />
          <AdminField
            label="Make"
            value={draft.make}
            onChange={(value) => set("make", value)}
          />
          <AdminField
            label="Model"
            value={draft.model}
            onChange={(value) => set("model", value)}
          />
          <AdminField
            label="Trim"
            value={draft.trim}
            onChange={(value) => set("trim", value)}
          />
          <AdminField
            label="Body style"
            value={draft.body}
            onChange={(value) => set("body", value)}
          />
          <AdminField
            label="Market"
            value={draft.market}
            onChange={(value) => set("market", value)}
          />
          <AdminField
            label="Product SKU"
            value={draft.sku}
            onChange={(value) => set("sku", value)}
          />
          <AdminField
            label="Geometry/model revision"
            value={draft.geometry}
            onChange={(value) => set("geometry", value)}
          />
          <AdminField
            label="Last test date"
            value={draft.tested}
            onChange={(value) => set("tested", value)}
          />
          <div>
            <Label>Validation status</Label>
            <Select
              value={draft.status}
              onValueChange={(value: FitmentStatus) => set("status", value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Needs Confirmation">
                  Needs Confirmation
                </SelectItem>
                <SelectItem value="Not Compatible">Not Compatible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-medium">
              Supported coverage zones
            </legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {coverageZones.map((zone) => (
                <label
                  key={zone}
                  className="flex items-center gap-3 rounded-xl border p-3 text-sm"
                >
                  <Checkbox
                    checked={draft.zones.includes(zone)}
                    onCheckedChange={() => toggleZone(zone)}
                  />
                  {zone}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="sm:col-span-2">
            <Label>Installation notes</Label>
            <Textarea
              value={draft.notes}
              onChange={(event) => set("notes", event.target.value)}
              className="mt-2"
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Exclusions</Label>
            <Textarea
              value={draft.exclusions}
              onChange={(event) => set("exclusions", event.target.value)}
              className="mt-2"
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Revision note</Label>
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-2"
            />
          </div>
        </div>
        {!isNew && (
          <div>
            <h3 className="font-semibold">Revision history</h3>
            <div className="mt-3 border-l-2 border-[#d96b36] pl-5">
              {fitment.history
                .slice()
                .reverse()
                .map((history) => (
                  <div key={history.revision} className="pb-5">
                    <strong className="text-sm">
                      Revision {history.revision}
                    </strong>
                    <span className="ml-2 text-xs text-[#626a73]">
                      {history.date}
                    </span>
                    <p className="mt-1 text-sm text-[#626a73]">
                      {history.note}
                    </p>
                    {history.zones && (
                      <small className="mt-1 block text-[#737b82]">
                        {history.status} ·{" "}
                        {history.zones.join(", ") || "No zones"}
                      </small>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
        {error && <p className="text-sm text-[#b83f43]">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>
            {isNew ? "Create record" : "Save revision"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AdminAnalytics() {
  const { state } = useDemo();
  const [range, setRange] = useState("6 months");
  const [segment, setSegment] = useState("all");
  const local = state.events.length;
  const metrics = [
    [
      "Product views",
      12842 +
        state.events.filter((event) => event.startsWith("product_view")).length,
    ],
    [
      "Configurator starts",
      1638 +
        state.events.filter((event) => event.includes("configurator")).length,
    ],
    ["Fitment requests", 212 + state.fitmentRequests.length],
    [
      "Add-to-cart",
      894 + state.events.filter((event) => event.includes("cart")).length,
    ],
    [
      "Checkout starts",
      461 + state.events.filter((event) => event === "checkout_start").length,
    ],
    ["Purchases", 327 + state.orders.length - 2],
    ["Quote submissions", 146 + state.quotes.length - 2],
  ];
  const fitmentData = [
    { name: "Verified", value: 58, color: "#24764c" },
    { name: "Needs confirmation", value: 27, color: "#d6952d" },
    { name: "Not compatible", value: 15, color: "#b83f43" },
  ];
  return (
    <div className="p-5 sm:p-8">
      <AdminHeader
        eyebrow="Sample analytics"
        title="Interest, intent and conversion"
        copy={`Seeded historical activity plus ${local} local demo events. These are not live production metrics.`}
        action={
          <div className="flex flex-wrap gap-2">
            <Select value={segment} onValueChange={setSegment}>
              <SelectTrigger className="w-48 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All products</SelectItem>
                <SelectItem value="vehicle-shades">Vehicle shades</SelectItem>
                <SelectItem value="magnetic-signs">
                  Signs & accessories
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-44 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30 days">Last 30 days</SelectItem>
                <SelectItem value="6 months">Last 6 months</SelectItem>
                <SelectItem value="12 months">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
        {metrics.map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-[#e1e5e8] bg-white p-4"
          >
            <span className="text-xs text-[#626a73]">{label}</span>
            <strong className="mt-2 block text-2xl">
              {Number(value).toLocaleString()}
            </strong>
            <small className="text-[10px] text-[#24764c]">Demo activity</small>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
        <Card>
          <CardHead
            title={`Interest and workflow trend · ${range} · ${segment.replaceAll("-", " ")}`}
          />
          <div className="h-[330px] p-4">
            <TrendChart />
          </div>
        </Card>
        <Card>
          <CardHead title="Fitment state distribution" />
          <div className="h-[330px] p-5">
            <FitmentPieChart data={fitmentData} />
          </div>
        </Card>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Card>
          <CardHead title="Conversion funnel" />
          <div className="space-y-3 p-6">
            {[
              ["Product views", "12,842", "100%"],
              ["Configurator starts", "1,638", "72%"],
              ["Add to cart", "894", "51%"],
              ["Successful purchases", "327", "28%"],
            ].map(([label, value, width]) => (
              <div
                key={label}
                className="rounded-lg bg-[#171c22] p-3 text-white"
                style={{ width }}
              >
                <span className="text-xs">{label}</span>
                <strong className="float-right text-xs">{value}</strong>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHead title="Top viewed products" />
          <div className="divide-y">
            {state.products
              .filter(
                (product) => segment === "all" || product.category === segment,
              )
              .slice(0, 5)
              .map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#737b82]">0{index + 1}</span>
                    <strong className="text-sm">{product.name}</strong>
                  </div>
                  <span className="text-sm">
                    {(2840 - index * 317).toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function AdminSettings() {
  const { resetDemo, state } = useDemo();
  const [done, setDone] = useState(false);
  return (
    <div className="p-5 sm:p-8">
      <AdminHeader
        eyebrow="Prototype controls"
        title="Demo settings"
        copy="Inspect local data counts or restore the original seeded scenario."
      />
      <Card className="max-w-3xl p-6">
        <h2 className="text-xl font-semibold">Reset browser-local demo data</h2>
        <p className="mt-3 text-sm leading-6 text-[#626a73]">
          This restores seeded products, orders, fitments, quotes, artwork, cart
          and analytics. Raw files are never stored by this prototype.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Products", state.products.length],
            ["Orders", state.orders.length],
            ["Quotes", state.quotes.length],
            ["Local events", state.events.length],
          ].map(([l, v]) => (
            <div key={String(l)} className="rounded-xl bg-[#f3f4f4] p-4">
              <strong className="text-xl">{v}</strong>
              <span className="mt-1 block text-xs text-[#626a73]">{l}</span>
            </div>
          ))}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="mt-6">
              <RotateCcw />
              Reset demo data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restore the seeded demo?</DialogTitle>
              <DialogDescription>
                Your browser-local changes to cart, products, fitments, orders
                and requests will be replaced by the original sample records.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="destructive"
                  onClick={() => {
                    resetDemo();
                    setDone(true);
                  }}
                >
                  Reset demo
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {done && (
          <p className="mt-4 text-sm font-semibold text-[#24764c]">
            Demo data restored.
          </p>
        )}
      </Card>
    </div>
  );
}
