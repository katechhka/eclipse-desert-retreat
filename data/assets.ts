// Next prefixes its own bundles; native image/srcset URLs need the same prefix.
export function assetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return path.replace(/(^|,\s*)\//g, `$1${basePath}/`);
}
