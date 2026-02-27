import { Component, Input } from '@angular/core';
import { ListIndicatorScreen } from '../../pages/list-indicator-screen/list-indicator-screen';
import { MenuScreen1 } from '../../pages/menu-screen-1/menu-screen-1';

export type RunPageKey = 'menu-screen-1' | 'list-indicator-screen';

@Component({
  selector: 'app-run-container',
  imports: [MenuScreen1, ListIndicatorScreen],
  templateUrl: './run-container.html',
  styleUrl: './run-container.css',
})
export class RunContainer {
  @Input() pageKey: RunPageKey = 'list-indicator-screen';
  @Input() showFrame = true;
}
