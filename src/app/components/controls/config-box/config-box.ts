import { Component, Input } from '@angular/core';

export type BoxDirection = 'column' | 'row';

export interface BoxSection {
  text: string;
  bgColor: string;
  color?: string;
  flex?: number;
}

@Component({
  selector: 'app-config-box',
  standalone: true,
  templateUrl: './config-box.html',
  styleUrl: './config-box.css',
})
export class ConfigBox {
  @Input() width = 170;
  @Input() height = 110;
  @Input() borderColor = '#0b1ddf';
  @Input() borderWidth = 3;
  @Input() direction: BoxDirection = 'column';
  @Input() backgroundColor = '#0d22ff';
  @Input() textColor = '#ffffff';
  @Input() fontSize = 18;
  @Input() sections: BoxSection[] = [];

  get renderedSections(): BoxSection[] {
    if (this.sections.length > 0) {
      return this.sections;
    }

    return [{ text: '', bgColor: this.backgroundColor, color: this.textColor, flex: 1 }];
  }
}
