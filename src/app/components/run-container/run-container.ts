import { Component, input, computed } from '@angular/core';
import { ScreenEngine } from '../pages/screen-engine';

export type RunPageKey = 'menu-screen-1' | 'list-indicator-screen';

@Component({
  selector: 'app-run-container',
  imports: [ScreenEngine],
  templateUrl: './run-container.html',
  styleUrl: './run-container.css',
})
export class RunContainer {
  pageKey = input<RunPageKey>('list-indicator-screen');
  showFrame = input<boolean>(true);

  readonly screenName = computed(() =>
    this.pageKey() === 'menu-screen-1' ? 'MenuScreen_1' : 'ListIndicatorScreen',
  );
}