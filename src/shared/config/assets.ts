export const assetUrl = (path: string, base: string = import.meta.env.BASE_URL): string =>
  `${base.endsWith("/") ? base : `${base}/`}${path.replace(/^\.?\/+/, "")}`;
