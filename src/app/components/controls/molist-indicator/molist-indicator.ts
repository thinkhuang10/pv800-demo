import { Component, Input } from '@angular/core';

export type BoxDirection = 'column' | 'row';

export interface BoxSection {
  text: string;
  bgColor: string;
  color?: string;
  flex?: number;
}

// 定义 MOListIndicator 类型的属性接口
export interface MOListIndicatorProps {
  panelDeviceNumber?: number;
  panelDeviceName?: string;
  text: string;
  width: number;
  height: number;
  left: number;
  top: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderStyle: number;
  cornerRadius: number;
  textColor: string;
  fontName: string;
  fontSize: number;
  fontBold: number;
  fontItalic: number;
  fontUnderline: number;
  alignment: number;
  wordWrap: boolean;
  enableTouch: boolean;
  enableTouchIndication: boolean;
  touchIndicationColor: string;
  touchIndicationWidth: number;
  numberOfVisibleRows?: number; // MOListIndicator 特有属性
}

@Component({
  selector: 'app-molist-indicator',
  standalone: true,
  templateUrl: './molist-indicator.html',
  styleUrl: './molist-indicator.css',
})
export class MOListIndicator {
  @Input() width = 170;
  @Input() height = 110;
  @Input() borderColor = '#0b1ddf';
  @Input() borderWidth = 3;
  @Input() direction: BoxDirection = 'column';
  @Input() backgroundColor = '#0d22ff';
  @Input() textColor = '#ffffff';
  @Input() fontSize = 18;
  @Input() sections: BoxSection[] = [];
  
  // MOListIndicator 特定属性
  @Input() listProps?: MOListIndicatorProps;
  
  // 从 listProps 中获取属性，如果没有则使用默认值
  get effectiveWidth(): number {
    return this.listProps?.width || this.width;
  }
  
  get effectiveHeight(): number {
    return this.listProps?.height || this.height;
  }
  
  get effectiveBorderColor(): string {
    return this.listProps?.borderColor || this.borderColor;
  }
  
  get effectiveBorderWidth(): number {
    return this.listProps?.borderWidth || this.borderWidth;
  }
  
  get effectiveBackgroundColor(): string {
    return this.listProps?.backgroundColor || this.backgroundColor;
  }
  
  get effectiveTextColor(): string {
    return this.listProps?.textColor || this.textColor;
  }
  
  get effectiveFontSize(): number {
    return this.listProps?.fontSize || this.fontSize;
  }
  
  get effectiveText(): string {
    return this.listProps?.text || '';
  }

  get renderedSections(): BoxSection[] {
    if (this.sections.length > 0) {
      return this.sections;
    }

    return [{ 
      text: this.effectiveText, 
      bgColor: this.effectiveBackgroundColor, 
      color: this.effectiveTextColor, 
      flex: 1 
    }];
  }
}