import { Component, computed, signal } from '@angular/core';
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
  selector: 'app-menu-screen-1',
  imports: [ConfigBox],
  templateUrl: './menu-screen-1.html',
  styleUrl: './menu-screen-1.css',
})
export class MenuScreen1 {
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

  private async loadScreenConfig(): Promise<void> {
    try {
      const response = await fetch('assets/project-json/Screens.json');
      if (!response.ok) {
        this.screenLoaded.set(true);
        return;
      }

      const config = (await response.json()) as ScreenFile;
      const screen = config.Screens.find(item => item.ScreenName === 'MenuScreen_1');

      if (!screen) {
        this.screenLoaded.set(true);
        return;
      }

      const backgroundColor = this.parseColor(this.getProperty(screen.ScreenPropertyValueList, 'Background Color'));
      this.screenBackground.set(backgroundColor);
      this.renderDevices.set(this.mapScreenToDevices(screen));
      this.screenLoaded.set(true);
    } catch {
      this.screenLoaded.set(true);
    }
  }

  private mapScreenToDevices(screen: ScreenConfig): RenderDevice[] {
    return screen.PanelDevicesInfos
      .filter(item => item.PanelDeviceType === 'MOGotoScreen' || item.PanelDeviceType === 'MOGotoConfig')
      .map(item => {
        const propertyList = item.PanelDevicePropertyValueList;

        return {
          name: item.PanelDeviceName,
          left: this.parseNumber(this.getProperty(propertyList, 'Left'), 0),
          top: this.parseNumber(this.getProperty(propertyList, 'Top'), 0),
          width: this.parseNumber(this.getProperty(propertyList, 'Width'), 120),
          height: this.parseNumber(this.getProperty(propertyList, 'Height'), 40),
          backgroundColor: this.parseColor(this.getProperty(propertyList, 'Background Color')),
          borderColor: this.parseColor(this.getProperty(propertyList, 'Border Color')),
          borderWidth: this.parseNumber(this.getProperty(propertyList, 'Border Width'), 3),
          fontSize: this.parseNumber(this.getProperty(propertyList, 'Font Size'), 14),
          sections: [
            {
              text: this.getProperty(propertyList, 'Text') ?? '',
              bgColor: this.parseColor(this.getProperty(propertyList, 'Background Color')),
              color: this.parseColor(this.getProperty(propertyList, 'Text Color') ?? '16316664'),
            },
          ],
        };
      });
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
