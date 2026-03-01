import { ScreenConfig, PanelDeviceInfo, RenderDevice, DeviceLayout } from './screen-types';
import { getProperty, parseNumber, parseColor, getDeviceLayout } from './screen-utils';

/**
 * Build a map of indicator read tags to displayed values for MOListIndicator devices.
 */
function buildIndicatorValueMap(screen: ScreenConfig): Map<string, string> {
  const indicatorValueMap = new Map<string, string>();

  for (const item of screen.PanelDevicesInfos) {
    if (item.PanelDeviceType !== 'MOListIndicator') {
      continue;
    }

    const readTag = getProperty(item.PanelDevicePropertyValueList, 'Read Tag');
    const currentState = Number.parseInt(getProperty(item.PanelDevicePropertyValueList, 'Current Displayed State') ?? '1', 10);
    const activeChild = item.PanelDeviceChildren?.[Math.max(currentState - 1, 0)] ?? item.PanelDeviceChildren?.[0] ?? [];
    const activeValue = getProperty(activeChild, 'Value') ?? getProperty(activeChild, 'Text') ?? '';

    if (readTag) {
      indicatorValueMap.set(readTag, activeValue);
    }
  }

  return indicatorValueMap;
}

export function mapScreenToDevices(screen: ScreenConfig): RenderDevice[] {
  const indicatorValueMap = buildIndicatorValueMap(screen);

  return screen.PanelDevicesInfos
    .filter((item: PanelDeviceInfo) =>
      // include control types we currently render in the engine
      item.PanelDeviceType === 'MOListIndicator' ||
      item.PanelDeviceType === 'MONumericEntry' ||
      item.PanelDeviceType === 'MOMomentaryPushButton' ||
      item.PanelDeviceType === 'MOGotoScreen' ||
      item.PanelDeviceType === 'MOGotoConfig'
    )
    .map((item: PanelDeviceInfo) => {
      const layout: DeviceLayout = getDeviceLayout(item.PanelDevicePropertyValueList);

      return {
        name: item.PanelDeviceName,
        type: item.PanelDeviceType,
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
        backgroundColor: layout.backgroundColor,
        borderColor: layout.borderColor,
        borderWidth: layout.borderWidth,
        fontSize: layout.fontSize,
        sections: buildSections(item, indicatorValueMap),
      } as RenderDevice;
    });
}

export function buildSections(item: PanelDeviceInfo, indicatorValueMap: Map<string, string>): { text: string; bgColor: string; color: string }[] {
  // List indicator: render visible rows from children
  if (item.PanelDeviceType === 'MOListIndicator') {
    const visibleRows = parseNumber(getProperty(item.PanelDevicePropertyValueList, 'Number of Visible Rows'), 5);
    const children = item.PanelDeviceChildren ?? [];

    return children.slice(0, visibleRows).map((child: string[]) => ({
      text: getProperty(child, 'Text') ?? '',
      bgColor: parseColor(getProperty(child, 'Color')),
      color: parseColor(getProperty(child, 'Text Color') ?? '0'),
    }));
  }

  // Momentary push button: use first child as button face
  if (item.PanelDeviceType === 'MOMomentaryPushButton') {
    const firstChild = item.PanelDeviceChildren?.[0] ?? [];

    return [
      {
        text: getProperty(firstChild, 'Text') ?? '',
        bgColor: parseColor(getProperty(firstChild, 'Color') ?? getProperty(item.PanelDevicePropertyValueList, 'Border Color')),
        color: parseColor(getProperty(firstChild, 'Text Color') ?? '16316664'),
      },
    ];
  }

  // Goto and generic numeric/indicator items: try to resolve indicator value, else use Text property
  const indicatorTag = getProperty(item.PanelDevicePropertyValueList, 'Indicator Tag') ?? '';
  const indicatorText = indicatorValueMap.get(indicatorTag) ?? '';
  if (indicatorText) {
    return [
      {
        text: indicatorText,
        bgColor: parseColor(getProperty(item.PanelDevicePropertyValueList, 'Background Color')),
        color: parseColor(getProperty(item.PanelDevicePropertyValueList, 'Text Color') ?? '16316664'),
      },
    ];
  }

  // Default: use Text property or first child Text
  const firstChild = item.PanelDeviceChildren?.[0] ?? [];
  const text = getProperty(firstChild, 'Text') ?? getProperty(item.PanelDevicePropertyValueList, 'Text') ?? '';

  return [
    {
      text,
      bgColor: parseColor(getProperty(item.PanelDevicePropertyValueList, 'Background Color')),
      color: parseColor(getProperty(item.PanelDevicePropertyValueList, 'Text Color') ?? '16316664'),
    },
  ];
}