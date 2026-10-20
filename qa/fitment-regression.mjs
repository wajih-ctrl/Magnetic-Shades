import assert from "node:assert/strict";
import { initialState, vehicleCatalog } from "../lib/demo-data.ts";
import { findFitment, cartIssue } from "../lib/fitment.ts";
import { vehicleProfile } from "../lib/vehicle-geometry.ts";
const state = initialState();
for (const [vehicle, status] of [
  [
    {
      year: "2023",
      make: "Toyota",
      model: "Corolla",
      body: "Sedan",
      trim: "LE",
    },
    "Verified",
  ],
  [
    {
      year: "2022",
      make: "Ford",
      model: "F-150",
      body: "Crew Cab",
      trim: "XLT",
    },
    "Needs Confirmation",
  ],
  [
    {
      year: "2024",
      make: "Honda",
      model: "Civic",
      body: "Sedan",
      trim: "Touring",
    },
    "Not Compatible",
  ],
]) {
  for (const sku of ["MS-AE-240", "MS-CP-118"])
    assert.equal(findFitment(state, vehicle, sku)?.status, status);
}
const item = {
  id: "test",
  productId: "p1",
  sku: "MS-AE-240",
  name: "Shade",
  qty: 1,
  price: 289,
  meta: "",
  image: "",
  shadeConfiguration: {
    vehicle: state.vehicle,
    zones: ["Driver front", "Passenger front"],
    mesh: "Privacy mesh",
    edge: "Sand",
  },
};
state.cart = [item];
assert.equal(cartIssue(state, item), "");
state.fitments[0].status = "Needs Confirmation";
assert.match(cartIssue(state, item), /fitment review/);
state.fitments[0].status = "Verified";
item.shadeConfiguration.zones = ["Invalid zone"];
assert.match(cartIssue(state, item), /fitment review/);
item.shadeConfiguration.zones = ["Driver front"];
state.products[0].inventory = 0;
assert.match(cartIssue(state, item), /inventory/);
state.products[0].inventory = 1;
state.cart = [item, { ...item, id: "other" }];
assert.match(cartIssue(state, item), /inventory/);
state.cart = [item];
state.products[0].status = "Draft";
assert.match(cartIssue(state, item), /unavailable/);
for (const f of initialState().fitments)
  assert.ok(
    vehicleCatalog.some(
      (v) =>
        v.year === f.year &&
        v.make === f.make &&
        v.model === f.model &&
        v.body === f.body &&
        v.trims.includes(f.trim),
    ),
  );
const catalogState = initialState();
for (const vehicle of vehicleCatalog)
  for (const trim of vehicle.trims)
    for (const sku of ["MS-AE-240", "MS-CP-118"])
      assert.ok(
        findFitment(
          catalogState,
          {
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            body: vehicle.body,
            trim,
          },
          sku,
        ),
        `Missing ${sku} scenario for ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.body} ${trim}`,
      );
assert.deepEqual(
  new Set(catalogState.fitments.map((fitment) => fitment.status)),
  new Set(["Verified", "Needs Confirmation", "Not Compatible"]),
);
assert.notDeepEqual(
  vehicleProfile({ model: "Corolla", body: "Sedan" }),
  vehicleProfile({ model: "Civic", body: "Sedan" }),
);
assert.notEqual(
  vehicleProfile({ model: "F-150", body: "SuperCab" }).roofRear,
  vehicleProfile({ model: "F-150", body: "Crew Cab" }).roofRear,
);
const quoteState = initialState();
const acceptedQuote = quoteState.quotes.find((quote) => quote.id === "QT-2074");
assert.ok(acceptedQuote);
acceptedQuote.status = "Accepted";
const quoteCartItem = {
  id: "quote-QT-2074",
  quoteId: "QT-2074",
  productId: "p3",
  sku: "MS-FM-1824",
  name: "Fleetmark Door Pair — beacon-coffee.png",
  qty: 2,
  price: 132,
  meta: "Approved quote",
  image: "",
};
quoteState.cart = [quoteCartItem];
assert.equal(cartIssue(quoteState, quoteCartItem), "");
quoteState.artwork.find((artwork) => artwork.id === "ART-638").status =
  "Revision Requested";
assert.match(cartIssue(quoteState, quoteCartItem), /approved artwork/i);
console.log(
  "PASS: catalog fitments, checkout gates, approved quote checkout, and vehicle geometry regression checks.",
);
