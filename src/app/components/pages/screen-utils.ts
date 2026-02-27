/**
 * Helper routines used by multiple screen components.
 */

/**
 * Extract a named property from a PV800 property list array ("Key: Value").
 */
export function getProperty(propertyList: string[] | null | undefined, key: string): string | undefined {
  if (!propertyList) {
    return undefined;
  }

  const target = propertyList.find(item => item.startsWith(`${key}:`));
  return target?.slice(key.length + 1).trim();
}

/**
 * Parse an integer from a string, returning the fallback on failure.
 */
export function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

/**
 * Convert a PV800 decimal color value into an RGB CSS string.
 */
export function parseColor(value: string | undefined): string {
  const parsed = Number.parseInt(value ?? '0', 10);
  const normalized = Math.max(0, Math.min(parsed, 0xffffff));

  const blue = (normalized >> 16) & 0xff;
  const green = (normalized >> 8) & 0xff;
  const red = normalized & 0xff;

  return `rgb(${red}, ${green}, ${blue})`;
}

