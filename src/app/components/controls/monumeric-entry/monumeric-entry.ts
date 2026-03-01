import { Component, Input } from '@angular/core';

export type BoxDirection = 'column' | 'row';

export interface BoxSection {
  text: string;
  bgColor: string;
  color?: string;
  flex?: number;
}

// 定义 MONumericEntry 类型的属性接口
export interface MONumericEntryProps {
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
  minValue?: number; // MONumericEntry 特有属性
  maxValue?: number; // MONumericEntry 特有属性
  decimalPlaces?: number; // MONumericEntry 特有属性
}

@Component({
  selector: 'app-monumeric-entry',
  standalone: true,
  templateUrl: './monumeric-entry.html',
  styleUrl: './monumeric-entry.css',
})
export class MONumericEntry {
  @Input() width = 170;
  @Input() height = 110;
  @Input() borderColor = '#0b1ddf';
  @Input() borderWidth = 3;
  @Input() direction: BoxDirection = 'column';
  @Input() backgroundColor = '#0d22ff';
  @Input() textColor = '#ffffff';
  @Input() fontSize = 18;
  @Input() sections: BoxSection[] = [];
  
  // MONumericEntry 特定属性
  @Input() numericProps?: MONumericEntryProps;
  
  // 从 numericProps 中获取属性，如果没有则使用默认值
  get effectiveWidth(): number {
    return this.numericProps?.width || this.width;
  }
  
  get effectiveHeight(): number {
    return this.numericProps?.height || this.height;
  }
  
  get effectiveBorderColor(): string {
    return this.numericProps?.borderColor || this.borderColor;
  }
  
  get effectiveBorderWidth(): number {
    return this.numericProps?.borderWidth || this.borderWidth;
  }
  
  get effectiveBackgroundColor(): string {
    return this.numericProps?.backgroundColor || this.backgroundColor;
  }
  
  get effectiveTextColor(): string {
    return this.numericProps?.textColor || this.textColor;
  }
  
  get effectiveFontSize(): number {
    return this.numericProps?.fontSize || this.fontSize;
  }
  
  get effectiveText(): string {
    return this.numericProps?.text || '';
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