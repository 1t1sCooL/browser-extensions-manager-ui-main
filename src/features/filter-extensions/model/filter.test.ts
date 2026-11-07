import type { Extension } from "../../../entities/extension";
import { DEFAULT_FILTER, FILTER_OPTIONS, emptyFilterMessage, filterExtensions } from "./filter";

const list: Extension[] = [
  { id: "a", name: "A", description: "", logo: "", isActive: true },
  { id: "b", name: "B", description: "", logo: "", isActive: false },
  { id: "c", name: "C", description: "", logo: "", isActive: true },
];

describe("filterExtensions", () => {
  it("returns everything for all", () => {
    expect(filterExtensions(list, "all").map((e) => e.id)).toEqual(["a", "b", "c"]);
  });

  it("returns only active ones", () => {
    expect(filterExtensions(list, "active").map((e) => e.id)).toEqual(["a", "c"]);
  });

  it("returns only inactive ones", () => {
    expect(filterExtensions(list, "inactive").map((e) => e.id)).toEqual(["b"]);
  });

  it("returns a new array", () => {
    expect(filterExtensions(list, "all")).not.toBe(list);
  });
});

describe("filter options", () => {
  it("lists All, Active and Inactive in design order", () => {
    expect(FILTER_OPTIONS.map((o) => o.label)).toEqual(["All", "Active", "Inactive"]);
  });

  it("defaults to all", () => {
    expect(DEFAULT_FILTER).toBe("all");
  });
});

describe("emptyFilterMessage", () => {
  it("describes an empty list per filter", () => {
    expect(emptyFilterMessage("all")).toBe("No extensions left.");
    expect(emptyFilterMessage("active")).toBe("No active extensions.");
    expect(emptyFilterMessage("inactive")).toBe("No inactive extensions.");
  });
});
