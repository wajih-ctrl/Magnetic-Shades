# Magnetic Shades

A presentation-ready automotive eCommerce prototype built with Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui primitives, Lucide icons and Recharts.

## Run locally

1. Install dependencies with `npm install`.
2. Start the development server with `npm run dev`.
3. Open the local URL printed by the server.

## Main demonstration routes

- `/` — premium storefront
- `/shop` — searchable, filterable product collection
- `/configure/vehicle` — vehicle selection
- `/configure/vehicle/preview` — interactive 2D vehicle configurator fallback
- `/configure/fitment-result` — Verified, Needs Confirmation and Unsupported states
- `/custom-signs/design` — magnetic sign studio
- `/custom-signs/artwork` — artwork upload and proof review
- `/cart`, `/checkout`, `/orders/status` — commerce and customer support flows
- `/admin` — admin overview
- `/admin/products`, `/admin/orders`, `/admin/quotes-artwork`, `/admin/fitments`, `/admin/analytics` — management modules

## Seeded workflows

- Toyota Corolla 2023 LE → Verified demo shade fitment
- Ford F-150 2022 XLT → Needs Confirmation
- Honda Civic 2024 Touring → Unsupported
- Use discount code `DEMO10` in the cart
- Checkout can simulate successful or unsuccessful payment without collecting card details
- Order references `MS-10428` and `MS-10396` are available in Order Status

## Admin demo and reset

Open `/login` and choose Administrator, or go directly to `/admin`. Use `/admin/settings` to restore seeded products, fitments, orders, quotes, artwork, cart and analytics.

## Vehicle preview

The configurator uses an original interactive SVG-based 2D vehicle fallback. It supports rotation, zoom, reset, predefined views and live shade coverage overlays. Every preview is labeled illustrative.

## Simulated functionality

All authentication, product data, vehicle fitments, cart persistence, payments, quotes, artwork proofs, fulfillment, analytics and administration are browser-local demonstrations. No backend, production database, real payment, carrier, email, inventory, AI or commerce integration is connected. Uploaded artwork content is not persisted; only a demo filename is kept locally.

## Known limitations

- Vehicle fitment records are fabricated demo states and are not physically validated.
- Product photos are remote editorial imagery; the 2D vehicle is an original SVG illustration.
- Refresh persistence depends on browser localStorage.
- The prototype does not upload files or send external notifications.
