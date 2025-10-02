/**
 * Performance feature types
 */

export interface PerformanceMetrics {
  fps: number;
  avgFps: number;
  minFps: number;
  maxFps: number;
  frameTime: number;
  memoryUsage?: number;
  timestamp: number;
}

export interface GPUCapabilities {
  tier: 'high' | 'medium' | 'low' | 'minimal';
  renderer: string;
  vendor: string;
  maxTextureSize: number;
  webgl2Supported: boolean;
  extensionsSupported: string[];
}

export interface BatteryStatus {
  level: number; // 0-1
  charging: boolean;
  chargingTime?: number;
  dischargingTime?: number;
}

export type QualityLevel = 'high' | 'medium' | 'low' | 'minimal';

export interface PerformanceConfig {
  enabled?: boolean;
  targetFPS?: number;
  adaptiveQuality?: boolean;
  batteryAware?: boolean;
  pauseOnHidden?: boolean;
  showStats?: boolean;
  qualityLevels?: {
    high: QualitySettings;
    medium: QualitySettings;
    low: QualitySettings;
    minimal: QualitySettings;
  };
}

export interface QualitySettings {
  particleCount: number;
  resolution: number; // 0-1 multiplier
  shadowQuality: 'high' | 'medium' | 'low' | 'off';
  antialiasing: boolean;
  postProcessing: boolean;
}

export interface PerformanceState {
  currentQuality: QualityLevel;
  metrics: PerformanceMetrics;
  gpuCapabilities?: GPUCapabilities;
  batteryStatus?: BatteryStatus;
  isTabVisible: boolean;
  isPaused: boolean;
}
