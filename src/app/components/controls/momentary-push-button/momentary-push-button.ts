import { Component, Input } from '@angular/core';

export type BoxDirection = 'column' | 'row';

export interface BoxSection {
  text: string;
  bgColor: string;
  color?: string;
  flex?: number;
}

// 定义 MOMomentaryPushButton 类型的属性接口
export interface MOMomentaryPushButtonProps {
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
  holdTime?: number; // MOMomentaryPushButton 特有属性
  writeTag?: string; // MOMomentaryPushButton 特有属性
}

@Component({
  selector: 'app-momentary-push-button',
  standalone: true,
  templateUrl: './momentary-push-button.html',
  styleUrl: './momentary-push-button.css',
})
export class MOMomentaryPushButton {
  @Input() width = 170;
  @Input() height = 110;
  @Input() borderColor = '#0b1ddf';
  @Input() borderWidth = 3;
  @Input() direction: BoxDirection = 'column';
  @Input() backgroundColor = '#0d22ff';
  @Input() textColor = '#ffffff';
  @Input() fontSize = 18;
  @Input() sections: BoxSection[] = [];
  
  // MOMomentaryPushButton 特定属性
  @Input() buttonProps?: MOMomentaryPushButtonProps;
  
  // 从 buttonProps 中获取属性，如果没有则使用默认值
  get effectiveWidth(): number {
    return this.buttonProps?.width || this.width;
  }
  
  get effectiveHeight(): number {
    return this.buttonProps?.height || this.height;
  }
  
  get effectiveBorderColor(): string {
    return this.buttonProps?.borderColor || this.borderColor;
  }
  
  get effectiveBorderWidth(): number {
    return this.buttonProps?.borderWidth || this.borderWidth;
  }
  
  get effectiveBackgroundColor(): string {
    return this.buttonProps?.backgroundColor || this.backgroundColor;
  }
  
  get effectiveTextColor(): string {
    return this.buttonProps?.textColor || this.textColor;
  }
  
  get effectiveFontSize(): number {
    return this.buttonProps?.fontSize || this.fontSize;
  }
  
  get effectiveText(): string {
    return this.buttonProps?.text || '';
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