import {
  signConfigurationFingerprint,
  type CartItem,
  type DemoState,
  type Fitment,
} from "./demo-data";
export function findFitment(
  state: Pick<DemoState, "fitments">,
  vehicle: DemoState["vehicle"],
  sku: string,
): Fitment | undefined {
  return state.fitments.find(
    (f) =>
      f.year === vehicle.year &&
      f.make === vehicle.make &&
      f.model === vehicle.model &&
      f.body === vehicle.body &&
      f.trim === vehicle.trim &&
      f.sku === sku,
  );
}
export function cartIssue(
  state: Pick<
    DemoState,
    "products" | "fitments" | "cart" | "quotes" | "artwork"
  >,
  item: CartItem,
): string {
  const product = state.products.find(
    (p) => p.id === item.productId && p.sku === item.sku,
  );
  const isApprovedQuote = !!item.quoteId;
  if (
    !product ||
    product.status !== "Active" ||
    (!isApprovedQuote &&
      !["buy", "configure", "customize"].includes(product.eligibility))
  )
    return "Product is unavailable.";
  if (item.quoteId) {
    const quote = state.quotes.find((entry) => entry.id === item.quoteId);
    const artwork = state.artwork.find(
      (entry) => entry.id === quote?.artworkId,
    );
    if (
      !quote ||
      quote.status !== "Accepted" ||
      !quote.amount ||
      artwork?.status !== "Approved" ||
      artwork.readiness !== "Ready"
    )
      return "This quote needs customer acceptance and approved artwork before checkout.";
  }
  const quantity = state.cart
    .filter((i) => i.productId === item.productId)
    .reduce((n, i) => n + i.qty, 0);
  if (
    !Number.isInteger(item.qty) ||
    item.qty < 1 ||
    quantity > product.inventory
  )
    return "Selected quantity exceeds available inventory.";
  if (item.price <= 0) return "A payable price is required.";
  if (!item.quoteId && product.eligibility === "configure") {
    const config = item.shadeConfiguration;
    if (!config)
      return "Reconfigure this saved shade item to confirm its fitment.";
    const fitment = findFitment(state, config.vehicle, item.sku);
    if (
      !fitment ||
      fitment.status !== "Verified" ||
      !config.zones.length ||
      !config.zones.every((z) => fitment.zones.includes(z))
    )
      return "This shade configuration needs fitment review.";
  }
  if (!item.quoteId && product.eligibility === "customize") {
    const config = item.signConfiguration;
    if (
      !config ||
      config.proofStatus !== "Approved" ||
      config.customerApproval !== "Approved" ||
      config.approvedFingerprint !== signConfigurationFingerprint(config)
    )
      return "This custom sign needs approval for its exact artwork and configuration.";
  }
  return "";
}
