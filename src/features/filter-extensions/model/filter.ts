import type { Extension } from "../../../entities/extension";

export type ExtensionFilter = "all" | "active" | "inactive";

export interface FilterOption {
  value: ExtensionFilter;
  label: string;
}

export const FILTER_OPTIONS: readonly FilterOption[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const DEFAULT_FILTER: ExtensionFilter = "all";

const PREDICATES: Record<ExtensionFilter, (extension: Extension) => boolean> = {
  all: () => true,
  active: (extension) => extension.isActive,
  inactive: (extension) => !extension.isActive,
};

export const filterExtensions = (
  extensions: readonly Extension[],
  filter: ExtensionFilter,
): Extension[] => extensions.filter(PREDICATES[filter]);

export const emptyFilterMessage = (filter: ExtensionFilter): string =>
  filter === "all" ? "No extensions left." : `No ${filter} extensions.`;
