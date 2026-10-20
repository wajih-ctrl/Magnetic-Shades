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
assert.notDeepEqual(
  vehicleProfile({ model: "Corolla", body: "Sedan" }),
  vehicleProfile({ model: "Civic", body: "Sedan" }),
);
assert.notEqual(
  vehicleProfile({ model: "F-150", body: "SuperCab" }).roofRear,
  vehicleProfile({ model: "F-150", body: "Crew Cab" }).roofRear,
);
console.log(
  "PASS: six seeded SKU/vehicle scenarios; catalog matching; invalid coverage, changed fitment, draft and aggregate stock checkout gates; distinct model and cab profiles.",
);
