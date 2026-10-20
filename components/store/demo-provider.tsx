"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  initialState,
  signConfigurationFingerprint,
  type CartItem,
  type DemoState,
  type Product,
} from "@/lib/demo-data";

import { cartIssue } from "@/lib/fitment";
import { artworkStore } from "@/lib/artwork-storage";

const STORAGE_KEY = "magnetic-shades-demo-v10";

type DemoContextValue = {
  state: DemoState;
  ready: boolean;
  artworkPreview: string;
  setArtworkPreview: (url: string) => void;
  cartCount: number;
  cartSubtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  currentFitment: DemoState["fitments"][number];
  setVehicle: (patch: Partial<DemoState["vehicle"]>) => void;
  setShade: (patch: Partial<DemoState["shade"]>) => void;
  setSign: (patch: Partial<DemoState["sign"]>) => void;
  approveSignProof: () => void;
  addToCart: (product: Product, meta?: string, price?: number) => void;
  addShadeToCart: () => void;
  updateCartQty: (id: string, qty: number) => void;
  removeCart: (id: string) => void;
  applyDiscount: (code: string) => boolean;
  removeDiscount: () => void;
  addSignToCart: () => void;
  editSignCartItem: (id: string) => void;
  createOrder: (
    customer: string,
    email: string,
    delivery: string,
    shippingAddress: string,
  ) => string;
  updateOrder: (
    id: string,
    patch: Partial<DemoState["orders"][number]>,
  ) => void;
  submitFitmentRequest: (
    customer: string,
    email: string,
    phone: string,
    notes: string,
    vehicle?: DemoState["vehicle"],
  ) => string;
  submitQuote: (details: {
    customer: string;
    email: string;
    company: string;
    notes: string;
    requestedTiming: string;
  }) => string;
  respondToQuote: (id: string, response: "Accepted" | "Declined") => void;
  addQuoteToCart: (id: string) => boolean;
  submitSupport: (name: string, category: string) => string;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  duplicateProduct: (id: string) => void;
  updateFitment: (
    id: string,
    patch: Partial<DemoState["fitments"][number]>,
    note?: string,
  ) => void;
  addFitment: (fitment: DemoState["fitments"][number]) => void;
  updateQuote: (
    id: string,
    patch: string | Partial<DemoState["quotes"][number]>,
  ) => void;
  updateArtwork: (id: string, status: string) => void;
  setDemoRole: (role: string) => void;
  recordEvent: (event: string) => void;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const [artworkPreview, setArtworkPreview] = useState("");
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let restored: DemoState | null = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as DemoState;
        if (parsed.version === 10) restored = parsed;
      }
    } catch {
      /* fall back to seeded demo data */
    }
    queueMicrotask(() => {
      if (restored) setState(restored);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* Keep the active session usable when browser storage is full. */
      }
    }
  }, [state, ready]);

  useEffect(() => {
    let active = true;
    if (state.sign.artworkKey)
      artworkStore(state.sign.artworkKey)
        .then((url) => {
          if (active) setArtworkPreview(url);
        })
        .catch(() => {
          if (active) setArtworkPreview("");
        });
    return () => {
      active = false;
    };
  }, [state.sign.artworkKey]);

  const setVehicle = useCallback(
    (patch: Partial<DemoState["vehicle"]>) =>
      setState((s) => ({ ...s, vehicle: { ...s.vehicle, ...patch } })),
    [],
  );
  const setShade = useCallback(
    (patch: Partial<DemoState["shade"]>) =>
      setState((s) => ({ ...s, shade: { ...s.shade, ...patch } })),
    [],
  );
  const setSign = useCallback(
    (patch: Partial<DemoState["sign"]>) =>
      setState((s) => {
        const approvalFields: (keyof DemoState["sign"])[] = [
          "artworkKey",
          "filename",
          "size",
          "material",
          "qty",
          "color",
          "productType",
          "alignment",
        ];
        const approvalChanged = approvalFields.some(
          (key) => key in patch && patch[key] !== s.sign[key],
        );
        const next = { ...s.sign, ...patch };
        if (approvalChanged) {
          next.approvedFingerprint = "";
          next.customerApproval = "Not approved";
          next.businessReviewStatus = "Not submitted";
          next.printReadiness = next.resolutionWarning
            ? "Review required"
            : "Not checked";
          next.proofVersion = 0;
          if (!("proofStatus" in patch))
            next.proofStatus = next.filename
              ? "Artwork Uploaded"
              : "Awaiting Artwork";
        }
        return { ...s, sign: next };
      }),
    [],
  );

  const approveSignProof = useCallback(
    () =>
      setState((s) => ({
        ...s,
        sign: {
          ...s.sign,
          proofStatus: "Approved",
          customerApproval: "Approved",
          approvedFingerprint: signConfigurationFingerprint(s.sign),
          businessReviewStatus: "Pending artwork review",
          printReadiness: s.sign.resolutionWarning
            ? "Review required"
            : "Pending preflight",
        },
      })),
    [],
  );

  const currentFitment = useMemo(() => {
    const exact = state.fitments.find(
      (f) =>
        f.year === state.vehicle.year &&
        f.make === state.vehicle.make &&
        f.model === state.vehicle.model &&
        f.body === state.vehicle.body &&
        f.trim === state.vehicle.trim &&
        f.sku === state.shade.productSku,
    );
    if (exact) return exact;
    const template =
      state.fitments.find((f) => f.status === "Needs Confirmation") ??
      state.fitments[0];
    const zones =
      state.shade.productSku === "MS-CP-118"
        ? ["Driver front", "Passenger front"]
        : ["Driver front", "Driver rear", "Passenger front", "Passenger rear"];
    return {
      ...template,
      id: "",
      year: state.vehicle.year,
      make: state.vehicle.make,
      model: state.vehicle.model,
      body: state.vehicle.body,
      trim: state.vehicle.trim,
      sku: state.shade.productSku,
      zones,
      status: "Needs Confirmation" as const,
      revision: 0,
      geometry: "",
      notes:
        "Compatibility has not yet been verified for this vehicle and shade.",
      exclusions: "Purchase remains unavailable until fitment is confirmed.",
    };
  }, [state.fitments, state.vehicle, state.shade.productSku]);
  const cartCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = state.cart.reduce(
    (sum, item) => sum + item.qty * item.price,
    0,
  );

  const addToCart = useCallback(
    (product: Product, meta = "Standard selection", price = product.price) => {
      if (product.eligibility !== "buy" || product.inventory < 1 || price <= 0)
        return;
      setState((s) => {
        const existing = s.cart.find(
          (i) => i.productId === product.id && i.meta === meta,
        );
        const cart = existing
          ? s.cart.map((i) =>
              i.id === existing.id ? { ...i, qty: i.qty + 1 } : i,
            )
          : [
              ...s.cart,
              {
                id: `line-${Date.now()}`,
                productId: product.id,
                name: product.name,
                sku: product.sku,
                qty: 1,
                price,
                meta,
                image: product.image,
              },
            ];
        return { ...s, cart, events: [...s.events, "add_to_cart"] };
      });
      setCartOpen(true);
    },
    [],
  );

  const addShadeToCart = useCallback(
    () =>
      setState((s) => {
        const p = s.products.find(
          (product) => product.sku === s.shade.productSku,
        );
        const fitment = s.fitments.find(
          (f) =>
            f.year === s.vehicle.year &&
            f.make === s.vehicle.make &&
            f.model === s.vehicle.model &&
            f.body === s.vehicle.body &&
            f.trim === s.vehicle.trim &&
            f.sku === s.shade.productSku,
        );
        if (
          !p ||
          !fitment ||
          fitment.status !== "Verified" ||
          p.status !== "Active" ||
          p.eligibility !== "configure" ||
          p.inventory < 1 ||
          p.price <= 0 ||
          !s.shade.zones.length ||
          !s.shade.zones.every((zone) => fitment.zones.includes(zone))
        )
          return s;
        const meta = `${s.vehicle.year} ${s.vehicle.make} ${s.vehicle.model} ${s.vehicle.body} ${s.vehicle.trim} · ${s.shade.zones.join(", ")} · ${s.shade.mesh} · ${s.shade.edge} edge · Verified · ${fitment.id}`;
        const item: CartItem = {
          id: `shade-${Date.now()}`,
          productId: p.id,
          name: p.name,
          sku: p.sku,
          qty: 1,
          price: p.price,
          meta,
          image: p.image,
          shadeConfiguration: {
            vehicle: { ...s.vehicle },
            zones: [...s.shade.zones],
            mesh: s.shade.mesh,
            edge: s.shade.edge,
          },
        };
        return {
          ...s,
          cart: [...s.cart, item],
          events: [...s.events, "fitment_add_to_cart"],
        };
      }),
    [],
  );

  const addSignToCart = useCallback(() => {
    setState((s) => {
      const p = s.products.find(
        (product) => product.slug === "fleetmark-door-pair",
      );
      const approvalMatches =
        s.sign.approvedFingerprint === signConfigurationFingerprint(s.sign);
      if (
        !p ||
        p.status !== "Active" ||
        p.inventory < s.sign.qty ||
        s.sign.productType === "Studio Magnetic Panel" ||
        s.sign.proofStatus !== "Approved" ||
        s.sign.customerApproval !== "Approved" ||
        !approvalMatches ||
        s.sign.size === "24 × 36 in"
      )
        return s;
      const unit = s.sign.size === "12 × 18 in" ? 74 : 126;
      const item: CartItem = {
        id: s.editingSignCartItemId || `sign-${Date.now()}`,
        productId: p.id,
        name: `${p.name} — ${s.sign.filename}`,
        sku: p.sku,
        qty: s.sign.qty,
        price: unit,
        meta: `${s.sign.size} · ${s.sign.material} · ${s.sign.alignment} · Customer proof v${s.sign.proofVersion} approved · Business preflight pending`,
        image: artworkPreview || p.image,
        signConfiguration: { ...s.sign },
      };
      const cart = s.editingSignCartItemId
        ? s.cart.map((existing) =>
            existing.id === s.editingSignCartItemId ? item : existing,
          )
        : [...s.cart, item];
      return {
        ...s,
        editingSignCartItemId: "",
        cart,
        events: [
          ...s.events,
          s.editingSignCartItemId
            ? "approved_sign_cart_update"
            : "approved_sign_add_to_cart",
        ],
      };
    });
    setCartOpen(true);
  }, [artworkPreview]);

  const editSignCartItem = useCallback(
    (id: string) =>
      setState((s) => {
        const item = s.cart.find(
          (candidate) => candidate.id === id && candidate.signConfiguration,
        );
        return item?.signConfiguration
          ? {
              ...s,
              sign: { ...item.signConfiguration },
              editingSignCartItemId: id,
            }
          : s;
      }),
    [],
  );

  const updateCartQty = useCallback(
    (id: string, qty: number) =>
      setState((s) => ({
        ...s,
        cart: s.cart.map((i) =>
          i.id === id && !i.signConfiguration
            ? { ...i, qty: Math.max(1, qty) }
            : i,
        ),
      })),
    [],
  );
  const removeCart = useCallback(
    (id: string) =>
      setState((s) => ({
        ...s,
        cart: s.cart.filter((i) => i.id !== id),
        editingSignCartItemId:
          s.editingSignCartItemId === id ? "" : s.editingSignCartItemId,
      })),
    [],
  );
  const applyDiscount = useCallback((code: string) => {
    const valid = code.trim().toUpperCase() === "DEMO10";
    if (valid) setState((s) => ({ ...s, discount: "DEMO10" }));
    return valid;
  }, []);
  const removeDiscount = useCallback(
    () => setState((s) => ({ ...s, discount: "" })),
    [],
  );

  const createOrder = useCallback(
    (
      customer: string,
      email: string,
      delivery: string,
      shippingAddress: string,
    ) => {
      if (
        !state.cart.length ||
        state.cart.some((item) => cartIssue(state, item))
      )
        return "";
      const id = `MS-${10500 + Math.floor(Math.random() * 400)}`;
      setState((s) => {
        const subtotal = s.cart.reduce((a, i) => a + i.price * i.qty, 0);
        const discount = s.discount ? subtotal * 0.1 : 0;
        const shipping = delivery.startsWith("Express") ? 32 : 18;
        const total = Number(
          ((subtotal - discount + shipping) * 1.07).toFixed(2),
        );
        return {
          ...s,
          lastOrderId: id,
          cart: [],
          discount: "",
          orders: [
            {
              id,
              customer,
              email,
              shippingAddress,
              date: "Oct 20, 2026",
              total,
              payment: "Paid (demo)",
              fulfillment: "Received",
              request: "None",
              delivery,
              items: s.cart.map((i) => ({
                name: i.name,
                qty: i.qty,
                price: i.price,
                meta: i.meta,
                image: i.image,
                signConfiguration: i.signConfiguration
                  ? { ...i.signConfiguration }
                  : undefined,
                shadeConfiguration: i.shadeConfiguration
                  ? structuredClone(i.shadeConfiguration)
                  : undefined,
              })),
              timeline: ["Order created", "Demo payment approved", "Received"],
            },
            ...s.orders,
          ],
          events: [...s.events, "purchase"],
        };
      });
      return id;
    },
    [state],
  );
  const updateOrder = useCallback(
    (id: string, patch: Partial<DemoState["orders"][number]>) =>
      setState((s) => ({
        ...s,
        orders: s.orders.map((o) =>
          o.id === id
            ? {
                ...o,
                ...patch,
                timeline: patch.fulfillment
                  ? [...o.timeline, patch.fulfillment]
                  : o.timeline,
              }
            : o,
        ),
      })),
    [],
  );
  const submitFitmentRequest = useCallback(
    (
      customer: string,
      email: string,
      phone: string,
      notes: string,
      vehicle?: DemoState["vehicle"],
    ) => {
      const id = `FR-${300 + Math.floor(Math.random() * 600)}`;
      setState((s) => ({
        ...s,
        fitmentRequests: [
          {
            id,
            customer,
            email,
            phone,
            notes,
            vehicle: `${(vehicle ?? s.vehicle).year} ${(vehicle ?? s.vehicle).make} ${(vehicle ?? s.vehicle).model} · ${(vehicle ?? s.vehicle).body} · ${(vehicle ?? s.vehicle).trim}`,
            sku: s.shade.productSku,
            coverage: s.shade.zones.join(", ") || "No coverage selected",
            appearance: `${s.shade.mesh} · ${s.shade.edge} edge`,
            status: "Pending Review",
          },
          ...s.fitmentRequests,
        ],
        events: [...s.events, "fitment_request"],
      }));
      return id;
    },
    [],
  );
  const submitQuote = useCallback(
    (details: {
      customer: string;
      email: string;
      company: string;
      notes: string;
      requestedTiming: string;
    }) => {
      const id = `QT-${2100 + Math.floor(Math.random() * 500)}`;
      const artworkId = `ART-${700 + Math.floor(Math.random() * 200)}`;
      setState((s) => ({
        ...s,
        quotes: [
          {
            id,
            customer: details.customer,
            email: details.email,
            company: details.company,
            notes: details.notes,
            requestedTiming: details.requestedTiming,
            product: s.sign.productType,
            productSku:
              s.sign.productType === "Studio Magnetic Panel"
                ? "MS-SP-2436"
                : "MS-FM-1824",
            qty: s.sign.qty,
            config: `${s.sign.size} · ${s.sign.material} · ${s.sign.alignment}`,
            size: s.sign.size,
            material: s.sign.material,
            artworkId,
            artworkKey: s.sign.artworkKey,
            filename: s.sign.filename,
            date: "Oct 20, 2026",
            status: "Submitted",
            amount: null,
          },
          ...s.quotes,
        ],
        artwork: [
          {
            id: artworkId,
            customer: details.customer,
            product: s.sign.productType,
            filename: s.sign.filename || "No artwork supplied",
            proof: Math.max(1, s.sign.proofVersion),
            status: "Awaiting Review",
            readiness: "Blocked",
            artworkKey: s.sign.artworkKey,
            quoteId: id,
            config: `${s.sign.size} · ${s.sign.material} · ${s.sign.alignment}`,
          },
          ...s.artwork,
        ],
        events: [...s.events, "quote_submit"],
      }));
      return id;
    },
    [],
  );
  const respondToQuote = useCallback(
    (id: string, response: "Accepted" | "Declined") =>
      setState((s) => ({
        ...s,
        quotes: s.quotes.map((quote) =>
          quote.id === id && quote.status === "Quoted"
            ? {
                ...quote,
                status: response,
                customerResponseAt: "Oct 20, 2026",
              }
            : quote,
        ),
        events: [...s.events, `quote_${response.toLowerCase()}`],
      })),
    [],
  );
  const addQuoteToCart = useCallback(
    (id: string) => {
      const quote = state.quotes.find((item) => item.id === id);
      const artwork = state.artwork.find(
        (item) => item.id === quote?.artworkId,
      );
      const product = state.products.find(
        (item) => item.sku === quote?.productSku,
      );
      if (
        !quote ||
        !product ||
        quote.status !== "Accepted" ||
        !quote.amount ||
        artwork?.status !== "Approved" ||
        artwork.readiness !== "Ready"
      )
        return false;
      const item: CartItem = {
        id: `quote-${quote.id}`,
        quoteId: quote.id,
        productId: product.id,
        name: `${quote.product} — ${quote.filename || quote.id}`,
        sku: product.sku,
        qty: quote.qty,
        price: quote.amount / quote.qty,
        meta: `${quote.config} · Approved quote ${quote.id} · Artwork ${artwork.id} approved`,
        image: product.image,
      };
      setState((s) => ({
        ...s,
        cart: [...s.cart.filter((entry) => entry.quoteId !== id), item],
        events: [...s.events, "accepted_quote_add_to_cart"],
      }));
      setCartOpen(true);
      return true;
    },
    [state],
  );
  const submitSupport = useCallback((name: string, category: string) => {
    const id = `SUP-${700 + Math.floor(Math.random() * 200)}`;
    setState((s) => ({
      ...s,
      supportRequests: [
        { id, name, category, status: "Open" },
        ...s.supportRequests,
      ],
    }));
    return id;
  }, []);
  const updateProduct = useCallback(
    (id: string, patch: Partial<Product>) =>
      setState((s) => ({
        ...s,
        products: s.products.map((p) =>
          p.id === id ? { ...p, ...patch, updated: "Oct 16, 2026" } : p,
        ),
      })),
    [],
  );
  const addProduct = useCallback(
    (product: Product) =>
      setState((s) => ({ ...s, products: [product, ...s.products] })),
    [],
  );
  const duplicateProduct = useCallback(
    (id: string) =>
      setState((s) => {
        const source = s.products.find((p) => p.id === id);
        if (!source) return s;
        const suffix = Date.now();
        const copy = {
          ...source,
          id: `p-${suffix}`,
          slug: `${source.slug}-copy-${suffix}`,
          name: `${source.name} Copy`,
          sku: `${source.sku}-COPY`,
          status: "Draft" as const,
          updated: "Oct 16, 2026",
        };
        return { ...s, products: [copy, ...s.products] };
      }),
    [],
  );
  const updateFitment = useCallback(
    (
      id: string,
      patch: Partial<DemoState["fitments"][number]>,
      note = "Fitment record updated in admin demo.",
    ) =>
      setState((s) => ({
        ...s,
        fitments: s.fitments.map((f) => {
          if (f.id !== id) return f;
          const nextRevision = f.revision + 1;
          return {
            ...f,
            ...patch,
            revision: nextRevision,
            history: [
              ...f.history,
              {
                revision: nextRevision,
                date: "Oct 16, 2026",
                note,
                status: patch.status ?? f.status,
                zones: patch.zones ?? f.zones,
              },
            ],
          };
        }),
      })),
    [],
  );
  const addFitment = useCallback(
    (fitment: DemoState["fitments"][number]) =>
      setState((s) => ({ ...s, fitments: [fitment, ...s.fitments] })),
    [],
  );
  const updateQuote = useCallback(
    (id: string, patch: string | Partial<DemoState["quotes"][number]>) =>
      setState((s) => ({
        ...s,
        quotes: s.quotes.map((q) =>
          q.id === id
            ? {
                ...q,
                ...(typeof patch === "string" ? { status: patch } : patch),
              }
            : q,
        ),
      })),
    [],
  );
  const updateArtwork = useCallback(
    (id: string, status: string) =>
      setState((s) => ({
        ...s,
        artwork: s.artwork.map((a) =>
          a.id === id
            ? {
                ...a,
                status,
                proof: status === "Proof Prepared" ? a.proof + 1 : a.proof,
                readiness: status === "Approved" ? "Ready" : "Blocked",
              }
            : a,
        ),
      })),
    [],
  );
  const setDemoRole = useCallback(
    (demoRole: string) => setState((s) => ({ ...s, demoRole })),
    [],
  );
  const recordEvent = useCallback(
    (event: string) =>
      setState((s) => ({ ...s, events: [...s.events, event] })),
    [],
  );
  const resetDemo = useCallback(() => {
    setState(initialState());
    setArtworkPreview("");
  }, []);

  const value = {
    state,
    ready,
    artworkPreview,
    setArtworkPreview,
    cartCount,
    cartSubtotal,
    cartOpen,
    setCartOpen,
    currentFitment,
    setVehicle,
    setShade,
    setSign,
    approveSignProof,
    addToCart,
    addShadeToCart,
    addSignToCart,
    editSignCartItem,
    updateCartQty,
    removeCart,
    applyDiscount,
    removeDiscount,
    createOrder,
    updateOrder,
    submitFitmentRequest,
    submitQuote,
    respondToQuote,
    addQuoteToCart,
    submitSupport,
    updateProduct,
    addProduct,
    duplicateProduct,
    updateFitment,
    addFitment,
    updateQuote,
    updateArtwork,
    setDemoRole,
    recordEvent,
    resetDemo,
  };
  if (!ready)
    return (
      <div className="grid min-h-screen place-items-center bg-[#f8f8f6] text-sm font-semibold text-[#626a73]">
        Loading Magnetic Shades…
      </div>
    );
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used inside DemoProvider");
  return value;
}
