import { BoxSection } from '../controls/mogoto-config/mogoto-config';

export interface ScreenFile {
  Screens: ScreenConfig[];
}

export interface ScreenConfig {
  ScreenName: string;
  ScreenPropertyValueList: string[];
  PanelDevicesInfos: PanelDeviceInfo[];
}

export interface PanelDeviceInfo {
  PanelDeviceName: string;
  PanelDeviceType: string;
  PanelDevicePropertyValueList: string[];
  PanelDeviceChildren: string[][] | null;
}

export interface DeviceLayout {
  left: number;
  top: number;
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  fontSize: number;
}

export interface RenderDevice {
  name: string;
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  fontSize: number;
  sections: BoxSection[];
}