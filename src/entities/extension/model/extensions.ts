import { assetUrl } from "../../../shared/config/assets";
import { slugify } from "../../../shared/lib/slugify";
import type { Extension, ExtensionRecord } from "./types";

const ASSET_PREFIX = /^\.?\/?assets\//;

export const toExtension = (record: ExtensionRecord, base?: string): Extension => ({
  id: slugify(record.name),
  name: record.name,
  description: record.description,
  logo: assetUrl(record.logo.replace(ASSET_PREFIX, ""), base),
  isActive: record.isActive,
});

export const setExtensionActive = (
  extensions: readonly Extension[],
  id: string,
  isActive: boolean,
): Extension[] =>
  extensions.map((extension) =>
    extension.id === id && extension.isActive !== isActive ? { ...extension, isActive } : extension,
  );

export const removeExtension = (extensions: readonly Extension[], id: string): Extension[] =>
  extensions.filter((extension) => extension.id !== id);

export const findExtension = (extensions: readonly Extension[], id: string): Extension | undefined =>
  extensions.find((extension) => extension.id === id);
