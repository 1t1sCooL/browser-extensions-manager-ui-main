import { findExtension, removeExtension, setExtensionActive, toExtension } from "./extensions";
import type { Extension } from "./types";

const make = (name: string, isActive = true): Extension => ({
  id: name.toLowerCase(),
  name,
  description: `${name} description`,
  logo: `/images/${name}.svg`,
  isActive,
});

describe("toExtension", () => {
  it("maps a data.json record to an extension with an id and a base-prefixed logo", () => {
    const extension = toExtension(
      {
        logo: "./assets/images/logo-devlens.svg",
        name: "Markup Notes",
        description: "Notes",
        isActive: false,
      },
      "/Sub/",
    );

    expect(extension).toEqual({
      id: "markup-notes",
      name: "Markup Notes",
      description: "Notes",
      logo: "/Sub/images/logo-devlens.svg",
      isActive: false,
    });
  });

  it("keeps logo paths that are not under assets/", () => {
    expect(toExtension({ logo: "images/a.svg", name: "A", description: "", isActive: true }, "/").logo).toBe(
      "/images/a.svg",
    );
  });
});

describe("setExtensionActive", () => {
  const list = [make("A"), make("B", false)];

  it("updates only the matching extension", () => {
    const next = setExtensionActive(list, "b", true);

    expect(next.map((e) => e.isActive)).toEqual([true, true]);
    expect(next[0]).toBe(list[0]);
  });

  it("does not mutate the input", () => {
    setExtensionActive(list, "a", false);

    expect(list[0].isActive).toBe(true);
  });

  it("keeps the same object when the state does not change", () => {
    expect(setExtensionActive(list, "a", true)[0]).toBe(list[0]);
  });

  it("ignores unknown ids", () => {
    expect(setExtensionActive(list, "zzz", false)).toEqual(list);
  });
});

describe("removeExtension", () => {
  it("drops the matching extension and keeps order", () => {
    const list = [make("A"), make("B"), make("C")];

    expect(removeExtension(list, "b").map((e) => e.id)).toEqual(["a", "c"]);
    expect(list).toHaveLength(3);
  });

  it("returns an equal list for unknown ids", () => {
    const list = [make("A")];

    expect(removeExtension(list, "x")).toEqual(list);
  });
});

describe("findExtension", () => {
  it("finds by id or returns undefined", () => {
    const list = [make("A")];

    expect(findExtension(list, "a")?.name).toBe("A");
    expect(findExtension(list, "b")).toBeUndefined();
  });
});
