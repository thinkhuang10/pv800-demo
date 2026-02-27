import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigBox, BoxSection } from '../../controls/config-box/config-box';
import { ScreenFile, ScreenConfig, PanelDeviceInfo, RenderDevice, DeviceLayout } from '../screen-types';
import { getProperty, parseNumber, parseColor, getDeviceLayout } from '../screen-utils';
import { fetchScreenConfig } from '../screen-loader';

@Component({
  selector: 'app-menu-screen-1',
  imports: [ConfigBox],
  templateUrl: './menu-screen-1.html',
  styleUrl: './menu-screen-1.css',
})
export class MenuScreen1 {
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
    fetchScreenConfig(this.http, 'MenuScreen_1').subscribe({
      next: (screen: ScreenConfig | undefined) => {
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
    return screen.PanelDevicesInfos
      .filter((item: PanelDeviceInfo) => item.PanelDeviceType === 'MOGotoScreen' || item.PanelDeviceType === 'MOGotoConfig')
      .map((item: PanelDeviceInfo) => {
          const propertyList = item.PanelDevicePropertyValueList;
        const layout: DeviceLayout = getDeviceLayout(propertyList);

        return {
          name: item.PanelDeviceName,
          left: layout.left,
          top: layout.top,
          width: layout.width,
          height: layout.height,
          backgroundColor: layout.backgroundColor,
          borderColor: layout.borderColor,
          borderWidth: layout.borderWidth,
          fontSize: layout.fontSize,
          sections: [
            {
              text: getProperty(propertyList, 'Text') ?? '',
              bgColor: parseColor(getProperty(propertyList, 'Background Color')),
              color: parseColor(getProperty(propertyList, 'Text Color') ?? '16316664'),
            },
          ],
        };
      });
  }

}
