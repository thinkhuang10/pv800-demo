import { Component, Input } from '@angular/core';

export type BoxDirection = 'column' | 'row';

export interface BoxSection {
  text: string;
  bgColor: string;
  color?: string;
  flex?: number;
}

// 定义 MOGotoConfig 类型的属性接口
export interface MOGotoConfigProps {
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
  
  // MOGotoConfig 特定属性
  @Input() configProps?: MOGotoConfigProps;
  
  // 从 configProps 中获取属性，如果没有则使用默认值
  get effectiveWidth(): number {
    return this.configProps?.width || this.width;
  }
  
  get effectiveHeight(): number {
    return this.configProps?.height || this.height;
  }
  
  get effectiveBorderColor(): string {
    return this.configProps?.borderColor || this.borderColor;
  }
  
  get effectiveBorderWidth(): number {
    return this.configProps?.borderWidth || this.borderWidth;
  }
  
  get effectiveBackgroundColor(): string {
    return this.configProps?.backgroundColor || this.backgroundColor;
  }
  
  get effectiveTextColor(): string {
    return this.configProps?.textColor || this.textColor;
  }
  
  get effectiveFontSize(): number {
    return this.configProps?.fontSize || this.fontSize;
  }
  
  get effectiveText(): string {
    return this.configProps?.text || '';
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