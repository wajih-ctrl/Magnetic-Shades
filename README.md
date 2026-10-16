# Magnetic Shades

Magnetic Shades is a presentation-ready automotive eCommerce prototype built with Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui primitives, Three.js and Recharts. It demonstrates store-first shopping, vehicle fitment, an interactive 3D shade configurator, custom magnetic-sign proofing, simulated checkout and connected admin workflows.

## Local development

Requirements: Node.js 22.13 or newer and npm.

```bash
npm ci
npm run dev
```

Use the local URL printed by the development server. All prototype data is browser-local and can be restored from **Admin → Settings → Reset demo data**.

## Validation

```bash
npm run typecheck
npm run lint
npm run build
npm run build:next
```

`npm run build` validates the Sites/Vinext target. `npm run build:next` validates the native Next.js output used by Vercel. GitHub Actions runs type checking, lint and the native Next.js production build on pushes and pull requests.

## Main routes

- `/` — premium storefront and category paths
- `/shop` — search, filters, sorting and active filter chips
- `/collections/vehicle-shades`, `/collections/magnetic-signs`, `/collections/future-products`
- `/products/[slug]` — gallery, variants, quantity, eligibility and related products
- `/configure/vehicle` — Year/Make/Model/Trim selection
- `/configure/vehicle/preview` — interactive Three.js vehicle preview with a labeled SVG fallback
- `/configure/fitment-result` — Verified, Needs Confirmation and Unsupported outcomes
- `/configure/fitment-request` — persisted manual-review request
- `/custom-signs/design` and `/custom-signs/artwork` — sign setup, upload validation and proof actions
- `/cart`, `/checkout`, `/orders/status` — multi-item commerce, simulated payment and order support
- `/quote/request`, `/contact`, `/faq`, `/installation-care`, `/policies`
- `/demo-access` — persistent browser-local role selector
- `/admin` plus products, orders, quotes/artwork, fitments, analytics and settings modules

## Seeded scenarios

- Toyota Corolla 2023 LE + `MS-AE-240` → Verified
- Ford F-150 2022 XLT + `MS-AE-240` → Needs Confirmation
- Honda Civic 2024 Touring + `MS-AE-240` → Unsupported
- Discount code: `DEMO10`
- Order lookup references: `MS-10428` and `MS-10396`
- Checkout supports successful and unsuccessful demo outcomes and never collects card credentials

## Deployment

### GitHub

Create an empty GitHub repository, then connect and push this existing Git history:

```bash
git remote add github https://github.com/OWNER/REPOSITORY.git
git push -u github main
```

If `github` already exists, update it with `git remote set-url github ...`. The included `.github/workflows/ci.yml` validates every push and pull request.

### Vercel

Import the GitHub repository in Vercel and keep the checked-in `vercel.json`. It selects the Next.js framework, installs with `npm ci`, and runs `npm run build:next`. No environment variables are required for this browser-local prototype.

You can also deploy with the Vercel CLI after signing in:

```bash
npx vercel
npx vercel --prod
```

## Prototype boundaries

Fitment records, pricing, inventory, policies, delivery dates, payments, analytics and administration are demonstration data. Uploaded artwork content is validated in the browser but is not persisted; only its filename and proof state are stored. No payment processor, database, carrier, email, production inventory or real authentication service is connected.
