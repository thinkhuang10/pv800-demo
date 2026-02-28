import { Component, Input, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigBox } from '../controls/config-box/config-box';
import { ScreenConfig } from './screen-types';
import { fetchScreenConfig } from './screen-loader';
import { mapScreenToDevices } from './screen-mapper';
import { parseColor, getProperty } from './screen-utils';

@Component({
  selector: 'app-screen-engine',
  imports: [ConfigBox],
  templateUrl: './screen-engine.html',
  styleUrl: './screen-engine.css',
})
export class ScreenEngine {
  private readonly http = inject(HttpClient);

  @Input() screenName = '';

  readonly screenBackground = signal('#d8d8d8');
  readonly renderDevices = signal([] as any[]);
  readonly screenLoaded = signal(false);

  readonly boxItems = computed(() =>
    this.renderDevices().sort((first: any, second: any) => {
      if (first.top === second.top) {
        return first.left - second.left;
      }

      return first.top - second.top;
    }),
  );

  ngOnChanges(): void {
    // reload when screenName input changes
    this.loadScreenConfig();
  }

  ngOnInit(): void {
    if (!this.screenName) return;
    this.loadScreenConfig();
  }

  private loadScreenConfig(): void {
    if (!this.screenName) {
      this.screenLoaded.set(true);
      return;
    }

    fetchScreenConfig(this.http, this.screenName).subscribe({
      next: (screen: ScreenConfig | undefined) => {
        if (!screen) {
          this.screenLoaded.set(true);
          return;
        }

        const backgroundColor = parseColor(getProperty(screen.ScreenPropertyValueList, 'Background Color'));
        this.screenBackground.set(backgroundColor);
        this.renderDevices.set(mapScreenToDevices(screen));
        this.screenLoaded.set(true);
      },
      error: () => {
        this.screenLoaded.set(true);
      },
    });
  }
}
