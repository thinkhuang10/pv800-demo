import { Component, computed, signal } from '@angular/core';
import { RunContainer, RunPageKey } from './components/run-container/run-container';

interface ScreenFile {
  Screens: Array<{
    ScreenName: string;
  }>;
}

type PageKey = RunPageKey;

interface MenuItem {
  key: PageKey;
  label: string;
}

@Component({
  selector: 'app-root',
  imports: [RunContainer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly menuItems = signal<MenuItem[]>([{ key: 'list-indicator-screen', label: '3 - ListIndicatorScreen' }]);
  readonly selectedPageKey = signal<PageKey>('list-indicator-screen');
  readonly runMode = signal(false);

  readonly selectedPageLabel = computed(() =>
    this.menuItems().find(item => item.key === this.selectedPageKey())?.label ?? '3 - ListIndicatorScreen',
  );

  constructor() {
    this.initializeFromUrl();
  }

  selectPage(pageKey: PageKey): void {
    this.selectedPageKey.set(pageKey);
  }

  runCurrentPage(): void {
    const page = this.selectedPageKey();
    const target = new URL(window.location.href);
    target.searchParams.set('run', '1');
    target.searchParams.set('page', page);
    window.open(target.toString(), '_blank', 'noopener,noreferrer');
  }

  /**
   * Download the Screens.json file to the local machine
   */
  downloadScreens(): void {
    fetch('assets/project-json/Screens.json')
      .then(resp => {
        if (!resp.ok) {
          throw new Error('Unable to download configuration');
        }
        return resp.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Screens.json';
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        // ignore errors for now
      });
  }

  private async loadMenuFromScreens(): Promise<void> {
    try {
      const response = await fetch('assets/project-json/Screens.json');
      if (!response.ok) {
        return;
      }

      const config = (await response.json()) as ScreenFile;
      const hasMenuScreen1 = config.Screens.some(item => item.ScreenName === 'MenuScreen_1');

      if (!hasMenuScreen1) {
        return;
      }

      this.menuItems.set([
        { key: 'menu-screen-1', label: '1 - MenuScreen_1' },
        { key: 'list-indicator-screen', label: '3 - ListIndicatorScreen' },
      ]);
      this.selectedPageKey.set('menu-screen-1');
    } catch {
      return;
    }
  }

  private initializeFromUrl(): void {
    const params = new URLSearchParams(window.location.search);
    const isRunMode = params.get('run') === '1';
    this.runMode.set(isRunMode);
    document.body.classList.toggle('run-mode', isRunMode);

    const page = params.get('page');
    if (page === 'menu-screen-1' || page === 'list-indicator-screen') {
      this.selectedPageKey.set(page);
    }

    if (!isRunMode) {
      this.loadMenuFromScreens();
    }
  }
}
