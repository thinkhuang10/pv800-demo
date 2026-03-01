import { DeviceLayout } from './screen-types';
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
 * Convert PV800 font size to CSS pixel size for consistent display in Angular
 * 根据实际显示效果调整转换逻辑
 */
export function convertFontSize(pv800FontSize: number): number {
  // 调整转换系数，使字体大小与实际显示效果一致
  // 经过测试，使用0.75的系数可以使字体大小更接近预期
  return pv800FontSize * 0.75;
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

export function getDeviceLayout(propertyList: string[] | null | undefined): DeviceLayout {
  const pv800FontSize = parseNumber(getProperty(propertyList, 'Font Size'), 14);
  return {
    left: parseNumber(getProperty(propertyList, 'Left'), 0),
    top: parseNumber(getProperty(propertyList, 'Top'), 0),
    width: parseNumber(getProperty(propertyList, 'Width'), 120),
    height: parseNumber(getProperty(propertyList, 'Height'), 40),
    backgroundColor: parseColor(getProperty(propertyList, 'Background Color')),
    borderColor: parseColor(getProperty(propertyList, 'Border Color')),
    borderWidth: parseNumber(getProperty(propertyList, 'Border Width'), 3),
    fontSize: convertFontSize(pv800FontSize),
  };
}