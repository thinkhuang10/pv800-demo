import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ConfigBox, BoxSection } from '../../components/config-box/config-box';

interface ScreenFile {
  Screens: ScreenConfig[];
}

interface ScreenConfig {
  ScreenName: string;
  ScreenPropertyValueList: string[];
  PanelDevicesInfos: PanelDeviceInfo[];
}

interface PanelDeviceInfo {
  PanelDeviceName: string;
  PanelDeviceType: string;
  PanelDevicePropertyValueList: string[];
  PanelDeviceChildren: string[][] | null;
}

interface RenderDevice {
  name: string;
  left: number;
  top: number;
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  fontSize: number;
  sections: BoxSection[];
}

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
        const screen = config.Screens.find(item => item.ScreenName === 'ListIndicatorScreen');

        if (!screen) {
          this.screenLoaded.set(true);
          return;
        }

        const backgroundColor = this.parseColor(this.getProperty(screen.ScreenPropertyValueList, 'Background Color'));
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

      const readTag = this.getProperty(item.PanelDevicePropertyValueList, 'Read Tag');
      const currentState = Number.parseInt(this.getProperty(item.PanelDevicePropertyValueList, 'Current Displayed State') ?? '1', 10);
      const activeChild = item.PanelDeviceChildren?.[Math.max(currentState - 1, 0)] ?? item.PanelDeviceChildren?.[0] ?? [];
      const activeValue = this.getProperty(activeChild, 'Value') ?? this.getProperty(activeChild, 'Text') ?? '';

      if (readTag) {
        indicatorValueMap.set(readTag, activeValue);
      }
    }

    return screen.PanelDevicesInfos
      .filter(item =>
        item.PanelDeviceType === 'MOListIndicator' ||
        item.PanelDeviceType === 'MONumericEntry' ||
        item.PanelDeviceType === 'MOMomentaryPushButton',
      )
      .map(item => {
        const left = this.parseNumber(this.getProperty(item.PanelDevicePropertyValueList, 'Left'), 0);
        const top = this.parseNumber(this.getProperty(item.PanelDevicePropertyValueList, 'Top'), 0);
        const width = this.parseNumber(this.getProperty(item.PanelDevicePropertyValueList, 'Width'), 120);
        const height = this.parseNumber(this.getProperty(item.PanelDevicePropertyValueList, 'Height'), 40);
        const backgroundColor = this.parseColor(this.getProperty(item.PanelDevicePropertyValueList, 'Background Color'));
        const borderColor = this.parseColor(this.getProperty(item.PanelDevicePropertyValueList, 'Border Color'));
        const borderWidth = this.parseNumber(this.getProperty(item.PanelDevicePropertyValueList, 'Border Width'), 3);
        const fontSize = this.parseNumber(this.getProperty(item.PanelDevicePropertyValueList, 'Font Size'), 14);

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
      const visibleRows = this.parseNumber(this.getProperty(item.PanelDevicePropertyValueList, 'Number of Visible Rows'), 5);
      const children = item.PanelDeviceChildren ?? [];

      return children.slice(0, visibleRows).map(child => ({
        text: this.getProperty(child, 'Text') ?? '',
        bgColor: this.parseColor(this.getProperty(child, 'Color')),
        color: this.parseColor(this.getProperty(child, 'Text Color') ?? '0'),
      }));
    }

    if (item.PanelDeviceType === 'MOMomentaryPushButton') {
      const firstChild = item.PanelDeviceChildren?.[0] ?? [];

      return [
        {
          text: this.getProperty(firstChild, 'Text') ?? '',
          bgColor: this.parseColor(this.getProperty(firstChild, 'Color') ?? this.getProperty(item.PanelDevicePropertyValueList, 'Border Color')),
          color: this.parseColor(this.getProperty(firstChild, 'Text Color') ?? '16316664'),
        },
      ];
    }

    const indicatorTag = this.getProperty(item.PanelDevicePropertyValueList, 'Indicator Tag') ?? '';
    const text = indicatorValueMap.get(indicatorTag) ?? '';

    return [
      {
        text,
        bgColor: this.parseColor(this.getProperty(item.PanelDevicePropertyValueList, 'Background Color')),
        color: this.parseColor(this.getProperty(item.PanelDevicePropertyValueList, 'Text Color') ?? '16316664'),
      },
    ];
  }

  private getProperty(propertyList: string[] | null | undefined, key: string): string | undefined {
    if (!propertyList) {
      return undefined;
    }

    const target = propertyList.find(item => item.startsWith(`${key}:`));
    return target?.slice(key.length + 1).trim();
  }

  private parseNumber(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? '', 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  private parseColor(value: string | undefined): string {
    const parsed = Number.parseInt(value ?? '0', 10);
    const normalized = Math.max(0, Math.min(parsed, 0xffffff));

    const blue = (normalized >> 16) & 0xff;
    const green = (normalized >> 8) & 0xff;
    const red = normalized & 0xff;

    return `rgb(${red}, ${green}, ${blue})`;
  }
}
