import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ConfigBox, BoxSection } from '../../controls/config-box/config-box';
import { ScreenFile, ScreenConfig, PanelDeviceInfo, RenderDevice } from '../screen-types';
import { getProperty, parseNumber, parseColor } from '../screen-utils';

@Component({
  selector: 'app-list-indicator-screen',
  imports: [ConfigBox],
  templateUrl: './list-indicator-screen.html',
  styleUrl: './list-indicator-screen.css',
})
export class ListIndicatorScreen {
  private readonly http = inject(HttpClient);

  readonly screenBackground = signal('#d8d8d8');
  readonly renderDevices = signal<RenderDevice[]>([]);
  readonly screenLoaded = signal(false);

  readonly boxItems = computed(() =>
    this.renderDevices().sort((first, second) => {
      if (first.top === second.top) {
        return first.left - second.left;
      }

      return first.top - second.top;
    }),
  );

  constructor() {
    this.loadScreenConfig();
  }

  private loadScreenConfig(): void {
    this.http.get<ScreenFile>('assets/project-json/Screens.json').subscribe({
      next: config => {
        const screen = config.Screens.find((item: ScreenConfig) => item.ScreenName === 'ListIndicatorScreen');

        if (!screen) {
          this.screenLoaded.set(true);
          return;
        }

        const backgroundColor = parseColor(getProperty(screen.ScreenPropertyValueList, 'Background Color'));
        this.screenBackground.set(backgroundColor);
        this.renderDevices.set(this.mapScreenToDevices(screen));
        this.screenLoaded.set(true);
      },
      error: () => {
        this.screenLoaded.set(true);
      },
    });
  }

  private mapScreenToDevices(screen: ScreenConfig): RenderDevice[] {
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

    return screen.PanelDevicesInfos
      .filter((item: PanelDeviceInfo) =>
        item.PanelDeviceType === 'MOListIndicator' ||
        item.PanelDeviceType === 'MONumericEntry' ||
        item.PanelDeviceType === 'MOMomentaryPushButton',
      )
      .map((item: PanelDeviceInfo) => {
        const left = parseNumber(getProperty(item.PanelDevicePropertyValueList, 'Left'), 0);
        const top = parseNumber(getProperty(item.PanelDevicePropertyValueList, 'Top'), 0);
        const width = parseNumber(getProperty(item.PanelDevicePropertyValueList, 'Width'), 120);
        const height = parseNumber(getProperty(item.PanelDevicePropertyValueList, 'Height'), 40);
        const backgroundColor = parseColor(getProperty(item.PanelDevicePropertyValueList, 'Background Color'));
        const borderColor = parseColor(getProperty(item.PanelDevicePropertyValueList, 'Border Color'));
        const borderWidth = parseNumber(getProperty(item.PanelDevicePropertyValueList, 'Border Width'), 3);
        const fontSize = parseNumber(getProperty(item.PanelDevicePropertyValueList, 'Font Size'), 14);

        return {
          name: item.PanelDeviceName,
          left,
          top,
          width,
          height,
          backgroundColor,
          borderColor,
          borderWidth,
          fontSize,
          sections: this.buildSections(item, indicatorValueMap),
        };
      });
  }

  private buildSections(item: PanelDeviceInfo, indicatorValueMap: Map<string, string>): BoxSection[] {
    if (item.PanelDeviceType === 'MOListIndicator') {
      const visibleRows = parseNumber(getProperty(item.PanelDevicePropertyValueList, 'Number of Visible Rows'), 5);
      const children = item.PanelDeviceChildren ?? [];

      return children.slice(0, visibleRows).map((child: string[]) => ({
        text: getProperty(child, 'Text') ?? '',
        bgColor: parseColor(getProperty(child, 'Color')),
        color: parseColor(getProperty(child, 'Text Color') ?? '0'),
      }));
    }

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

    const indicatorTag = getProperty(item.PanelDevicePropertyValueList, 'Indicator Tag') ?? '';
    const text = indicatorValueMap.get(indicatorTag) ?? '';

    return [
      {
        text,
        bgColor: parseColor(getProperty(item.PanelDevicePropertyValueList, 'Background Color')),
        color: parseColor(getProperty(item.PanelDevicePropertyValueList, 'Text Color') ?? '16316664'),
      },
    ];
  }

}
